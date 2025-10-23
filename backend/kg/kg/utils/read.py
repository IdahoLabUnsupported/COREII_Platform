# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import math
from collections import defaultdict
from sqlalchemy import asc, func, desc
from sqlalchemy.orm import subqueryload, selectinload, aliased
from sqlmodel import SQLModel, Session, select, distinct
from kg.table_index import TableIndex
from kg.engine import engine
from kg.tables import Source, Entity, Report, Excerpt
from kg.utils.serialize import process_relationships, serialize_with_type


def get_table_sizes(verbose: bool = False) -> dict:
    """Count the number of rows in each database table."""
    results = {}
    if verbose:
        print("Table sizes:")
    for table_name, table in TableIndex.MAP.items():
        with Session(engine) as session:
            count = session.exec(select(func.count()).select_from(table)).one()
            results[table_name] = count
            if verbose:
                print(f"{table_name:<18} {count} rows")
    return results


def get_data_source_id(data_source_abbreviation: str) -> str:
    """
    Get the data source ID from the data source abbreviation.
    Example:
    id = get_data_source_id("ARC")
    # returns 2c3f7ad4-6df6-4dad-8b39-c9580f8cf188
    """
    error_msg = f"No '{data_source_abbreviation}' data source exists database."
    with Session(engine) as session:
        row = session.exec(
            select(Source).where(
                Source.abbreviation == data_source_abbreviation.upper()
            )
        ).first()
    source_id = getattr(row, "id", None)
    if source_id:
        return source_id
    else:
        raise ValueError(error_msg)


def get_all_data_source_ids(session) -> list[str]:
    """
    From the database session,
    return a set of all the data source IDs.
    Use this inside a session that's already open.
    """
    query = select(Source.id)
    results = session.exec(query).all()
    return sorted(results)


def count_reports_by_source(verbose: bool = False) -> dict:
    """Count the number of reports by data source."""
    results = {}
    if verbose:
        print("Records by source:")
    # get all source abbreviations
    abbreviations = get_unique_values(Source, "abbreviation")
    # iterate over each source and get records linked it its id
    for abbr in abbreviations:
        source_id = get_data_source_id(abbr)
        with Session(engine) as session:
            count = session.exec(
                select(func.count())
                .select_from(Report)
                .where(Report.source_id == source_id)
            ).one()
            if verbose:
                print(f"{abbr:<18} {count} reports")
        results[abbr] = count
    return results


def get_unique_values(table_class: SQLModel, column_name: str) -> set[str]:
    """
    Get the set of all values in a single column.
    Use this to check uniqueness of a new item by
    querying the database once for all existing values,
    rather than querying the database on each item insert.

    Example:
    values = get_unique_values("source", "title")
    """
    with Session(engine) as session:
        result = session.exec(select(distinct(getattr(table_class, column_name)))).all()
    return set(result)


def get_excerpts_from_reports(reports: list[dict], max_count: int = 8) -> list[dict]:
    """Use a SQL window function to return up to `max_count` Excerpts for each report."""
    report_ids = {r["id"] for r in reports}
    ExcerptAlias = aliased(Excerpt)
    with Session(engine) as session:
        # Create a subquery that SELECTs Excerpt IDs and a row_number,
        # partitioning by report_id
        subq = (
            session.query(
                ExcerptAlias.id.label("id"),
                ExcerptAlias.report_id.label("report_id"),
                func.row_number()
                .over(
                    partition_by=ExcerptAlias.report_id,
                    # order_by=desc(ExcerptAlias.id),
                )
                .label("row_number"),
            )
            .filter(ExcerptAlias.report_id.in_(report_ids))
            .subquery()
        )
        # Join the subquery back to Excerpt on matching "id"
        rows = (
            session.query(Excerpt)
            .join(subq, Excerpt.id == subq.c.id)
            .filter(subq.c.row_number <= max_count)
            .all()
        )
        return process_relationships(rows, "excerpt", max_count=max_count)


def get_last_report_version(report_identifier: str) -> int:
    """Get the last version of a report."""
    with Session(engine) as session:
        report = session.exec(
            select(Report)
            .where(Report.identifier == report_identifier)
            .order_by(Report.version.desc())
            .limit(1)
        ).one()
        return report.version


