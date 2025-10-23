# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

# Use the official Postgres image as base
FROM postgres:16

# Install pgvector extension
RUN apt-get update && \
    apt-get install -y postgresql-server-dev-16 build-essential git && \
    git clone --branch v0.5.1 https://github.com/pgvector/pgvector.git && \
    cd pgvector && \
    make && make install && \
    cd .. && rm -rf pgvector && \
    apt-get remove -y build-essential git && \
    apt-get autoremove -y && \
    apt-get clean

# Set default PostgreSQL environment variables (you can override at runtime)
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=postgres

#to build and start the container, run:
#docker build -t pgvector-postgres .
#docker run -d --name pgvector-db -p 5432:5432 pgvector-postgres