# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import math
import itertools
import numpy as np
from time import time
import concurrent.futures
from datetime import date
from sqlmodel import Session, select, text, func, or_
from sqlalchemy.sql import expression, distinct
from sqlalchemy.orm import subqueryload
from kg.table_index import TableIndex
from kg.tables import Excerpt, Source, Report
from kg.engine import engine
from kg.utils.embeddings import create_embeddings
from kg.utils.serialize import process_relationships, serialize_with_type
from kg.utils.clean import remove_duplicate_dict_values
from kg.utils.read import (
    get_all_data_source_ids,
    get_excerpts_from_reports,
    get_data_source_id,
)
from kg.utils.osti_search import create_osti_payload, search_osti, SearchOSTIPayload

from sqlalchemy import union_all, true
from contextlib import contextmanager
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s.%(msecs)03d [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


@contextmanager
def log_time(label: str):
    start = time()
    try:
        yield
    finally:
        elapsed = time() - start
        logging.debug(f"{elapsed:.2f} SECONDS: {label}")


def convert_to_osti_search(parameters: dict) -> SearchOSTIPayload:
    """
    Converts given parameters to an OSTI search payload.

    This function takes a dictionary of search parameters and translates it into a
    search payload for OSTI (Office of Scientific and Technical Information) that
    can be used to issue search queries. The provided parameters are processed to
    generate appropriate query parameters and sorting configuration.

    Arguments:
        parameters (dict): A dictionary containing search parameters. Valid keys
        include:
            - 'q' (str): The search query term.
            - 'earliest_year' (Union[str, None]): The start year for the search range.
            - 'report' (Union[str, None]): The title of the report to search for.
            - 'maxcount' (int): Maximum number of results.

    Returns:
        SearchOSTIPayload: An object representing the formatted search payload.
    """
    search_params = {}
    payload_parameters = {}
    if parameters['q']:
        search_params["q"] = parameters['q']
    if parameters['earliest_year']:
        search_params['publication_date_start'] = f"01/01/{parameters['earliest_year']}"
    if parameters['report']:
        search_params["title"] = parameters['report']
    payload_parameters['query_params'] = search_params

    payload_parameters['count'] = parameters['maxcount']
    payload_parameters['sort'] = 'publication_date'

    return create_osti_payload(payload_parameters)


def semantic_search_router(
        q: str,
        dataset: str = "",
        diversity: float = 0.0,
        earliest_year: int | str = None,
        max_count: int = 15,
) -> list[dict]:
    """
    Perform a semantic search across a database table using vector similarity,
    with optional parameters to restrict results by earliest publication year or
    by dataset, and with a diversity parameter which adds synthetic diversity to
    the restrieved results (e.g., they don't all come from the same data source).

    Examples of vector search using sqlmodel and pgvector are provided here:
    https://github.com/pgvector/pgvector-python?tab=readme-ov-file#sqlmodel

    Distance functions supported:
    - max_inner_product
    - cosine_distance
    - l1_distance
    - l2_distance
    - hamming_distance
    - jaccard_distance

    Args:
        q (str): The query string to search for.
        dataset (str, optional): The name of the dataset to limit the search to (e.g. OSTI). Defaults to an empty string. Use the dataset abbreviation here.
        diversity (float): Measure of how diverse the retireved data should be.
        earliest_year (int, str, optional): Only return records that have a published_at year >= earliest_year. If None, perform no filtering by date. Defaults to None.
        max_count (int, optional): The maximum number of search results to return. Defaults to 15.

    Returns:
        list[dict]: A list of dictionaries containing the search results, each with the following keys:
            - cosineDistance (float): The cosine distance between the query and the result.
            - similarityScore (float): The similarity score, calculated as 1 - (cosineDistance / 2).
            - Other keys corresponding to the columns in the table.

    Examples:
        >>> results = semantic_search_router("example query")
        >>> for result in results:
        >>>     print(result["similarityScore"], result["cosineDistance"])

        >>> Get distance from a new vector to all existing vectors
        >>> session.exec(select(model.embedding.l2_distance(new_vector)))

    """

    # table to execute the search over
    TABLE_NAME = "excerpt"
    table = TableIndex.get_table(TABLE_NAME)

    with log_time("Getting query embedding"):
        # create embedding of the search query
        query_embedding = create_embeddings([q])[0]

    with Session(engine) as session:

        # Create base query for vector search over specific columns
        base_query = select(table)

        # Handle filtering by date
        base_query = append_date_filter_to_query(
            base_query,
            table_name=TABLE_NAME,
            earliest_year=earliest_year,
        )

        # Handle filtering by specific dataset. This overrides diversity.
        if dataset:
            try:
                datasource_id = get_data_source_id(dataset)
                base_query = base_query.where(table.source_id == datasource_id)
            except (AttributeError, ValueError):
                print(f"Error trying to filter by dataset '{dataset}'")
                pass

        if diversity < 0.1:
            # No synthetic diversity (default behavior):
            # Return top matches regardless of which data sources they come from.
            with log_time("Full diversity < 0.1 semantic search query"):
                base_query = base_query.order_by(
                    table.embedding.cosine_distance(query_embedding)
                ).limit(max_count)
                results = session.exec(base_query).all()
                results = process_relationships(results, TABLE_NAME)

        elif diversity < 0.9:
            # Some synthetic diversity:
            # Return top matches, and augment them with a couple extra matches from each source.
            with log_time("Full diversity < 0.9 base query"):
                base_query = base_query.order_by(
                    table.embedding.cosine_distance(query_embedding)
                ).limit(math.floor(max_count / 2))
                base_results = session.exec(base_query).all()
                base_results = process_relationships(base_results, TABLE_NAME)

            with log_time("Full diversity < 0.9 diversity query"):
                all_source_ids = get_all_data_source_ids(session)
                diversity_results = top_n_excerpts_per_group_query(
                    session=session,
                    source_ids=all_source_ids,
                    query_embedding=query_embedding,
                    earliest_year=earliest_year,
                    n_per_group=max(2, math.ceil(max_count / 2 / len(all_source_ids))),
                )
            results = base_results + diversity_results

        else:
            # High synthetic diversity:
            # Return an equal number of top matches from each data source.
            with log_time("Full diversity >= 0.9 semantic search query"):
                all_source_ids = get_all_data_source_ids(session)
                results = top_n_excerpts_per_group_query(
                    session=session,
                    source_ids=all_source_ids,
                    query_embedding=query_embedding,
                    earliest_year=earliest_year,
                    n_per_group=max(2, math.ceil(max_count / len(all_source_ids))),
                )

        unique_results = remove_duplicate_dict_values(results, "id")
        return unique_results


'''
# ORIGINAL SINGLE DIVERSITY QUERY WITH PARTITIONING
# DREPRECATED IN FAVOR OF MULTIPLE SEQUENTIAL QUERIES
def top_n_excerpts_per_group_query(
    session,
    query_embedding: list[float],
    earliest_year: int | str = None,
    n_per_group: int = 3,
) -> list[dict]:
    """
    Perform a top-n-per-group query to retrieve the top N
    matching items from each data source group.
    This method is used for enforcing high dversity on
    retrieved results.
    """
    base_query = select(Excerpt)
    if earliest_year:
        base_query = append_date_filter_to_query(
            query=base_query,
            table_name="excerpt",
            earliest_year=earliest_year,
        )
    filtered_table = base_query.subquery()

    # Write the 'top-N-per-group' query to partition results by data source
    distance_subq = select(
        filtered_table.c.id.label("id"),
        func.row_number()
        .over(
            partition_by=filtered_table.c.source_id,
            order_by=filtered_table.c.embedding.cosine_distance(query_embedding),
        )
        .label("rn"),
        filtered_table.c.embedding.cosine_distance(query_embedding).label("distance"),
    ).subquery()

    final_query = (
        select(Excerpt, distance_subq.c.distance, distance_subq.c.rn)
        .join(distance_subq, distance_subq.c.id == Excerpt.id)
        .where(distance_subq.c.rn <= n_per_group)
    )
    raw_results = session.execute(final_query).all()
    # sort by semantic distance
    raw_results.sort(key=lambda x: x[1])
    raw_excerpts = [r[0] for r in raw_results]
    results = process_relationships(raw_excerpts, "excerpt")
    return results
'''


def top_n_excerpts_per_group_query(
        session,
        source_ids: list[str],
        query_embedding: list[float],
        earliest_year: int | str = None,
        n_per_group: int = 3,
) -> list[dict]:
    """
    Perform a top-n-per-group query to retrieve the top N matching items from each data source group.
    This method enforces high diversity in retrieved results by querying each source_id separately.

    Running the queries sequentially in a loop is roughly 2x faster than using a single
    partitioned window query.

    Args:
        session: SQLAlchemy session object.
        source_ids: List of source IDs to query against. This allows for high diversity in the results.
        query_embedding: List of floats representing the query vector for similarity search.
        earliest_year: Optional year to filter excerpts from this year onward.
        n_per_group: Number of top items to retrieve per source_id (default: 3).

    Returns:
        List of dictionaries containing excerpt data, sorted by cosine distance.
    """

    results = []
    for source_id in source_ids:

        query = select(
            Excerpt,
            Excerpt.embedding.cosine_distance(query_embedding).label("distance"),
        ).where(Excerpt.source_id == source_id)

        if earliest_year:
            query = append_date_filter_to_query(
                query=query,
                table_name="excerpt",
                earliest_year=earliest_year,
            )

        query = query.order_by("distance").limit(n_per_group)
        batch_results = session.execute(query).all()
        results.extend([(result.Excerpt, result.distance) for result in batch_results])

    # Serialize results
    results.sort(key=lambda x: x[1])
    raw_excerpts = [r[0] for r in results]
    final_results = process_relationships(raw_excerpts, "excerpt")
    return final_results


def append_date_filter_to_query(
        query: select,
        table_name: str = "excerpt",
        earliest_year: int | str = None,
) -> select:
    """
    Append date filtering to the query based on the provided earliest_year.
    This function is intended to be used within the semantic search function.
    """
    report_table = TableIndex.get_table("report")
    # If earliest_year is provided, restrict by published_at >= earliest_date
    if earliest_year:
        earliest_date = date(int(earliest_year), 1, 1)
        if table_name == "report":
            # Filter directly on the report table's published_at
            query = query.where(
                report_table.published_at.is_not(None),
                report_table.published_at >= earliest_date,
            )
        elif table_name in ("excerpt", "entity"):
            # Join to the 'report' table and filter on its published_at
            table = TableIndex.get_table(table_name)
            query = query.join(report_table, table.report_id == report_table.id).where(
                report_table.published_at.is_not(None),
                report_table.published_at >= earliest_date,
            )
        else:
            print(f"Date filtering is not implemented on the '{TABLE_NAME}' table.")
    return query


def rag_retrieval(
        query: str,
        dataset: str = "",
        report: str = "",
        earliest_year: int | str = None,
        max_count: int = 15,
        diversity: float = 0.0,
        max_excerpts_per_report: int = 30,
) -> dict:
    """
    Perform retrieval for Retrieval-Augmented Generation (RAG) using semantic search.
    This function searches across all data excerpts and unique entities to find the top matches
    to the given query. It runs the semantic search database queries in parallel using a thread pool.

    Args:
        query (str): The search query string.
        dataset (str, optional): The name of the dataset to limit the search to (e.g. OSTI). Defaults to an empty string. Use the dataset abbreviation here.
        earliest_year (int, str, optional): Only return records that have a published_at year >= earliest_year. If None, perform no filtering by date. Defaults to None.
        diversity (float): Measure of how diverse the retireved data should be.
        max_count (int, optional): The maximum number of results to return per table. Defaults to 15.

    Returns:
        dict: A dictionary containing the search results, including:
            - "query": The search query string.
            - "diversity": Value of the diversity input parameter.
            - "excerpts": A list of matching excerpts.
            - "similarityScores": A list of similarity scores for the matching excerpts.
            - "indexThreshold": The knee point index of the similarity scores.
            - "ragElapsedSeconds": Elapsed time in seconds for the full RAG data retrieval search.

    """

    start_time = time()

    print("Backend RAG search endpoint received:")
    print(
        f"QUERY: {query}\nDATASET: {dataset}\nREPORT: {report}\nEARLIEST_YEAR: {earliest_year}\nDIVERSITY: {diversity}\nMAX_COUNT: {max_count}"
    )

    # If searching for a single report, return the single report and circumvent the rest of the search process.
    # This performs semantic search over all report names and selects the top match.
    if report and dataset:
        try:
            query_embedding = create_embeddings([report])[0]
            datasource_id = get_data_source_id(dataset)
            with Session(engine) as session:
                with log_time("Executing specific report search"):
                    _report = session.exec(
                        select(Report)
                        .where(Report.source_id == datasource_id)
                        .order_by(Report.embedding.cosine_distance(query_embedding))
                        .limit(1)
                    ).one()
                with log_time("Executing specific report excerpt search"):
                    _excerpts = session.exec(
                        select(Excerpt)
                        .where(Excerpt.report_id == _report.id)
                        .order_by(Excerpt.excerpt_index)
                        .limit(max_excerpts_per_report)
                    ).all()
                with log_time("Serializing specific report"):
                    return_report = {
                        **serialize_with_type(_report, "report"),
                        "source": serialize_with_type(_report.source, "source"),
                        "excerpts": serialize_with_type(
                            _excerpts,
                            "excerpt",
                            exclude_keys={"embedding", "report", "entities", "source"},
                        ),
                    }
                with log_time("Serializing specific report return excerpts"):
                    return_excerpts = [
                        {
                            **e,
                            "report": return_report,
                            "source": return_report["source"],
                        }
                        for e in return_report["excerpts"]
                    ]
                return {
                    "query": query,
                    "diversity": diversity,
                    "excerpts": return_excerpts,
                    "reports": [{**return_report, "match": "report_title"}],
                    "ragElapsedSeconds": round(time() - start_time, 2),
                }
        except Exception as e:
            print(f"Error trying to find specific report: {e}")

    # TODO: make this robust against data that might not be in the correct date range.
    # We currently only have data for 2023 in EIA, so we can't ask about later years.
    if dataset == "EIA":
        earliest_year = 2023

    # If the user mentions a specific dataset, that should override the chat settings.
    if dataset:
        diversity = 0.0

    # get top-matching excerpts by semantic vector search
    excerpt_dicts = semantic_search_router(
        query,
        dataset=dataset,
        diversity=diversity,
        earliest_year=earliest_year,
        max_count=max_count,
    )

    with log_time("Getting parent reports from semantic search results"):
        # get all reports that contain the top-matching excerpts
        parent_report_dicts = [
            {**d["report"], "source": d["source"]} for d in excerpt_dicts
        ]

    with log_time("Performing string search over report titles and identifiers"):
        # get any reports titles or identifiers that match the query string
        string_match_report_dicts = string_search_over_reports(
            query,
            dataset=dataset,
            earliest_year=earliest_year,
            max_count=5,
        )

    return_reports = remove_duplicate_dict_values(
        [*string_match_report_dicts, *parent_report_dicts],
        key="id",
    )

    with log_time("Getting excerpts from reports"):
        # Get excerpts that are contained in the returned reports
        child_excerpts = get_excerpts_from_reports(return_reports)

    # Deduplicate returned reports and excerpts
    return_excerpts = remove_duplicate_dict_values(
        [*excerpt_dicts, *child_excerpts],
        key="id",
    )

    elapsed_seconds = round(time() - start_time, 2)
    print(f"RAG search total time: {elapsed_seconds} seconds")

    return_results: dict = {
        "query": query,
        "diversity": diversity,
        "excerpts": return_excerpts,
        "reports": return_reports,
        "ragElapsedSeconds": elapsed_seconds,
    }

    print(return_results)
    return return_results


def string_search_over_reports(
        search_string: str,
        dataset: str = "",
        earliest_year: int | str = None,
        max_count: int = 5,
) -> list[dict]:
    """
    Perform string search over report title and identifier.
    This helps augment the vectorsearch if there is a small
    string match that doesn't get surfaced during a vector search
    of a large section of text.
    """
    # skip this search if the search string is too short
    if len(search_string) < 5:
        return []
    pattern = f"%{search_string}%"
    with Session(engine) as session:
        base_query = select(Report).filter(
            or_(Report.title.ilike(pattern), Report.identifier.ilike(pattern))
        )

        base_query = append_date_filter_to_query(
            base_query,
            table_name="report",
            earliest_year=earliest_year,
        )

        if dataset:
            try:
                datasource_id = get_data_source_id(dataset)
                base_query = base_query.where(Report.source_id == datasource_id)
            except (AttributeError, ValueError):
                print(f"Error trying to filter by dataset '{dataset}'")
                pass
        results = session.exec(base_query.limit(max_count)).all()
        serialized_results = process_relationships(results, "report")
        return serialized_results


if __name__ == "__main__":

    if 1:
        # Test diversity query
        results = rag_retrieval(
            query="OT cyber",
            dataset="",
            report="",
            earliest_year=None,
            max_count=30,
            diversity=1,
        )

    if 0:
        # Test all combinations of RAG parameters
        reports = ["", "annual energy outlook"]
        datasets = ["EIA", ""]
        earliest_years = [2023, None]
        diversities = [0.0, 0.5, 1.0]
        all_combos = itertools.product(reports, datasets, earliest_years, diversities)
        for report, dataset, earliest_year, diversity in all_combos:
            results = rag_retrieval(
                query="Tell me about natural gas pricing",
                dataset=dataset,
                report=report,
                earliest_year=earliest_year,
                max_count=100,
                diversity=1,
            )

    if 0:
        # Test general RAG query latency for better statictics
        times = []
        n_trials = 1
        for i in range(n_trials):
            start_time = time()
            results = rag_retrieval(
                query="OT cyber",
                dataset="",
                report="",
                earliest_year=None,
                max_count=15,
                diversity=0.5,
            )
            total_time = time() - start_time
            times.append(total_time)
            print(f"TOTAL TRIAL TIME: {round(total_time, 3)} sec")

        print(
            f"\nMEDIAN TIME: {round(np.median(times), 3)} ({round(np.std(times), 3)})"
        )
        print(times)
