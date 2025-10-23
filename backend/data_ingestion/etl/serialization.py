# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import json
from hashlib import sha256
from datetime import datetime, date
from sqlmodel import Session, SQLModel, select
from kg.utils.read import get_table_sizes
from kg.utils.embeddings import create_embeddings
from kg.tables import Entity, UEntity
from kg.engine import engine
from kg.utils.clean import remove_duplicate_dict_values


class DateEncoder(json.JSONEncoder):
    """Convert datetime objects to strings when serializing files.
    Use it like this: json.dumps(data, cls=DateEncoder)
    """

    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return super().default(obj)


def unserialize_dates(obj: dict, datetime_keys=["published_at", "added_at"]) -> dict:
    """
    Unserialize dates from strings back to datetime objects.
    This is meant to run when JSON data is read from file.
    """
    if isinstance(obj, dict):
        for key, value in obj.items():
            if key in datetime_keys and isinstance(value, str):
                try:
                    if key == "published_at":
                        obj[key] = datetime.fromisoformat(value).date()
                    else:
                        obj[key] = datetime.fromisoformat(value)
                except ValueError:
                    pass
            else:
                obj[key] = unserialize_dates(value)
    elif isinstance(obj, list):
        obj = [unserialize_dates(item) for item in obj]
    return obj


def string_to_date(date_string: str) -> datetime:
    """Convert a string to a datetime object."""
    date_string = str(date_string)
    if len(date_string) == 4:
        return datetime.strptime(date_string, "%Y").date()
    try:
        # accept dates with fractional seconds
        return datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%S.%fZ").date()
    except ValueError:
        # fallback to parsing without fractional seconds
        return datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%SZ").date()


def insert_objects_from_dict(
    new_db_rows: dict[str:list],
    verbose: bool = False,
) -> None:
    """
    Insert database objects into the database.
    They should be stored in a dicttionary, with table names
    as the keys, and lists of objects as the values.
    Example:
    new_db_rows = {
        "report": [Report(), ...],
        "excerpt": [Excerpt(), ...],
        "uentity": [UEntity(), ...]
    }
    """
    for table_name, objects in new_db_rows.items():
        if verbose:
            print(f"Inserting {len(objects)} rows into the '{table_name}' table...")
        with Session(engine) as session:
            for obj in objects:
                session.add(obj)
            session.commit()
    get_table_sizes(verbose=True)


def vectorize_db_objects(
    object_dict: dict[str : list[SQLModel]],
    verbose: bool = False,
) -> dict:
    """
    Create vector embeddings for model objects before
    they are inserted into the database.

    Input should be a dict that looks like:
    object_dict = {
        "report": [DataReport(), ...],
        "excerpt": [DataExcerpt(), ...],
        "uentity": [UEntity(), ...]
    }
    If the dict contains other other keys, they will be ignored and returned unchanged.
    Returns the same object dict, but where each object contains an attribute called "embedding"
    that contains the calculated vector embedding.

    """
    for key in ["report", "excerpt", "uentity"]:
        if verbose:
            print(f"Creating vector embeddings for {key}...")
        vec_key = "title" if key == "uentity" else "description"
        strings = [str(getattr(r, vec_key, "_")) for r in object_dict[key]]
        embeddings = create_embeddings(strings)
        for r, embedding in zip(object_dict[key], embeddings):
            r.embedding = embedding
    return object_dict


def entities_to_models(
    input_entities: list[dict],
    uentity_id_map: dict[str, str],
    parent_ids: dict,
) -> dict:
    """
    Insert new entities into the data model,
    create new unique entities if they don't already exist,
    and insert the new unique entities into the data model.
    Return the new modeled entities and unique entities.

    Args:
        input_entities (list[dict]): List of input entities like {"title": str, "entity_type": str}
        uentity_id_map (dict[str, str]): Map of unique entity title to unique entity ID
        parent_ids (dict): Parent IDs for the new entities, which should include keys for
            "report", "source", and "excerpt".

    Returns:
        dict: A dictionary containing the new entities and unique entities

    """
    new_unique_entities = []
    new_entities = []

    # remove duplicate entities
    input_entities = remove_duplicate_dict_values(input_entities, "title")

    # iterate over all the entities
    for _ent in input_entities:
        _ent["title"] = str(_ent["title"]).strip().lower()

        # if this entity is new, create a new unique entity for it
        uentity_id = uentity_id_map.get(_ent["title"], None)
        if not uentity_id:
            new_uentity = UEntity(
                title=_ent["title"],
                entity_type=_ent["entity_type"],
                embedding=[],
            )
            uentity_id = new_uentity.id
            uentity_id_map[_ent["title"]] = uentity_id
            new_unique_entities.append(new_uentity)

        # create the entity object
        new_entity = Entity(
            report_id=parent_ids["report"],
            source_id=parent_ids["source"],
            uentity_id=uentity_id,
            excerpt_id=parent_ids["excerpt"],
            title=_ent["title"],
            entity_type=_ent["entity_type"],
        )
        new_entities.append(new_entity)
    return {
        "entities": new_entities,
        "uentities": new_unique_entities,
        "entity_id_map": uentity_id_map,
    }


def get_unique_entity_id_map() -> dict:
    """
    Get a mapping of str -> id for all unique entities in the database.
    Use this mapping to find foreign key relations from Entity -> UEntity.
    """
    with Session(engine) as session:
        rows = session.exec(select(UEntity.title, UEntity.id)).all()
    return {str(getattr(row, "title")): row.id for row in rows}


def get_sha256_hash(data: str | dict) -> str:
    """Get SHA-265 hash of a dataset or string."""
    if isinstance(data, dict):
        data = json.dumps(data, cls=DateEncoder)
    elif not isinstance(data, str):
        data = str(data)
    return sha256(data.encode("utf-8")).hexdigest()
