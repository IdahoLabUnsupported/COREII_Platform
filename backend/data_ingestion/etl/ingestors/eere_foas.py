# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

"""
Ingest the EERE FOAs dataset from a JSON file.

Steps:
- Read the JSON file from a local directory.
- Create a DataReport instance for each FOA, and link it to the parent DataSource for EERE-FOAs.
- Create a DataExcerpt instance for each Report, and link it to its parent DataReport.
- Create Entity instances for each document and contact listed in the FOA.
- Insert all the instances into the database.

"""

import os
from etl import serialization, filesystem
from kg.utils.read import get_unique_values, get_data_source_id
from kg.table_index import TableIndex
from kg.tables import Report, Excerpt
from settings import RAW_DATA_PATH_EERE_FOAS


def process_eere_foas() -> list[dict]:
    """
    Clean and transform the EERE FOAs into the database schema.
    """
    # static data that to be referenced in the new reports
    source_id = get_data_source_id("EERE FOAS")
    uentity_id_map = serialization.get_unique_entity_id_map()

    # get existing EERE FOAs from the database so we don't duplicate them
    existing_identifiers = get_unique_values(Report, "identifier")

    # create new database rows before inserting them
    new_db_rows = {k: [] for k in TableIndex.MAP}

    # read the local FOA JSON file
    _data = filesystem.read_json_file(RAW_DATA_PATH_EERE_FOAS)

    # iterate over each FOA in the file
    for foa in _data["data"]:

        # =============== Model each FOA as a data report ================

        if not foa.get("announcement_number"):
            continue

        # skip FOAs that have been ingested previously
        identifier = f"EERE FOA - {foa['announcement_number']}"

        hash = serialization.get_sha256_hash(_data)
        if identifier in existing_identifiers:
            continue

        year = None
        fa_deadline = foa.get("fa_deadline")
        if fa_deadline:
            try:
                year = serialization.string_to_date(fa_deadline.split("-")[0])
            except:
                pass

        title = foa.get("announcement_title", foa["announcement_number"])

        new_report = Report(
            source_id=source_id,
            identifier=identifier,
            title=title,
            report_type=f"EERE FOA",
            uri="https://eere-exchange.energy.gov/",
            report_metadata=foa,
            n_excerpts=1,
            description=foa.get("description", title),
            embedding=[],
            published_at=year,
            version=1,
            sha256hash=hash,
        )
        new_db_rows["report"].append(new_report)

        # ===== model the FOA as a single excerpt =====
        new_excerpt = Excerpt(
            report_id=new_report.id,
            source_id=source_id,
            title=title,
            content_type="json",
            excerpt_index=0,
            text_content=None,
            json_content=foa,
            description=foa.get("description", title),
            embedding=[],
        )
        new_db_rows["excerpt"].append(new_excerpt)

        # ================= Extract entities =======================
        input_entities = []

        if foa.get("program"):
            input_entities.append(
                {
                    "title": foa["program"],
                    "entity_type": "PROGRAM",
                }
            )
        if foa.get("announcement_type"):
            input_entities.append(
                {
                    "title": foa["announcement_type"],
                    "entity_type": "FUNDING ANNOUNCEMENT TYPE",
                }
            )

        _new_entity_dict = serialization.entities_to_models(
            input_entities=input_entities,
            uentity_id_map=uentity_id_map,
            parent_ids={
                "report": new_report.id,
                "source": source_id,
                "excerpt": new_excerpt.id,
            },
        )
        new_db_rows["entity"].extend(_new_entity_dict["entities"])
        new_db_rows["uentity"].extend(_new_entity_dict["uentities"])
        uentity_id_map = _new_entity_dict["entity_id_map"]

    # ===================== Handle vector embeddings ===================
    new_db_rows = serialization.vectorize_db_objects(new_db_rows)
    return new_db_rows


def main() -> None:
    """Ingest the EERE FOA dataset."""

    print("Processing EERE FOA data...")
    new_db_rows = process_eere_foas()

    print("Performing database insertion...")
    serialization.insert_objects_from_dict(new_db_rows)


if __name__ == "__main__":
    main()
