# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

"""
Ingest the KEV data:

- Reading the CSV file containing CVE vulnerabilities.
- Creating a Report instance to represent each row of the dataset.
- Generating Excerpt instances for the content of each row.
- Extracting relevant entities (CVE ID, Vendor, Product, CWE ID) and linking them.
- Vectorizing the extracted data for efficient retrieval.
- Inserting the processed data into the database.

Dataset available here:
https://www.cisa.gov/known-exploited-vulnerabilities-catalog

"""

import json
from etl import serialization
from datetime import datetime
from etl.filesystem import read_json_file
from kg.utils.read import get_unique_values, get_data_source_id, get_last_report_version
from kg.table_index import TableIndex
from kg.tables import Report, Excerpt
from settings import RAW_DATA_PATH_KEV


def process_kev_data() -> dict[str, list]:
    """
    Process and ingest the known exploited vulnerabilities dataset.
    """
    source_id = get_data_source_id("KEV")
    uentity_id_map = serialization.get_unique_entity_id_map()
    existing_identifiers = get_unique_values(Report, "identifier")
    existing_hashes = get_unique_values(Report, "sha256hash")

    new_db_rows = {k: [] for k in TableIndex.MAP}
    json_data = read_json_file(RAW_DATA_PATH_KEV)

    # Iterate over every row in the dataset
    for row in json_data["vulnerabilities"]:

        cveID = row.get("cveID")
        if not cveID:
            continue

        identifier = cveID
        sha256hash = serialization.get_sha256_hash(row)


        # if this report has already been added to the database
        if identifier in existing_identifiers:
            old_version = get_last_report_version(identifier)
            if sha256hash in existing_hashes:
                # this report has not been updated
                continue
            else:
                # this is a new version of the report
                version = old_version + 1
        else:
            # this is a new report
            version = 1
            existing_hashes.add(sha256hash)
            existing_identifiers.add(identifier)

        title = f"{cveID}: {row.get('vulnerabilityName', '')}"

        published_at = None
        if row.get("dateAdded"):
            published_at = datetime.strptime(row["dateAdded"], "%Y-%m-%d").date()

        # Create report instance
        new_report = Report(
            source_id=source_id,
            identifier=identifier,
            title=title,
            report_type="Known exploited vulnerability",
            n_excerpts=1,
            description=title,
            embedding=[],
            version=version,
            sha256hash=sha256hash,
            published_at=published_at,
        )
        new_db_rows["report"].append(new_report)

        new_excerpt = Excerpt(
            report_id=new_report.id,
            source_id=source_id,
            title=title,
            content_type="json",
            json_content=row,
            excerpt_index=0,
            description=f"{title} {row.get('shortDescription', '')}",
            embedding=[],
        )
        new_db_rows["excerpt"].append(new_excerpt)

        # Included the Description and notes in the descroption excerpt and not included as an entity
        entity_keys = {
            "cveID": "CVE",
            "vendorProject": "VENDOR",
            "product": "PRODUCT",
            "vulnerabilityName": "VULNERABILITY",
        }

        input_entities = []
        for entity_key in entity_keys:
            entity_value = row.get(entity_key)
            if entity_value:
                new_entity = {
                    "title": entity_value,
                    "entity_type": entity_key,
                }
                input_entities.append(new_entity)
        

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

    new_db_rows = serialization.vectorize_db_objects(new_db_rows)
    return new_db_rows


def main():
    print("Processing KEV data...")
    new_db_rows = process_kev_data()
    serialization.insert_objects_from_dict(new_db_rows)


if __name__ == "__main__":
    main()
