#!/bin/bash

# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

# Run initialization in the background
/usr/src/app/run-initialization.sh &

# Start SQL Server in the foreground (Docker expects this)
/opt/mssql/bin/sqlservr
