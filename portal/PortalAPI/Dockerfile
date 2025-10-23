# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

COPY . ./

RUN wget -q -P /usr/local/share/ca-certificates/ http://certstore.inl.gov/pki/CAINLROOT_B64.crt
RUN /usr/sbin/update-ca-certificates
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
ENV SSL_CERT_DIR=/etc/ssl/certs/

ARG SQL_API_URL
ENV SQL_API_URL $SQL_API_URL
ARG SQL_API_PORT
ENV SQL_API_PORT $SQL_API_PORT
ARG SQL_PASS
ENV SQL_PASS $SQL_PASS
ARG LDAP_SERVER
ENV LDAP_SERVER $LDAP_SERVER
ARG MSA_ACCOUNT
ENV MSA_ACCOUNT $MSA_ACCOUNT
ARG MSA_PASSWORD
ENV MSA_PASSWORD $MSA_PASSWORD
ARG LOCAL_STATUS
ENV LOCAL_STATUS $LOCAL_STATUS
ARG JWT_TOKEN_KEY
ENV JWT_TOKEN_KEY $JWT_TOKEN_KEY

RUN dotnet restore CoreIIApi.sln

RUN dotnet build -c Release --no-restore

RUN dotnet publish CoreII.Api/CoreII.Api.csproj -c Release -o out --no-restore

# Production stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app
# Upgrade all dependencies and Install required dependencies for LDAP
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y libldap-2.5.0 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
COPY --from=build /app/out .

EXPOSE 5000
EXPOSE 8080
EXPOSE 1433

ENTRYPOINT ["dotnet", "CoreII.Api.dll"]
