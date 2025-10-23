# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import os
from dotenv import load_dotenv

# Locate this package's .env file so we aren't reading from the .env file
# that's associated with a parent package that depends on this package.
PACKAGE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(PACKAGE_DIR, ".env"))

# Root URL for machine learning API used for vector embeddings
ML_API_URL = os.getenv("ML_API_URL")

# Length of vector embeddings
VECTOR_LENGTH = int(os.getenv("VECTOR_LENGTH", 384))

# Get database credentials
DB_NAME = os.getenv("DB_NAME", "postgres")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD")
