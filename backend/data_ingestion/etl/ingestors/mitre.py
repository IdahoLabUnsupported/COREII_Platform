# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

"""
Ingest the MITRE ATT&CK matrix data from local JSON files.

Steps:
- Read the JSON files from a local directory.
- Create a DataReport instance for each JSON file, and link it to the parent DataSource for MITRE.
- Create a DataExcerpt instance for each matrix column in the JSON file, and link it to its parent DataReport.
- Insert all the instances into the database using SQLModel.

"""

import os
from pathlib import Path
from etl import serialization, filesystem
from kg.utils.read import get_unique_values, get_data_source_id
from kg.table_index import TableIndex
from kg.tables import Report, Excerpt
from settings import RAW_DATA_DIRECTORY_MITRE

# The MITRE ATT&CK matrices are up to date as of May 2025.
YEAR_PUBLISHED = 2025

def process_mitre_files() -> list[dict]:
    """
    Clean and merge the MITRE ATT&CK JSON files into the database schema.
    """
    # static data that to be referenced in the new reports
    source_id = get_data_source_id("MITRE")
    uentity_id_map = serialization.get_unique_entity_id_map()

    # get existing reports from the database so we don't duplicate them
    existing_identifiers = get_unique_values(Report, "identifier")

    # create new database rows before inserting them
    new_db_rows = {k: [] for k in TableIndex.MAP}

    # iterate over all local files
    file_list = filesystem.list_directory_files(
        RAW_DATA_DIRECTORY_MITRE, extensions=["json"]
    )
    for _file in file_list:

        _data = filesystem.read_json_file(_file)

        filename = Path(_file).stem 

        # =============== Model file as a data report ================

        # skip reports that have been ingested previously
        identifier = filename
        hash = serialization.get_sha256_hash(_data)
        if identifier in existing_identifiers:
            continue

        new_report = Report(
            source_id=source_id,
            identifier=f"MITRE ATT&CK {filename}",
            title=filename,
            report_type=f"MITRE ATT&CK {filename}",
            report_metadata=None,
            n_excerpts=len(_data.keys()),
            description=f"The MITRE ATT&ACK {filename}",
            embedding=[],
            published_at=serialization.string_to_date(YEAR_PUBLISHED),
            version=1,
            sha256hash=hash,
        )
        new_db_rows["report"].append(new_report)

        excerpt_index = 0

        # ===== Model matrix columns as excerpts =====
        for key in _data.keys():

            _excerpt_title = f"MITRE ATT&CK {identifier.replace(".json", "")} - {key}"
            new_excerpt = Excerpt(
                report_id=new_report.id,
                source_id=source_id,
                title=_excerpt_title,
                content_type="json",
                excerpt_index=excerpt_index,
                text_content=None,
                description=_excerpt_title,
                embedding=[],
                json_content={
                    key: _data[key]
                },                
            )
            new_db_rows["excerpt"].append(new_excerpt)
            excerpt_index += 1

            # ================= Extract entities =======================
            input_entities = [
                {"title": key, "entity_type": "MITRE ATT&CK MATRIX STAGE"}
            ]
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
    """Ingest the MITRE ATT&CK matrices data."""

    print("Processing MITRE matrices files...")
    new_db_rows = process_mitre_files()

    print("Performing database insertion...")
    serialization.insert_objects_from_dict(new_db_rows)


if __name__ == "__main__":
    main()
