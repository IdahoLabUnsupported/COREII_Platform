# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

"""
Download and ingest the CISA CSAF OT white dataset from GitHub.
The dataset is hosted here:
https://github.com/cisagov/CSAF/tree/develop/csaf_files/OT/white

or use the GitHub API URL to access an individual report:
https://raw.githubusercontent.com/cisagov/CSAF/refs/heads/develop/csaf_files/OT/white/2020/icsa-20-014-02.json

Steps:
- Download the GitHub repo that holds the CISA OT White data.
- The repo is saved to the local disc as a zip folder.
- Unzip the folder.
- Loop through each CSAF Security Advisory JSON file in the folder and clean it.
- Create a DataReport instance for each JSON file, and link it to the parent DataSource for CISA.
- Create a DataExcerpt instance for each vulnerability in the JSON file, and link it to its parent DataReport.
- Create Entity instances for product, vendor, and software vulnerability listed in the report.
- Insert all the instances into the database using SQLModel.

"""

import os
from etl import filesystem, serialization
from kg.table_index import TableIndex
from kg.utils.read import get_unique_values, get_data_source_id
from kg.tables import Report, Excerpt
from settings import RAW_DATA_DIRECTORY_CISA, CISA_BASE_GIT_URL, CISA_PATH


def download_cisa_ot_white_from_git() -> list[str]:
    """
    Download the CISA CSAF OT white dataset from GitHub/Gitlab mirror.
    """

    # download the repo to a local directory
    filesystem.repo_to_dir()

    # get files of interest inside the repo
    cisa_data_path = os.path.join(
        RAW_DATA_DIRECTORY_CISA,
        "cisa-csaf",
        CISA_PATH,
        "csaf_files",
        "OT",
        "white",
    )
    cisa_json_files = filesystem.list_directory_files(
        cisa_data_path, extensions=["json"]
    )
    return cisa_json_files


def _clean_product_data(data: dict) -> list[dict]:
    """Clean the branched product tree data in each CISA JSON."""
    products = []
    # iterate through the nested advisory branches
    for vendor_branch in data["product_tree"]["branches"]:
        # iterate over product branches
        for product_branch in vendor_branch["branches"]:
            # iterate over product version branches
            for product_version_branch in product_branch.get("branches", []):

                if "product" not in product_version_branch:
                    continue

                _product = product_version_branch["product"]
                product_version = product_version_branch["name"]
                model_numbers = _product.get("product_identification_helper", {}).get(
                    "model_numbers", []
                )
                if product_branch["name"].lower() in _product["name"].lower():
                    product_name = _product["name"]
                else:
                    product_name = f"{product_branch['name']} {_product['name']}"
                products.append(
                    {
                        "vendor": vendor_branch["name"],
                        "product_name": product_name,
                        "product_version": product_version,
                        "product_id": _product["product_id"],
                        "model_numbers": model_numbers,
                    }
                )
    return products


def _clean_vulnerability_data(data: dict) -> list[dict]:
    """Clean the vulnerability data in each CISA JSON."""
    vulnerabilities = []
    for v in data["vulnerabilities"]:
        related_products = set()
        for _, _product_list in v["product_status"].items():
            related_products.update([p for p in _product_list])
        notes_content = " ".join([n["text"] for n in v["notes"]])
        title = f"{v['cve']} {v['cwe']['name']} ({v['cwe']['id']})"
        description = f"{title}: {notes_content} Affected products: {', '.join(list(related_products))}"
        vulnerabilities.append(
            {
                "identifier": v["cve"],
                "title": title,
                "description": description,
                "content": {
                    "cve": v["cve"],
                    "cwe_id": v["cwe"]["id"],
                    "name": v["cwe"]["name"],
                    "notes": notes_content,
                    "product_status": v.get("product_status", {}),
                    "references": v.get("references", []),
                    "remediations": v.get("remediations", []),
                    "scores": v.get("scores", []),
                },
            }
        )
    return vulnerabilities


