# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

# COREII backend

The backend consists of a set of three microservices: the ML API, the KG API, and the data ingestion pipeline. The resources needed for running these microservices are stored in this directory.

Here is  breakdown of everything in the `backend` directory:

* `data_ingestion`: ETL pipelines and tooling for ingestion of raw data into the knowledge graph. The ETL pipelines rely on the the `kg` package and send requests to the `ml_api` for generating vector embeddings.
* `datasets`: Contains raw datasets that make up the content of the COREII knowlege graph. Due to data size and sensitivity, data is not stored on GitHub except for a very small sampling of the public datasets. Examples of the full datasets can be accessed on Box. See the README.md file in the `datasets` directory for more information.
* `kg`: Knowledge graph Python package that provides infrastructure for interacting with the knowledge graph and provides connectivity to the knowledge graph database. This package is installed, and relied upon, by both the `kg_api` and the `data_ingestion` packages. The knowledge graph uses [PostgreSQL](https://www.postgresql.org/) as the underlying database.
* `kg_api`: Knowledge graph API built using the [FastAPI](https://fastapi.tiangolo.com/) framework, provides REST endpoints for interacting with the knowledge graph This API relies on the `kg` package.
* `ml_api`: Machine learning API built using the [FastAPI](https://fastapi.tiangolo.com/) framework, provides REST endpoints for interacting with language models for text generation and vector embeddings. The API can utilize language models that are running locally or accessed on a VLLM server.

Some of the above packages utilize environment varaibles specified in `.env` files in the respective directories. Since these files are not commited to GitHub, copy the `.env.example` in each directory, rename it to `.env`, and modify variables as needed before running any of the packages. The entry point for all environment variables is the `settings.py` file inside each Python package.

## Running the database

The database must be configured and running in order to run the backend services. To run the database locally,
1. A local instance of Postgres version 12-16 needs to be installed. It is recommended to [download and install Postgres](https://www.postgresql.org/download/), and [download and install PgAdmin4](https://www.pgadmin.org/download/) to easily interact with the database via a graphical user interface. Make sure that the Postgres instance is running when you try to run the Python backend. PgAdmin4 does not need to be running since it is merely a graphical interface on top of Postgres.
1. C++ must be installed on your machine. For MacOS, use `brew install gcc`. For Windows, install [VisualStudio](https://visualstudio.microsoft.com/).
1. The Postgres pgvector extension needs to be installed. [See instructions for installation here](https://github.com/pgvector/pgvector)

## Running the backend

To run the full backend locally:
1. Make sure C++ is installed.
1. Install the [Postgres pgvector extension](https://github.com/pgvector/pgvector)
1. Makes sure an instance of Postgres database is running.
1. Run the three backend individually:
    1. Run the ML API. This will provide endpoints for vector embeddings, which are needed for ingesting data.
    1. Run the KG API. This will initialize the database and provide endpoints for querying the ingested data.
    1. Run the data ingestion pipeline. This will read raw data, process it, and insert it into the knowledge graph database.

See the `README.md` file located in each of these three backend directories to view details of how to run the service. As some backend components depend on each other, it is recommended to run the packages in the order listed above.

Contact Eric Muckley (eric.muckley@1159.ai) for help.

## Running the backend in Docker locally on MacOS

To build run the backend inside containers MacOS, use

``` bash

# ML API
docker build -t ml_api:latest -f Dockerfile.ml_api_macos .
docker run --env-file .env.prod -d --name ml_api -p 8000:8000 ml_api:latest

# KG API
docker build -t kg_api:latest -f Dockerfile.kg_api_macos .
docker run --env-file .env.prod -d --name kg_api -p 8001:8001 kg_api:latest

# Data ingestion
docker build -t data_ingestion:latest -f Dockerfile.data_ingestion_macos .
docker run --env-file .env.prod -d --name data_ingestion data_ingestion:latest

```


## Building in Docker for deployment

Below are the commands used to build, run, tag, and push the backend containers to an image registry. ECR has a different login command.

``` bash

# Authenticate to Image Registry
docker login -u <IMAGE_REGISTRY_USERNAME> -p <IMAGE_REGISTRY_PASSWORD> <IMAGE_REGISTRY_URL>

# ML API
docker build -t ml_api:latest -f Dockerfile.ml_api .
docker tag ml_api:latest <IMAGE_REGISTRY_URL>/ml_api:latest
docker push <IMAGE_REGISTRY_URL>/ml_api:latest

# KG API
docker build -t kg_api:latest -f Dockerfile.kg_api .
docker tag kg_api:latest <IMAGE_REGISTRY_URL>/kg_api:latest
docker push <IMAGE_REGISTRY_URL>/kg_api:latest

# Data ingestion
docker build -t data_ingestion:latest -f Dockerfile.data_ingestion .
docker tag data_ingestion:latest <IMAGE_REGISTRY_URL>/data_ingestion:latest
docker push <IMAGE_REGISTRY_URL>/data_ingestion:latest

```

## Code formatting

Please use the Python code formatter [black](https://github.com/psf/black) to ensure consistent code style and quality in backend Python code. Before pushing changes to any backend Python code, run `black .` to format your code.
