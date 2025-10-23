# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

from kg.initialize import initialize_tables

# Initialize the database if it hasn't been initialized yet.
# This will create the database, install extensions,
# and create the tables if they don't exist.
initialize_tables()
