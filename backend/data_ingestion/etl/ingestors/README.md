# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

# Ingestors

This directory holds ingestors that perform ETL on each dataset for transforming the raw data into a sctructured schema that's inserted into the knowledge graph database, which makes it available for browsing and chatbot Q&A. Each dataset currently has its own ingestor script, which is run by the `all.py` script in this directory. The ingestors are designed to be modular, so that new datasets can be added easily by creating a new ingestor script and adding it to the `all.py` script.

An individual ingestor module can also be run invidvidually without initiating the ETL process for all ingestors.
