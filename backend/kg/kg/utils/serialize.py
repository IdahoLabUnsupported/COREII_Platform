# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

from sqlmodel import SQLModel
from sqlalchemy.engine.row import RowMapping
from fastapi.encoders import jsonable_encoder
from kg.table_index import TableIndex
from kg.utils.clean import remove_keys


def serialize(obj, exclude_keys: set[str] = {"embedding", "entities"}):
    """Conveniently serialize an object without certain keys."""
    obj = remove_keys(obj, exclude_keys)
    return jsonable_encoder(obj, exclude=exclude_keys)


def serialize_with_type(
    db_obj: SQLModel | list[SQLModel],
    object_type: str,
    exclude_keys: set[str] = {"embedding", "entities"},
) -> dict:
    """Serialize a database object and add its type information."""
    if isinstance(db_obj, (list, RowMapping)):
        return [
            serialize_with_type(_db_obj, object_type, exclude_keys=exclude_keys)
            for _db_obj in db_obj
        ]
    return {**serialize(db_obj, exclude_keys=exclude_keys), "objectType": object_type}


def process_relationships(
    row: SQLModel | list[SQLModel], table_name: str, max_count=50
) -> dict:
    """Process and add relationship data to the serialized object."""
    relation_to_model_map = {
        "uentities": "uentity",
        "entities": "entity",
        "excerpts": "excerpt",
        "reports": "report",
    }
    relations = TableIndex.get_table(table_name).RELATIONS

    if isinstance(row, list):
        return [
            process_relationships(_row, table_name, max_count=max_count) for _row in row
        ]

    serialized_row = serialize_with_type(row, table_name)
    for relation in relations:
        relation_data = getattr(row, relation)
        relation_type = relation_to_model_map.get(relation, relation)
        if isinstance(relation_data, list):
            relation_data = relation_data[:max_count] if relation_data else []
            serialized_row[relation] = [
                serialize_with_type(item, relation_type) for item in relation_data
            ]
        else:
            serialized_row[relation] = serialize_with_type(relation_data, relation_type)
    return serialized_row
