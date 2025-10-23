# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import os
from dotenv import load_dotenv

load_dotenv()

# MinIO credentials
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")
BUCKET_NAME = os.getenv("BUCKET_NAME")

# Directories that store the raw data to be ingested
RAW_DATA_DIRECTORY_ARC = os.getenv("RAW_DATA_DIRECTORY_ARC")
RAW_DATA_DIRECTORY_EIA = os.getenv("RAW_DATA_DIRECTORY_EIA")
RAW_DATA_DIRECTORY_OSTI = os.getenv("RAW_DATA_DIRECTORY_OSTI")
RAW_DATA_PATH_CYOTE_TABULAR = os.getenv("RAW_DATA_PATH_CYOTE_TABULAR")
RAW_DATA_DIRECTORY_CYOTE_REPORTS = os.getenv("RAW_DATA_DIRECTORY_CYOTE_REPORTS")
RAW_DATA_DIRECTORY_CISA = os.getenv("RAW_DATA_DIRECTORY_CISA")
RAW_DATA_PATH_KEV = os.getenv("RAW_DATA_PATH_KEV")
RAW_DATA_DIRECTORY_NIST = os.getenv("RAW_DATA_DIRECTORY_NIST")
RAW_DATA_DIRECTORY_MITRE = os.getenv("RAW_DATA_DIRECTORY_MITRE")
RAW_DATA_PATH_EERE_FOAS = os.getenv("RAW_DATA_PATH_EERE_FOAS")

SEED_DATA_PATH = os.getenv("SEED_DATA_PATH")

# Github/Gitlab mirror configuration
CISA_BASE_GIT_URL = os.getenv("CISA_BASE_GIT_URL")
CISA_GIT_DOWNLOAD_URL = os.getenv("CISA_GIT_DOWNLOAD_URL")
CISA_PATH = os.getenv("CISA_PATH")
CISA_MIRROR_PRIVATE_TOKEN = os.getenv("CISA_MIRROR_PRIVATE_TOKEN")

# Flag for using the named entity recognition model
# for entity extraction on unstructured text.
USE_NER_MODEL = False

# Flags for ommitting datasets from ingestion
OMIT_EIA = os.getenv("OMIT_EIA", "False") == "True"
OMIT_CISA = os.getenv("OMIT_CISA", "False") == "True"
OMIT_ARC = os.getenv("OMIT_ARC", "False") == "True"
OMIT_CYOTE_REPORTS = os.getenv("OMIT_CYOTE_REPORTS", "False") == "True"
OMIT_CYOTE_OBSERVABLES = os.getenv("OMIT_CYOTE_OBSERVABLES", "False") == "True"
OMIT_KEV = os.getenv("OMIT_KEV", "False") == "True"
OMIT_MITRE = os.getenv("OMIT_MITRE", "False") == "True"
OMIT_NIST = os.getenv("OMIT_NIST", "False") == "True"
OMIT_EERE_FOAS = os.getenv("OMIT_EERE_FOAS", "False") == "True"
