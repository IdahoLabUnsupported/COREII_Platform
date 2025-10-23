# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

from sqlalchemy import text
from sqlmodel import create_engine
from .settings import DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME


DEFAULT_DB_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/postgres"
DB_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Here we create the database if it doesn't exist yet.
# We run this before any other database initalization happens
# using the administrative postgres engine.
admin_engine = create_engine(DEFAULT_DB_URI, isolation_level="AUTOCOMMIT", echo=False)
with admin_engine.connect() as conn:
    result = conn.execute(
        text("SELECT 1 FROM pg_database WHERE datname = :dbname"),
        {"dbname": DB_NAME},
    )
    exists = result.scalar()
    if not exists:
        conn.execute(text(f"CREATE DATABASE {DB_NAME}"))

# Now we use the newly-created database as our engine
engine = create_engine(DB_URI, echo=False)

# Install required extensions in the new database
EXTENSIONS = ["vector"]
with engine.connect() as conn:
    for ext in EXTENSIONS:
        conn.execute(text(f"CREATE EXTENSION IF NOT EXISTS {ext}"))
    conn.commit()
