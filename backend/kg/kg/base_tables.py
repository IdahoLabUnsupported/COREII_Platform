# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import uuid
from numpy import ndarray
from typing import ClassVar
from datetime import datetime
from sqlmodel import SQLModel, Field
from pgvector.sqlalchemy import Vector
from .settings import VECTOR_LENGTH


class BaseTable(SQLModel, table=False):
    """Base table class that others inherit from."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    added_at: datetime = Field(default_factory=lambda: datetime.now())


class BaseTableWithEmbeddings(BaseTable, table=False):
    """Base table with embeddings column that other tbles inherit from."""

    # set the length of vector embeddings for vector columns
    VECTOR_LENGTH: ClassVar[int] = int(VECTOR_LENGTH)

    embedding: list[float] | ndarray = Field(sa_type=Vector(VECTOR_LENGTH))

    # allow custom ndarray type for vector column
    class Config:
        arbitrary_types_allowed = True
