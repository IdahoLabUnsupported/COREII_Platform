# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import os
from sqlmodel import SQLModel
from sqlalchemy.schema import CreateTable
from sqlalchemy.engine import Engine
from sqlalchemy import inspect

from kg.engine import engine
from kg.utils.read import get_table_sizes


# Build a path for exporting the database schema
EXPORT_SCHEMA_PATH = os.path.join(
    os.path.dirname(__file__),
    "exported_schema",
)


def initialize_tables(schema_path: str | None = None):
    """
    Create the database tables if they don't exist yet.
    Run this each time the database needs to be configured.
    Optionally export the table schema to a DBML file.
    """
    # create all the tables
    SQLModel.metadata.create_all(engine)

    # export schema to DBML and SQL files
    if schema_path:
        if not os.path.exists(schema_path):
            os.makedirs(schema_path)
        export_dbml_schema(engine, os.path.join(schema_path, "db_schema.dbml"))
        export_sql_schema(engine, os.path.join(schema_path, "db_schema.sql"))
    get_table_sizes(verbose=True)
    print("Database tables initialized.")


def export_dbml_schema(engine: Engine, schema_path: str) -> None:
    """Export the database schema to DBML."""
    dbml_content = ""
    inspector = inspect(engine)
    for table_name in inspector.get_table_names():
        dbml_content += f"Table {table_name} {{\n"
        for column in inspector.get_columns(table_name):
            column_name = column["name"]
            data_type = _get_dbml_type(column["type"])
            dbml_content += f"  {column_name} {data_type}"
            if column.get("primary_key"):
                dbml_content += " [pk]"
            dbml_content += "\n"
        dbml_content += "}\n\n"
    # add foreign key relationships
    for table_name in inspector.get_table_names():
        for fk in inspector.get_foreign_keys(table_name):
            referred_table = fk["referred_table"]
            constrained_columns = fk["constrained_columns"]
            referred_columns = fk["referred_columns"]
            for local_col, remote_col in zip(constrained_columns, referred_columns):
                dbml_content += (
                    f"Ref: {table_name}.{local_col} > {referred_table}.{remote_col}\n"
                )
    with open(schema_path, "w") as f:
        f.write(dbml_content.strip().strip())


def export_sql_schema(engine: Engine, schema_path: str) -> None:
    """Export the database schema to SQL."""
    inspector = inspect(engine)
    sql_content = ""
    for table_name in inspector.get_table_names():
        table = SQLModel.metadata.tables[table_name]
        sql_content += str(CreateTable(table).compile(engine)).strip() + ";\n\n"
    with open(schema_path, "w") as f:
        f.write(sql_content.strip())


def _get_dbml_type(column_type):
    type_str = str(column_type)
    if "UUID" in type_str:
        return "uuid"
    elif "VARCHAR" in type_str:
        return "varchar"
    elif "INTEGER" in type_str:
        return "integer"
    return type_str.lower()


if __name__ == "__main__":
    initialize_tables(schema_path=EXPORT_SCHEMA_PATH)
