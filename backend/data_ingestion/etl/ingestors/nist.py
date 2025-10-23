# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

"""
Ingest the unstructured NIST special publication PDF files.

- Read the unstructured PDF text reports from a local directory.
- Create a DataReport instance for each report file, and link it to the parent DataSource for NIST.
- Chunk the unstructured text reports and create a DataExcerpt instance for each chunk, and link it to its parent DataReport.
- Create Entity instances for each entity recognized inside the unstructured text.
- Insert all the instances into the database using SQLModel.

"""

import os
from datetime import datetime
from etl import filesystem, text_parsing, serialization
from kg.utils.read import get_unique_values, get_data_source_id
from kg.table_index import TableIndex
from kg.tables import Report, Excerpt
from settings import RAW_DATA_DIRECTORY_NIST


def process_unstructured_reports_data():
    """
    Process and ingest the unstructured NIST reports.
    """
    # static data that to be referenced in the new reports
    source_id = get_data_source_id("NIST")
    uentity_id_map = serialization.get_unique_entity_id_map()

    # get existing reports from the database so we don't duplicate them
    existing_identifiers = get_unique_values(Report, "identifier")

    # create new database rows before inserting them
    new_db_rows = {k: [] for k in TableIndex.MAP}

    # iterate over all local files
    file_list = filesystem.list_directory_files(
        RAW_DATA_DIRECTORY_NIST, extensions=["pdf"]
    )

    for _filepath in file_list:
        extracted_text = text_parsing.read_unstructured_text_file(_filepath)
        chunks = text_parsing.recursive_text_splitter(
            extracted_text, max_chunk_size=2500
        )

        # ============== Model report as a data report ==============
        filename = os.path.basename(_filepath)
        if "--" in filename:
            filename, date_string = filename.split("--")
            filename = filename.strip()
            published_at = string_to_datetime(date_string.split(".")[0].strip())
            identifier = filename
        else:
            identifier = filename.split(".")[0]
            published_at = None

        hash = serialization.get_sha256_hash(extracted_text)

        if identifier in existing_identifiers:
            continue

        new_report = Report(
            source_id=source_id,
            identifier=identifier,
            title=filename,
            report_type="NIST special publication",
            uri=filename,
            # report_metadata=None,
            n_excerpts=len(chunks),
            description=identifier,
            embedding=[],
            sha256hash=hash,
            version=1,
            published_at=published_at,
        )
        new_db_rows["report"].append(new_report)
        excerpt_index = 0

        for chunk_idx, chunk in enumerate(chunks):
            # ========= Model each chunk as a data excerpt =========
            new_excerpt = Excerpt(
                report_id=new_report.id,
                source_id=source_id,
                title=f"{identifier} - Excerpt {chunk_idx + 1}",
                content_type="text",
                text_content=chunk,
                excerpt_index=excerpt_index,
                json_content=None,
                description=chunk,
                embedding=[],
            )
            new_db_rows["excerpt"].append(new_excerpt)
            excerpt_index += 1

            # ================= Extract entities =======================
            # if USE_NER_MODEL:  # TODO: use entity-extraction model here
            #    input_entities = entity_extraction.extract_entities(chunk)
            # else:
            input_entities = []
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


def string_to_datetime(date_string: str, date_format: str = "%Y-%m-%d") -> datetime:
    """Convert a string in YYYY-MM-DD format to a datetime object."""
    date_string = str(date_string).split("T")[0].strip()
    return datetime.strptime(date_string, date_format).date()


def main():
    """Ingest the unstructured NIST special publications."""
    print("Processing NIST special publications...")
    new_db_rows = process_unstructured_reports_data()
    serialization.insert_objects_from_dict(new_db_rows)


if __name__ == "__main__":
    main()
