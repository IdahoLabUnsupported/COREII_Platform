# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

"""
Ingest the ARC advisory market dataset from local JSON files.

Steps:
- Read the ARC market data JSON files from a local directory.
- Create a DataReport instance for each JSON file, and link it to the parent DataSource for ARC.
- Create a DataExcerpt instance for each 'Market Share' and 'Forecast' data object in the JSON file, and link it to its parent DataReport.
- Create Entity instances for each company, market, category, and year listed in the report.
- Insert all the instances into the database using SQLModel.

"""

import os
from etl import serialization, filesystem
from kg.utils.read import get_unique_values, get_data_source_id
from kg.table_index import TableIndex
from kg.tables import Report, Excerpt
from settings import RAW_DATA_DIRECTORY_ARC

# The ARC Market data we have access to is Copyrighted 2023.
YEAR_PUBLISHED = 2022

# ARC_RAW_FILE_DIR = os.path.join(RAW_DATA_DIRECTORY, "ARC Market Intelligence Data")


def _process_arc_files() -> list[dict]:
    """
    Clean and merge the ARC JSON files into the database schema.
    """
    # static data that to be referenced in the new reports
    source_id = get_data_source_id("ARC")
    uentity_id_map = serialization.get_unique_entity_id_map()

    # get existing ARC reports from the database so we don't duplicate them
    existing_identifiers = get_unique_values(Report, "identifier")

    # create new database rows before inserting them
    new_db_rows = {k: [] for k in TableIndex.MAP}

    # iterate over all local ARC files
    file_list = filesystem.list_directory_files(
        RAW_DATA_DIRECTORY_ARC, extensions=["json"]
    )
    for _file in file_list:
        _data = filesystem.read_json_file(_file)

        # =============== Model ARC file as a data report ================

        # skip reports that have been ingested previously
        identifier = f"ARC market data - {_data['Study']} - {YEAR_PUBLISHED}"
        hash = serialization.get_sha256_hash(_data)
        if identifier in existing_identifiers:
            continue

        _excerpt_dict = {
            "market share": _data["Data"]["Market Shares"],
            "forecast": _data["Data"]["Forecast"],
        }

        new_report = Report(
            source_id=source_id,
            identifier=identifier,
            title=f"{_data['Study']} {YEAR_PUBLISHED}: market data, shares, and forecast",
            report_type=f"ARC market data - {YEAR_PUBLISHED}",
            # uri=,
            report_metadata={"description": _data["Description"].strip()},
            n_excerpts=len(_excerpt_dict["market share"] + _excerpt_dict["forecast"]),
            description=f"Market data, market shares, and market forecast for {_data['Study'].lower()}.",
            embedding=[],
            published_at=serialization.string_to_date(YEAR_PUBLISHED),
            version=1,
            sha256hash=hash,
        )
        new_db_rows["report"].append(new_report)

        excerpt_index = 0
        # ===== Model ARC market shares and forecast objects as excerpts =====
        for excerpt_type, excerpt_list in _excerpt_dict.items():
            for _excerpt in excerpt_list:
                _excerpt_title = f"{_excerpt['Year']} {_excerpt['Company']} {excerpt_type} for {_excerpt['Study']} - {_excerpt['Segment']}: {_excerpt['Category']} - {_excerpt['Size']} {_excerpt['Units']}"
                new_excerpt = Excerpt(
                    report_id=new_report.id,
                    source_id=source_id,
                    title=_excerpt_title,
                    content_type="json",
                    excerpt_index=excerpt_index,
                    text_content=None,
                    json_content=_excerpt,
                    description=_excerpt_title,
                    embedding=[],
                )
                new_db_rows["excerpt"].append(new_excerpt)
                excerpt_index += 1

                # ================= Extract entities =======================
                input_entities = [
                    {"title": _excerpt["Company"], "entity_type": "ORG"},
                    {"title": _excerpt["Category"], "entity_type": "MARKET"},
                    {"title": _excerpt["Study"], "entity_type": "MARKET"},
                    {"title": str(_excerpt["Year"]), "entity_type": "DATE"},
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
    """Ingest the ARC market advisory dataset."""

    print("Processing raw ARC files...")
    new_db_rows = _process_arc_files()

    print("Performing database insertion...")
    serialization.insert_objects_from_dict(new_db_rows)


if __name__ == "__main__":
    main()