def list_data_sources() -> list[dict]:
    """List all top-level data sources"""
    with Session(engine) as session:
        result = session.exec(select(Source))
        rows = result.unique().all()
        return [serialize_with_type(row, "source") for row in rows]


def get_data_overview() -> list[dict]:
    """Get an overview of the data"""
    data_sources = list_data_sources()
    reports_by_source = count_reports_by_source()
    keep_keys = ["title", "abbreviation", "description", "uri"]
    clean_sources = []
    for source in data_sources:
        clean_source = {
            "title": f'{source["abbreviation"]}: {source["title"]}',
            "description": source["description"],
            "uri": source["uri"],
        }
        clean_source["number_of_reports"] = reports_by_source[source["abbreviation"]]

        # TODO: Remove this when we reorganize the CyOTE data as multiple data sources.
        # This is a temporary fix to avoid counting the CyOTE obervables file as a report,
        # so the frontend can display that there are 27 CyOTE reports while keeping the
        # tabular observables file in the knowledge base so it can still be used for RAG.
        if source["abbreviation"] == "CYOTE":
            clean_source["number_of_reports"] -= 1

        clean_sources.append(clean_source)
    return {
        "data_sources": clean_sources,
        "database_table_sizes": get_table_sizes(),
    }


def list_objects(
    table_name: str,
    constraint_key: str = None,
    constraint_val: str = None,
    page: int = 0,
    page_size: int = 10,
) -> dict:
    """
    Return a list of database objects.
    Optionally add a key-value constraint for filtering the objects.
    Returns pagination details for listing the objects.
    """

    table = TableIndex.get_table(table_name)
    with Session(engine) as session:
        query = select(table)
        # enforce constraints
        if constraint_key and constraint_val:
            query = query.where(getattr(table, constraint_key) == constraint_val)

        # TODO: Remove this when we reorganize the CyOTE data as multiple data sources.
        # This is a temporary fix to avoid counting the CyOTE obervables file as a report,
        # so the frontend can display that there are 27 CyOTE reports while keeping the
        # tabular observables file in the knowledge base so it can still be used for RAG.
        if table_name == "report":
            query = query.where(
                getattr(table, "title") != "all_case_study_observables_w_d_notation.csv"
            )

        # get total number of results
        total_count = session.exec(
            select(func.count()).select_from(query.subquery())
        ).one()
        last_page = math.ceil(total_count / page_size) - 1
        if last_page < 0:
            last_page = 0

        if page < 0:
            page = 0
        elif page > last_page:
            page = last_page

        # get paginated results
        query = query.order_by(asc("title")).offset(page * page_size).limit(page_size)
        rows = session.exec(query).all()
        serialized_rows = serialize_with_type(rows, table_name)

        start_index = page * page_size
        end_index = start_index + len(serialized_rows)

        return {
            "results": serialized_rows,
            "objectRelations": table.RELATIONS,
            "totalCount": total_count,
            "page": page,
            "pageSize": page_size,
            "firstPage": 0,
            "showing": len(serialized_rows),
            "lastPage": last_page,
            "startIndex": start_index,
            "endIndex": end_index,
        }


def get_object(table_name: str, object_id: str, include_parents: bool = True) -> dict:
    """Return a single object form the database."""
    table = TableIndex.get_table(table_name)
    with Session(engine) as session:
        obj = session.get(table, object_id)
        serialized_obj = serialize_with_type(obj, table_name)

        if include_parents:
            # get the full parent objects
            for parent_id_key, parent_table_name in TableIndex.PARENT_KEYS.items():
                if getattr(obj, parent_id_key, None):
                    parent_table = TableIndex.get_table(parent_table_name)
                    parent_id = getattr(obj, parent_id_key)
                    _parent = session.get(parent_table, parent_id)
                    serialized_obj[parent_table_name] = serialize_with_type(
                        _parent, parent_table_name
                    )

        return {**serialized_obj, "RELATIONS": table.RELATIONS}


if __name__ == "__main__":
    get_table_sizes(verbose=True)
