# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

# Knowledge graph API

This is a lightweight API that controls access to the knowledge graph database and enables retrieval-augmented generation (RAG) and other semantic search and data browsing capabilities. All environment variables are shown in the `.env.example` file. Please copy this file, rename it to `.env`, and set the appropriate variables. All environment variables are accessed in the `settings.py` file.

## Running locally

First, follow instructions in the `/backend/kg/README.md` file to make sure the database is initialized, and run the machine learning API as described in the `/backend/ml_api/README.md` file.

1. Make sure the appropriate environment variables are set in the .env file, and that the Postgres instance is running.
1. Create a new virtual environment: `python3.12 -m venv venv` in the Python package directory.
1. Activate the virtual environment: `.venv/bin/activate` (or `.\venv\Scripts\Activate.ps1` on Windows)
1. Update pip inside the virtual environment: `pip install -U pip`
1. Install the required packages into the virtual environment: `pip install -r requirements.txt`
1. Run the API using `python -m main`.
1. Swagger docs will be available at [http://localhost:8001/docs](http://localhost:8001/docs), where `8001` is the `KG_API_PORT` number specified in the `.env` file. 
