# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

from sqlmodel import SQLModel
from kg.tables import Source, Report, Excerpt, UEntity, Entity


class TableIndex:
    """Convenience index for the database tables."""

    # Map table names to the table class
    MAP = {
        "source": Source,
        "report": Report,
        "excerpt": Excerpt,
        "uentity": UEntity,
        "entity": Entity,
    }

    # all parent foreign keys that an object might have
    PARENT_KEYS = {
        "source_id": "source",
        "report_id": "report",
        "excerpt_id": "excerpt",
        "uentity_id": "uentity",
    }

    @classmethod
    def get_table(cls, table_name: str) -> SQLModel:
        """Return the table class from a given table name."""
        table = cls.MAP.get(table_name)
        if table:
            return table
        raise ValueError(f"Invalid table name: '{table_name}'.")
