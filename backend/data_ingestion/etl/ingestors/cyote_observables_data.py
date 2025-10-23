# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

"""
Ingest the tabular CYOTE precursor analysis observables data.

- Read the tabular observables CSV file from a local directory.
- Create a DataReport instance for the file and link it to the parent DataSource for CYOTE.
- Create a DataExcerpt for each row in the file, and link it to its parent DataReport.
- Create Entity instances for each entity recognized inside the row.
- Insert all the instances into the database using SQLModel.

"""

import os
import pandas as pd
from etl import serialization
from kg.utils.read import get_unique_values, get_data_source_id
from kg.table_index import TableIndex
from kg.tables import Report, Excerpt
from settings import RAW_DATA_PATH_CYOTE_TABULAR


# CYOTE_TABULAR_OBSERVABLES_PATH = os.path.join(
#    RAW_DATA_DIRECTORY,
#    "CyOTE Precursor Analysis Observable Data",
#    "all_case_study_observables_w_d_notation.csv",
# )


def process_tabular_obervables_data() -> dict[str:list]:
    """
    Process and ingest the tabular CYOTE observables dataset.
    """

    df = pd.read_csv(RAW_DATA_PATH_CYOTE_TABULAR)

    source_id = get_data_source_id("CYOTE")
    uentity_id_map = serialization.get_unique_entity_id_map()

    # get existing CYOTE reports from the database so we don't duplicate them
    existing_identifiers = get_unique_values(Report, "identifier")

    # create new database rows before inserting them
    new_db_rows = {k: [] for k in TableIndex.MAP}

    # skip report if its been ingested previously
    identifier = "CyOTE precursor analysis observables data"
    hash = serialization.get_sha256_hash(df.to_string())
    if identifier in existing_identifiers:
        return new_db_rows

    # ============== Model CYOTE observables file as a data report ==============
    new_report = Report(
        source_id=source_id,
        identifier=identifier,
        title="all_case_study_observables_w_d_notation.csv",
        report_type=identifier,
        # uri=,
        # report_metadata={"description": _data["Description"].strip()},
        n_excerpts=len(df),
        description=identifier,
        embedding=[],
        version=1,
        sha256hash=hash,
        # published_at=utils.string_to_date(YEAR_PUBLISHED),
    )
    new_db_rows["report"].append(new_report)

    excerpt_index = 0

    for row in df.to_dict(orient="records"):
        # =========== Model CYOTE observables as data excerpts ===========
        new_excerpt = Excerpt(
            report_id=new_report.id,
            source_id=source_id,
            title=f"Case ID {row['case_id']}: {row['case_alias']} ObsSeq-{row['case_obs_seq']}",
            content_type="json",
            text_content=None,
            json_content=row,
            excerpt_index=excerpt_index,
            description=f"{row['case_name']} ({row['case_alias']}) - {row['obs_desc']}",
            embedding=[],
        )
        new_db_rows["excerpt"].append(new_excerpt)
        excerpt_index += 1

        # ================= Extract entities =======================
        input_entities = [
            {"title": row["case_alias"], "entity_type": "CASE"},
            {"title": row["case_name"], "entity_type": "CASE"},
            {"title": row["start_year"], "entity_type": "DATE"},
            # TODO: add other relevant entities here
            # {"title": row["tech_ics_name"], "entity_type": ""},
            # {"title": row["tact_ics_name"], "entity_type": ""},
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

    # for k, v in new_db_rows.items():
    #    print(f"{k}: {len(v)}")

    # ===================== Handle vector embeddings ===================
    new_db_rows = serialization.vectorize_db_objects(new_db_rows)
    return new_db_rows


def main():
    print("Processing tabular CYOTE observables data...")
    new_db_rows = process_tabular_obervables_data()
    serialization.insert_objects_from_dict(new_db_rows)


if __name__ == "__main__":
    main()
