# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

"""
Ingest the EIA data.

- Read the EIA JSONL files from a local directory.
- Create a DataReport instance for each report file, and link it to the parent DataSource.
- Each line of the JSONL file is represented by a DataExcerpt instance and linked to its parent DataReport.
- Create Entity instances for each entity recognized inside the JSONL line.
- Insert all the instances into the database using SQLModel.

"""

import os
import json
from time import time
from itertools import islice
from etl import filesystem, serialization
from kg.table_index import TableIndex
from kg.tables import Report, Excerpt
from kg.utils.read import get_unique_values, get_data_source_id
from settings import RAW_DATA_DIRECTORY_EIA

TARGET_FILENAME = "AEO2023"


def prep_file_list() -> list[str]:
    """Find and prep the list of EIA files to process."""

    # get all directories in the EIA data directory
    path = RAW_DATA_DIRECTORY_EIA
    parent_dirs = [d for d in os.listdir(path) if os.path.isdir(os.path.join(path, d))]

    # get the most recently ingressed directory
    newest_dir_name = max(
        parent_dirs, key=lambda d: os.path.getctime(os.path.join(path, d))
    )
    newest_dir_path = os.path.join(path, newest_dir_name)

    # get target zip folder in most recently ingressed directory
    zip_path = os.path.join(newest_dir_path, f"{TARGET_FILENAME}.zip")
    print(f"Unzipping EIA zip file: {zip_path}")
    filesystem.unzip_folder(zip_path, newest_dir_path)

    # get path of unzipped text file
    txt_path = zip_path.replace(".zip", ".txt")

    # TODO: this will eventually process multiple EIA files.
    # For now, we are only focusing on the most recent AEO file.
    return [txt_path]


def process_data():
    """Process and ingest the EIA data."""

    start_time = time()

    source_id = get_data_source_id("EIA")

    # get existing reports from the database so we don't duplicate them
    existing_identifiers = get_unique_values(Report, "identifier")
    uentity_id_map = serialization.get_unique_entity_id_map()

    # create new database rows before inserting them
    new_db_rows = {k: [] for k in TableIndex.MAP}

    # get the list of EIA text files to ingest
    file_list = prep_file_list()

    # iterate over each raw data file
    for _filepath in file_list:
        _filename = os.path.splitext(os.path.basename(_filepath))[0]
        identifier = f"EIA - {_filename}"

        with open(_filepath, "r") as file:
            extracted_text = file.read()
        hash = serialization.get_sha256_hash(extracted_text)

        if identifier in existing_identifiers:
            continue

        if _filename.startswith("AEO"):
            report_year = _filename.replace("AEO", "").strip()
            report_type = "Annual Energy Outlook"
            report_description = f"U.S. Annual Energy Outlook for {report_year}"
            report_title = f"{report_type} {report_year}"
        else:
            raise ValueError(f"No parser for EIA {_filename} files exists yet.")

        # ============== Model EIA bulk download file as a data report ==============
        new_report = Report(
            source_id=source_id,
            identifier=identifier,
            title=report_title,
            report_type=f"EIA {report_type}",
            uri=f"https://www.eia.gov/opendata/",
            n_excerpts=-1,
            description=report_description,
            embedding=[],
            published_at=serialization.string_to_date(report_year),
            version=1,
            sha256hash=hash,
        )

        # The EIA batch download files are very large.
        # To avoid memory issues, we process the files in batches.
        excerpt_index = 0
        batch_size = 5000
        with open(_filepath, "r") as file:
            while True:
                # read a batch of lines
                lines = list(islice(file, batch_size))
                if not lines:
                    break

                # read each row from the file
                rows = [json.loads(line) for line in lines if line]

                # iterate over each JSON record in the file
                for row in rows:
                    # skip metadata rows that don't contain actual data
                    if not all([k in row for k in ["series_id", "data", "name"]]):
                        continue

                    series_id = row.get("series_id", None)
                    if not series_id:
                        continue

                    # ========= Model each row as a data excerpt =========
                    metadata_keys = [
                        "units",
                        "description",
                        "start",
                        "end",
                        "lastHistoricalPeriod",
                        "last_updated",
                        "data",
                    ]
                    new_excerpt = Excerpt(
                        report_id=new_report.id,
                        source_id=source_id,
                        title=series_id,
                        content_type="json",
                        text_content=None,
                        json_content={
                            k: v
                            for k, v in row.items()
                            if k in metadata_keys and row.get(k)
                        },
                        excerpt_index=excerpt_index,
                        description=f"{row['name']} {row['start']} - {row['end']}",
                        embedding=[],
                    )
                    new_db_rows["excerpt"].append(new_excerpt)
                    excerpt_index += 1

                    # ================= Extract entities =======================
                    # convert vulnerability properties into entity objects
                    input_entities = [
                        {"title": row["start"], "entity_type": "DATE"},
                        {"title": row["end"], "entity_type": "DATE"},
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

        new_report.n_excerpts = excerpt_index
        new_db_rows["report"].append(new_report)

    # ===================== Handle vector embeddings ===================
    print()
    elapsed_min = (time() - start_time) / 60
    print(f"EIA TOTAL TIME (1/3) after reading all records: {elapsed_min:.2f} minutes")

    new_db_rows = serialization.vectorize_db_objects(new_db_rows)

    elapsed_min = (time() - start_time) / 60
    print(
        f"EIA TOTAL TIME (2/3) after creating vector embeddings: {elapsed_min:.2f} minutes"
    )

    serialization.insert_objects_from_dict(new_db_rows)
    print(f"EIA TOTAL TIME (3/3) after doing DB inserts: {elapsed_min:.2f} minutes")
    print()


def main():
    """Ingest the dataset."""
    print("Processing EIA data...")
    process_data()


if __name__ == "__main__":
    main()
