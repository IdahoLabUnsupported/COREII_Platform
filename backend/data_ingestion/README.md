# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

# Data ingestion pipeline

This is the data ingestion pipeline which includes ETL scripts and database initialization. To run successfully, all the environemnt variable in `.env.example` must be copied to a `.env` file and replaced with the appropriate values. Then follow these steps to run the full data ingestion pipeline:

1. Create a virtual environment: `python3.12 -m venv venv`
1. Activate the environment: `. venv/bin/activate` (or `. venv/Scripts/Activate` on Windows)
1. Update pip: `pip install -U pip`
1. Install requirements: `pip install -r requirements.txt`
1. Make sure the ML API is running. This is needed to generate vector embeddings for the data ingestion pipeline.
1. Use `python -m etl.ingestors.all` to run all data ingestors.

## Adding a new dataset

To add a new dataset, a couple steps must be taken:

1. Set the location of the data in the environment variables. If you're running the data ingestion locally, this variable will be set in your `.env` file. For example, `CISA_CSAF_OT_WHITE_DATASET_PATH=/path/to/cisa/csaf_files/OT/white`. If you're running the data ingestion process in production, the environment variable will be set in the production environment using Kubernetes.
1. Create a new ingestion script for the dataset inside the `/backend/data_ingestion/etl/ingestors/` directory. For guidance, look inside the other data ingestion scripts and modify to fit your new dataset.
1. Add your new data ingestion script to the `all.py` script in the `/backend/data_ingestion/etl/ingestors/` directory. This will ensure that your new dataset is processed when you run the `python -m etl.ingestors.all` command.
1. Finally, run the data ingestion pipeline using the command `python -m etl.ingestors.all`. This will process all datasets, including your new dataset, and insert the data into the Postgres database.


## Knowledge graph database schema

Knowledge graph database schema are defined by Python classes in `kg/tables.py`. Using the [SQLModel](https://github.com/fastapi/sqlmodel]) and [Pydantic](https://github.com/pydantic/pydantic) Python packages, the Python classes that represent knowledge graph objects are automatically converted to Postgres database tables, and the database schema are exported to SQL and DBML formats in the `kg/exported_schema` directory.

The current knowledge graph database schema consists of five distict hierarchical object types, each of which is extracted from the COREII datasets and stored in a separate Postgres table. The object types are:
1. `source`: An original data source, such as OSTI, ARC, or CISA.
1. `report`: A single report from a data `source`. For example, a research article published on OSTI, or a ARC Market research dataset.
1. `excerpt`: A single excerpt from a `report`. The use of excerpts allows us to create a more fine-grained hierarchy of objects for locating the position of specific information inside a larger report, and using this information for RAG when the entire report might not fit inside the context window of the language model. For an unstructured text report, the excerpt is generally a single paragraph or small text section. For structured data, the excerpt could be a row of tabular data or self-contained information in a block of JSON or other format.
1. `entity`: A single named entity (e.g. person, place, company, product) extracted from an `excerpt`. The entity is detected and extracted from unstructured text automatically using a named entity recognition (NER) model. Entities are used for ultra-fine-grained search and retrieval tasks, where specific entities relevant to the user's query are identified across the entire knowledge graph. After finding relevant entities in the knowledge graph, the RAG system can then traverse the graph to locate the relevant excerpts and reports that contain references to those entities.
1. `uentity`: A single unique entity. This is an `entity` object that has been deduplicated, so each `uentity` is unique. For example, the entity "INL" might exist in many places across the knowledge graph, but there is only one `uentity` object for "INL". The use of unique entities allows the RAG system to perform semantic search across the top several matching entities, without the need for deduplicating results at the time of each query.


## Description of initial datasets

1. **CISA CSAF OT White dataset**: This dataset must be downloaded from a public repository on GitHub. The dataset ingetion pipeline should download the CISA dataset from GitHub, unzip it locally, process the files, and insert them into your local Postgres database. [View dataset on GitHub](https://github.com/cisagov/CSAF/tree/develop/csaf_files/OT/white)
1. **ARC market data**: This static dataset, protected by license, is stored locally in a set of JSON files.
1. **EIA.gov data** [EIA.gov open data](https://www.eia.gov/opendata/): in progress
1. **OSTI.gov data** [OSTI.gov](https://www.osti.gov/): in progress
1. **CYOTE data**: PDF and CSV files which are sensitive and stored on Box. 


### Additional future datasets

- **MITRE ATT&CK**: JSON data which was originally in the MVP sources but was unprioritized. Use the most recent version of the [JSON data here](https://github.com/mitre-attack/attack-stix-data/tree/master/ics-attack)
