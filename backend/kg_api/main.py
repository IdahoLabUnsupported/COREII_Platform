# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import uvicorn
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.docs import get_swagger_ui_html

from settings import KG_API_PORT
from kg.utils.osti_search import search_osti, SearchOSTIPayload
from kg.initialize import initialize_tables
from kg.utils.search import rag_retrieval, convert_to_osti_search
from kg.utils.read import (
    get_table_sizes,
    count_reports_by_source,
    get_data_overview,
    list_data_sources,
    list_objects,
    get_object,
)

# Initialize the database if it hasn't been initialized yet.
# This will create the database, install extensions,
# and create the tables if they don't exist.
initialize_tables()

app = FastAPI(
    title="COREII Knowledge Graph API",
    description="A knwoeldge graph API for database queries and RAG.",
    version="1.0.0",
    contact={"name": "Idaho National Laboratory"},
    docs_url=None,
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/",
    tags=["Test"],
    responses={
        200: {
            "description": "string",
            "content": {
                "application/json": {
                    "example": {"success": "bool", "message": "string"}
                }
            },
        }
    },
)
async def test_connection() -> dict:
    """Test connection to the API server"""
    return {"success": True, "message": "COREII knowledge graph API is running!"}


@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title,
        swagger_js_url="/static/swagger-ui-bundle.js",
        swagger_css_url="/static/swagger-ui.css",
    )


@app.get(
    "/db-count",
    tags=["Read"],
    responses={
        200: {
            "description": "string",
            "content": {
                "application/json": {
                    "example": {
                        "source": "number",
                        "report": "number",
                        "excerpt": "number",
                        "uentity": "number",
                        "entity": "number",
                    }
                }
            },
        }
    },
)
async def get_db_count() -> dict:
    """Count the number of rows in each database table."""
    return get_table_sizes()


@app.get(
    "/report-count",
    tags=["Read"],
    responses={
        200: {
            "description": "string",
            "content": {
                "application/json": {
                    "example": {
                        "datasource_1": "number",
                        "datasource_2": "number",
                        "...": "number",
                        "datasource_n": "number",
                    }
                }
            },
        }
    },
)
async def get_report_count() -> dict:
    """Count the number of reports by source."""
    return count_reports_by_source()


@app.get(
    "/list-data-sources",
    tags=["Read"],
    responses={
        200: {
            "description": "string",
            "content": {
                "application/json": {
                    "example": [
                        {
                            "added_at": "string",
                            "description": "string",
                            "uri": "string",
                            "id": "string",
                            "title": "string",
                            "abbreviation": "string",
                            "objectType": "string",
                        }
                    ]
                }
            },
        }
    },
)
async def get_data_sources() -> list[dict]:
    """Get details about the data sources"""
    return list_data_sources()


@app.get(
    "/data-overview",
    tags=["Read"],
    responses={
        200: {
            "description": "string",
            "content": {
                "application/json": {
                    "example": {
                        "data_sources": [
                            {
                                "title": "string",
                                "description": "string",
                                "uri": "string",
                                "number_of_reports": "number",
                            }
                        ],
                        "database_table_sizes": {
                            "source": "number",
                            "report": "number",
                            "excerpt": "number",
                            "uentity": "number",
                            "entity": "number",
                        },
                    }
                }
            },
        }
    },
)
async def data_overview_endpoint() -> dict:
    """Provide an overview of the knowledge base datasets."""
    return get_data_overview()


@app.get(
    "/list-objects",
    tags=["Read"],
    responses={
        200: {
            "description": "string",
            "content": {"application/json": {"example": {"results": []}}},
        }
    },
)
async def list_objects_(
        table_name: str = Query(..., description="Name of the database table to query."),
        constraint_key: str = Query(
            None,
            description="Column name used for filtering results. If provided, it must match a valid column in the specified table.",
        ),
        constraint_val: str = Query(
            None,
            description="Value that the `constraint_key` column must match for filtering results. Ignored if `constraint_key` is not provided.",
        ),
        page: int = Query(0, description="Page number for pagination (default is 0)."),
        page_size: int = Query(
            10, description="Number of results per page (default is 10)."
        ),
) -> dict:
    return list_objects(
        table_name,
        constraint_key=constraint_key,
        constraint_val=constraint_val,
        page=page,
        page_size=page_size,
    )


@app.get("/object", tags=["Read"])
async def get_object_(
        table_name: str = Query(
            ..., description="Name of the database table containing the object."
        ),
        object_id: str = Query(
            ..., description="Unique identifier of the object to retrieve."
        ),
        include_parents: bool = Query(
            True,
            description="Whether to include parent objects (if applicable) in the response. Defaults to True.",
        ),
) -> dict:
    """Get a single object from the database."""
    return get_object(
        table_name=table_name, object_id=object_id, include_parents=include_parents
    )


@app.get(
    "/rag-retrieval",
    tags=["Search"],
    responses={
        200: {
            "description": "string",
            "content": {
                "application/json": {
                    "example": {
                        "query": "string",
                        "diversity": "string",
                        "excerpts": [],
                        "reports": [],
                        "ragElapsedSeconds": "number",
                    }
                }
            },
        }
    },
)
async def perform_rag_retrieval(
        q: str = Query(..., description="Search query for semantic retrieval."),
        dataset: str = Query(
            "",
            description="Optional dataset name to restrict search results to a specific dataset.",
        ),
        report: str = Query(
            "",
            description="Optional report title to filter search results by a specific report.",
        ),
        earliest_year: int | str = Query(
            None,
            description="Optional filter to limit results to content from this year or later.",
        ),
        diversity: float = Query(
            0.0,
            description="Diversity factor (0.0 - 1.0) for search results. Higher values promote more diverse results.",
        ),
        maxcount: int | None = Query(
            15, description="Maximum number of search results to return. Defaults to 15."
        ),
) -> dict:
    """Perform retrieval for RAG by semantic search across multiple database tables."""

    if dataset.lower() == "osti":
        parameters = {
            "q": q,
            "dataset": dataset if dataset else None,
            "report": report if report else None,
            "earliest_year": earliest_year if earliest_year else None,
            "maxcount": maxcount
        }
        payload = convert_to_osti_search(parameters)
        return search_osti(payload)
    else:
        return rag_retrieval(
            q,
            dataset=dataset,
            report=report,
            earliest_year=earliest_year,
            max_count=maxcount,
            diversity=diversity,
        )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=KG_API_PORT)
