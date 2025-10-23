# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

FROM mcr.microsoft.com/mssql/server:2022-latest

# Create app directory
WORKDIR /usr/src/app

# Copy initialization scripts
COPY . /usr/src/app

# Expose ports
EXPOSE 1433
EXPOSE 8080

# Run Microsoft SQL Server and initialization script
CMD ["/bin/bash", "./entrypoint.sh"]