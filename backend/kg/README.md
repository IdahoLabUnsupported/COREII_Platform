# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

# Knowledge graph

This is python package that manages the knowledge graph.  It is meant to be installed and used by other COREII services, including the COREII data ingestion pipeline and the COREII knowledge graph API. All environment variables are shown in the `.env.example` file. Please copy this file, rename it to `.env`, and set the appropriate variables. All environment variables are accessed in the `settings.py` file.

## Running locally

STOP! You don't need to run this locally if you just want to run the COREII backend. You only need to run this package on its own if you're trying to help debug or develop it.

To run this package and initialize the database, follow these steps:

1. Make sure C++ is installed.
1. Install the [Postgres pgvector extension](https://github.com/pgvector/pgvector)
1. Makes sure an instance of Postgres database is running.
1. Modify the parameters in the `.env` file so they appropriately reflect the Postgres database credentials.
1. Create a virtual environment: `python3.12 -m venv venv`
1. Activate the environment: `.venv/bin/activate` (or `.\venv\Scripts\Activate.ps1` on Windows)
1. Update pip: `pip install -U pip`
1. Install requirements: `pip install -r requirements.txt`
1. Initialize the database using `python -m kg.initialize`
1. This will create the database, install extensions, and create the database tables defined in `kg/tables` if they don't already exist.
