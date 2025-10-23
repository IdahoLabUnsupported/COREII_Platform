#!/bin/bash

# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

# Wait for SQL Server to be ready
echo "Waiting for SQL Server to start..."

# Check if SA_PASSWORD is set
if [ -z "$MSSQL_SA_PASSWORD" ]; then
    echo "Error: MSSQL_SA_PASSWORD environment variable is not set!"
    exit 1
fi

# Check if SQL Server is responding
until /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -Q "SELECT 1" &> /dev/null
do
  echo "SQL Server is starting up..."
  sleep 5
done

echo "SQL Server is ready!"

# Now run your restore command
echo "Attempting to restore backup"
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -Q "RESTORE DATABASE [PORTAL] FROM DISK = N'/usr/src/app/Portal-2025123-15-2-51.bak' WITH FILE = 1, NOUNLOAD, REPLACE, STATS = 5"

# Check if restore was successful
if [ $? -eq 0 ]; then
    echo "Database restore completed successfully!"
else
    echo "Database restore failed!"
    exit 1
fi