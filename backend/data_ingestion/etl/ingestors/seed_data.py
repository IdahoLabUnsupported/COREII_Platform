# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import os
import json
from sqlmodel import Session
from kg.engine import engine
from kg.tables import Source
from kg.table_index import TableIndex
from kg.utils.read import get_unique_values, get_table_sizes
from settings import SEED_DATA_PATH


def seed_tables(verbose=True):
    """Seed the database tables with initial static data."""

    with open(SEED_DATA_PATH, "r") as file:
        SEED_DATA = json.load(file)

    for table_name, data in SEED_DATA.items():
        table = TableIndex.MAP[table_name]
        existing_titles = get_unique_values(table, "title")
        new_rows = [table(**d) for d in data if d["title"] not in existing_titles]
        if new_rows:
            with Session(engine) as session:
                for row in new_rows:
                    session.add(row)
                session.commit()
    if verbose:
        print("Inserted static seed data.")
        get_table_sizes(verbose=True)


if __name__ == "__main__":
    seed_tables()
