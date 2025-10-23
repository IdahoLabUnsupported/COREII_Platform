# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

"""
Define the database table schema using Python classes.
"""

from datetime import date
from typing import ClassVar, Optional
from sqlmodel import Field, Column, Field, Relationship
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import Text, String, INT, Date

from kg.base_tables import BaseTable, BaseTableWithEmbeddings


class Source(BaseTable, table=True):
    """Original data source. Examples: OSTI, EIA."""

    RELATIONS: ClassVar[list[str]] = ["reports"]

    title: str = Field(sa_column=Column(Text, unique=True))
    description: str = Field(sa_column=Column(Text))
    abbreviation: str = Field(sa_column=Column(Text, unique=True))
    uri: Optional[str] = Field(default=None, sa_column=Column(Text, nullable=True))

    reports: list["Report"] = Relationship(back_populates="source")
    excerpts: list["Excerpt"] = Relationship(back_populates="source")
    entities: list["Entity"] = Relationship(back_populates="source")


class Report(BaseTableWithEmbeddings, table=True):
    """
    Individual report, which could be a document or dataset.
    Examples: an article from OSTI, a JSON export from EIA.
    """

    RELATIONS: ClassVar[list[str]] = ["source", "excerpts"]

    source_id: str = Field(foreign_key="source.id", index=True)
    identifier: str = Field(sa_column=Column(Text))
    title: str = Field(sa_column=Column(Text))
    report_type: str = Field(sa_column=Column(Text))
    uri: Optional[str] = Field(default=None, sa_column=Column(Text, nullable=True))
    report_metadata: Optional[dict] = Field(default=None, sa_type=JSONB, nullable=True)
    n_excerpts: int = Field(sa_column=Column(INT))
    description: str = Field(sa_column=Column(Text))
    sha256hash: str = Field(sa_column=Column(String(64)))
    version: int = Field(default=0, sa_column=Column(INT))
    published_at: Optional[date] = Field(
        default=None, sa_column=Column(Date, nullable=True)
    )

    source: Source = Relationship(back_populates="reports")
    excerpts: list["Excerpt"] = Relationship(back_populates="report")
    entities: list["Entity"] = Relationship(back_populates="report")


class Excerpt(BaseTableWithEmbeddings, table=True):
    """
    Excerpt (chunk) of text or numerical data from an original data report.
    Example: a paragraph from a text document or a JSON object from a dataset.
    """

    RELATIONS: ClassVar[list[str]] = ["source", "report", "entities"]

    report_id: str = Field(foreign_key="report.id", index=True)
    source_id: str = Field(foreign_key="source.id", index=True)
    title: str = Field(sa_column=Column(Text))
    content_type: str = Field(sa_column=Column(Text))
    json_content: Optional[dict] = Field(default=None, sa_type=JSONB, nullable=True)
    description: str = Field(sa_column=Column(Text))
    excerpt_index: int = Field(sa_column=Column(INT))
    text_content: Optional[str] = Field(
        default=None, sa_column=Column(Text, nullable=True)
    )

    source: Source = Relationship(back_populates="excerpts")
    report: Report = Relationship(back_populates="excerpts")
    entities: list["Entity"] = Relationship(back_populates="excerpt")


class UEntity(BaseTableWithEmbeddings, table=True):
    """
    Unique individual entities (people, places, dates) extracted from
    data excerpts and deduplicated.
    """

    RELATIONS: ClassVar[list[str]] = ["entities"]

    title: str = Field(sa_column=Column(Text, unique=True))
    entity_type: str = Field(sa_column=Column(Text))

    entities: list["Entity"] = Relationship(back_populates="uentity")


class Entity(BaseTable, table=True):
    """
    Individual entities (people, places, dates) extracted from data excerpts.
    """

    RELATIONS: ClassVar[list[str]] = ["source", "report", "excerpt", "uentity"]

    uentity_id: str = Field(foreign_key="uentity.id", index=True)
    report_id: str = Field(foreign_key="report.id", index=True)
    source_id: str = Field(foreign_key="source.id", index=True)
    excerpt_id: str = Field(foreign_key="excerpt.id", index=True)
    title: str = Field(sa_column=Column(Text))
    entity_type: str = Field(sa_column=Column(Text))

    source: Source = Relationship(back_populates="entities")
    report: Report = Relationship(back_populates="entities")
    excerpt: Excerpt = Relationship(back_populates="entities")
    uentity: UEntity = Relationship(back_populates="entities")


'''
class MLModel(BaseTable, table=True):
    """Single AI/ML model."""

    enabled: bool = Field(default=True)
    title: str = Field(sa_column=Column(Text, unique=True))
    category: str = Field(sa_column=Column(Text))
    task: str = Field(sa_column=Column(Text))
    creator: str = Field(sa_column=Column(Text))
    uri: Optional[str] = Field(default=None, sa_column=Column(Text, nullable=True))
    description: Optional[str] = Field(
        default=None, sa_column=Column(Text, nullable=True)
    )
'''
