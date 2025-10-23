# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import re
import requests
import logging
from requests.adapters import HTTPAdapter, Retry
from pydantic import BaseModel
from typing import Union
from time import time

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s.%(msecs)03d [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

session = requests.Session()
retries = Retry(
    total=6,
    backoff_factor=0.5,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["GET"],
    raise_on_status=False,
)
session.mount("https://", HTTPAdapter(max_retries=retries))


class SearchOSTIPayload(BaseModel):
    query_params: dict
    count: int = 20
    page: int = 1
    order: str = "desc"  # 'asc' | 'desc'
    sort: Union[str, None] = None  # 'publication_date'

def create_osti_payload(parameters: dict) -> SearchOSTIPayload:
    """
    Create an OSTI payload from the provided parameters.

    This function takes a dictionary of parameters and uses it to create and return
    a SearchOSTIPayload object. The function ensures that the given parameters
    conform to the expected structure of the SearchOSTIPayload class by parsing
    them accordingly.

    Args:
        parameters (dict): A dictionary containing the input parameters for creating
            the OSTI payload.

    Returns:
        SearchOSTIPayload: The parsed SearchOSTIPayload object created using the
            input parameters.
    """
    payload: SearchOSTIPayload = SearchOSTIPayload.parse_obj(parameters)
    return payload

def search_osti(payload: SearchOSTIPayload) -> dict:
    """
    Search records from the OSTI (Office of Scientific and Technical Information) API and
    return results formatted for retrieval-augmented generation (RAG).

    Parameters:
        payload (SearchOSTIPayload): An object containing the query parameters for the
        search, such as `query_params`, `count`, `page`, `order`, and `sort`.

    Returns:
        dict: A dictionary containing the query, diversity, excerpts, reports, and the
        time taken to execute the search, formatted for RAG usage.
    """

    start_time = time()
    if "osti_id" in payload.query_params:
        url = f"https://www.osti.gov/api/v1/records/{payload.query_params['osti_id']}"
        r = session.get(url, timeout=15)
    else:
        params = {
            **payload.query_params,
            "rows": min(20, payload.count),
            "page": payload.page,
            "order": payload.order,
            "sort": payload.sort,
        }
        r = session.get(
            "https://www.osti.gov/api/v1/records", params=params, timeout=30
        )


    candidate_records = filter_and_clean_records(r.json())
    report_dicts, excerpt_dicts = convert_to_rag_format(candidate_records)

    elapsed_seconds = round(time() - start_time, 2)
    print(f"RAG search total time: {elapsed_seconds} seconds")

    return_results: dict = {
        "query": payload.query_params["q"],
        "diversity": "0",
        "excerpts": excerpt_dicts,
        "reports": report_dicts,
        "ragElapsedSeconds": elapsed_seconds,
    }

    return return_results


def clean_record(record: dict) -> dict:
    """
    Cleans and normalizes a given record dictionary by processing its specific attributes.

    This function updates various keys in the provided record dictionary
    such as mapping 'code_id' to 'osti_id', normalizing 'subjects', processing
    author names and their affiliations, and cleaning DOE contract numbers.

    Parameters:
        record (dict): A dictionary representing a record that contains
                       information such as subjects, authors, and contract
                       numbers to be cleaned or formatted.

    Returns:
        dict: A cleaned and normalized record dictionary.
    """

    if "code_id" in record:
        record["osti_id"] = record["code_id"]

    if "subjects" in record:
        record["subjects"] = [s.lower().strip() for s in record["subjects"]]

    if "authors" in record:
        authors = []
        for a in record["authors"]:
            author = {
                "name": re.split("\(|\[", a)[0].strip(),
                "orcid": None,
                "affiliation": None,
            }
            if "[" in a and "]" in a:
                author["affiliation"] = a[a.find("[") + 1 : a.find("]")].strip()
            if "ORCID:" in a:
                author["orcid"] = a[
                    a.find("ORCID:") + 6 : a.find("ORCID:") + 22
                ].strip()
            authors.append(author)
        record["authors"] = authors

    if "doe_contract_number" in record:
        cleaned_contracts = []
        if "doe_contract_number" in record:
            contracts = re.split(";|,", record["doe_contract_number"])
            for c in contracts:
                if "(" in c and ")" in c:
                    c = c[c.find("(") + 1 : c.find(")")]
                cleaned_contracts.append(c.strip())
        record["doe_contract_number"] = list(set(cleaned_contracts))

    return record


def filter_and_clean_records(
    records: list, record_type: Union[None, str] = None
) -> list[dict]:
    """
    Filters and cleans a list of records based on the specified record type.
    The function processes different types of records such as "article", "code", or "patent".
    If the record matches the criteria for the specified record type, it is cleaned and added
    to the result list.

    Parameters:
    records: list
        A list of dictionaries where each dictionary represents a record to be filtered and
        cleaned.
    record_type: Union[None, str]
        An optional string that specifies the type of records to filter and clean. Can be
        "article", "code", "patent", or None. If None, all valid records are processed.

    Returns:
    list[dict]
        A list of cleaned records that match the specified record type.
    """
    clean_records = []
    for record in records:
        if (
            record_type in ["article", "Published Article", None]
            and "product_type" in record
            and record["product_type"] not in ["Software", "Patent"]
        ):
            clean_records.append(clean_record(record))
        elif record_type in ["code", "Software"] and "software_title" in record:
            clean_records.append(clean_record(record))
        elif (
            record_type in ["patent", "Patent"]
            and "product_type" in record
            and record["product_type"] == "Patent"
        ):
            clean_records.append(clean_record(record))
    return clean_records

def convert_to_rag_format(records: list[dict]) -> tuple[list[dict], list[dict]]:
    """
        Convert records to RAG format.

        This function processes a list of records, converting each record into a format
        suitable for a Retrieval-Augmented Generation (RAG) system. It generates two lists
        from the input records: one containing processed reports and the other containing
        excerpts extracted from the reports.

        Parameters:
        records : list[dict]
            A list of records where each record is represented as a dictionary containing
            information such as title, description, links, and other metadata.

        Returns:
        tuple[list[dict], list[dict]]
            A tuple where the first element is a list of dictionaries representing formatted
            reports and the second element is a list of dictionaries representing formatted
            excerpts.
    """
    report_dicts = []
    excerpt_dicts = []

    for record in records:
        excerpt_dict: dict = {
                        "report_id": "r" + record["osti_id"],
                        "source_id": "f8d4d986-7315-431c-af1b-4c4d98adc9a8",
                        "title": record["title"],
                        "content_type": 'text',
                        "description": record.get("description", "N/A"),
                        "excerpt_index": "1",
                        "text_content": record.get("description", "N/A"),
                        "source": "OSTI",
                        "report": "r" + record["osti_id"],
                        "entities": []
        }
        temp_dict: dict = {
            "source_id": "f8d4d986-7315-431c-af1b-4c4d98adc9a8",
            "identifier": "r" + record["osti_id"],
            "title": record["title"],
            "uri": record["links"][0]["href"],
            "report_type": record["product_type"],
            "report_metadata": {
                "publication_date": record["publication_date"],
                "journal": record.get("journal_name", "NA"),
                "journal_volume": record.get("journal_volume", "NA"),
                "journal_issue": record.get("journal_issue", "NA"),
                "article_type": record.get("article_type", "NA"),
                "country": record.get("country_publication", "NA"),
                "report_number": record.get("report_number", "NA"),
                "doi": record.get("doi", "N/A"),
                "publisher": record.get("publisher", "NA"),
            },
            "n_excerpts": "1",
            "description": record.get("description", "N/A"),
            "version": "1",
            "published_at": record.get("publisher", "NA"),
            "source": "OSTI",
            "excerpts": [excerpt_dict],
            "entities": [],
            "oarticle": record
        }
        report_dicts.append(temp_dict)
        excerpt_dicts.append(excerpt_dict)

    return report_dicts, excerpt_dicts


if __name__ == "__main__":

    results = search_osti(
        SearchOSTIPayload(
            query_params={"q": "quantum computing and encryption"},
            count=5,
            sort="publication_date",
            order="desc",
        )
    )
    for r in results:
        print(r["title"])
        print(r["publication_date"])
        print("")