def _merge_cisa_files(files: list[str]) -> list[dict]:
    """
    Clean and merge the downloaded CISA CSAF JSON files
    so the JSON format matches that of the database models.
    """
    clean_cisa_reports = []
    for filepath in files:
        if "cisa-csaf-ot-feed-tlp-white.json" in filepath:
            continue
        data = filesystem.read_json_file(filepath)
        # skip if this is not a security advisory file so we can fix it
        if data["document"]["category"] != "csaf_security_advisory":
            # print(
            #    f'Warning: {filepath} contains a "{data["document"]["category"]}", not a "csaf_security_advisory"'
            # )
            # TODO: handle different types of advisories
            continue

        title = data["document"]["title"]
        identifier = data["document"]["tracking"]["id"]
        hash = serialization.get_sha256_hash(data)

        vulnerabilities = _clean_vulnerability_data(data)
        products = _clean_product_data(data)

        products_string = ", ".join(
            set([p["product_name"] for p in products] + [p["vendor"] for p in products])
        )
        description = f"Vulnerability {identifier}: {title}. Affects {products_string}"

        try:
            recommended_practices = " ".join(
                [
                    n["text"]
                    for n in data["document"]["notes"]
                    if n["title"] == "Recommended Practices"
                ]
            )
        except KeyError:
            recommended_practices = ""

        clean_cisa_reports.append(
            {
                "title": title,
                "identifier": identifier,
                "published_at": serialization.string_to_date(
                    data["document"]["tracking"]["current_release_date"]
                ),
                "vulnerabilities": vulnerabilities,
                "description": description,
                "source_uri": CISA_BASE_GIT_URL + filepath.split("/OT/white/")[1],
                "report_metadata": {
                    "products": products,
                    "recommended_practices": recommended_practices,
                },
                "version": 1,
                "hash": hash,
            }
        )
    return clean_cisa_reports


def _create_db_objects(json_reports: list[dict]) -> None:
    """Create database objects from the CISA CSAF OT white dataset."""

    # static data to be referenced in the new reports
    source_id = get_data_source_id("CISA")
    report_type = "CISA CSAF OT white security advisory"
    uentity_id_map = serialization.get_unique_entity_id_map()

    # filter out reports with identifiers that already exist in the database
    _r_ids = get_unique_values(Report, "identifier")
    json_reports = [r for r in json_reports if r["identifier"] not in _r_ids]

    # create new database rows before inserting them
    new_db_rows = {k: [] for k in TableIndex.MAP}

    # create a data report for each CISA JSON file
    for report in json_reports:
        # =============== Model CISA files as data reports ================
        new_report = Report(
            source_id=source_id,
            identifier=report["identifier"],
            title=report["title"],
            report_type=report_type,
            uri=report["source_uri"],
            report_metadata=report["report_metadata"],
            n_excerpts=len(report["vulnerabilities"]),
            description=report["description"],
            embedding=[],
            published_at=report["published_at"],
            sha265hash=report["hash"],
            version=report["version"],
        )
        new_db_rows["report"].append(new_report)

        excerpt_index = 0

        # ========= Model vulnerabilities as data excerpts ==================
        for v in report["vulnerabilities"]:
            new_excerpt = Excerpt(
                report_id=new_report.id,
                source_id=source_id,
                title=v["title"],
                content_type="json",
                text_content=None,
                excerpt_index=excerpt_index,
                json_content=v["content"],
                description=v["description"],
                embedding=[],
            )
            new_db_rows["excerpt"].append(new_excerpt)
            excerpt_index += 1

            # ================= Extract entities =======================
            # convert vulnerability properties into entity objects
            input_entities = [
                {"title": v["content"]["cve"], "entity_type": "CVE"},
                {"title": v["content"]["cwe_id"], "entity_type": "CWE"},
                {"title": v["content"]["name"], "entity_type": "CWE"},
                {"title": str(new_report.published_at), "entity_type": "DATE"},
            ]
            # add affected vendors
            for _prod in report["report_metadata"]["products"]:
                input_entities.append({"title": _prod["vendor"], "entity_type": "ORG"})
                input_entities.append(
                    {"title": _prod["product_name"], "entity_type": "PRODUCT"}
                )
                input_entities.append(
                    {"title": _prod["product_id"], "entity_type": "PRODUCT"}
                )
            # add affected products
            for _, prod_list in v["content"]["product_status"].items():
                for _prod in prod_list:
                    input_entities.append({"title": _prod, "entity_type": "PRODUCT"})

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
    # insert into database
    serialization.insert_objects_from_dict(new_db_rows)


def main() -> None:
    """Ingest the CISA CSAF OT white dataset from GitHub/Gitlab Mirror."""

    # download the repo to a local directory
    print("Downloading CISA data...")
    cisa_json_files = download_cisa_ot_white_from_git()

    # parse the downloaded JSON files
    print("Cleaning and merging CISA data...")
    clean_cisa_reports = _merge_cisa_files(cisa_json_files)

    # insert data into database
    _create_db_objects(clean_cisa_reports)


if __name__ == "__main__":
    main()
