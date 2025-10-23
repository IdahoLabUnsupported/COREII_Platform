# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

# Build Stage 
FROM node:18-alpine AS build
RUN apk --no-check-certificate add wget ca-certificates
RUN wget -q -P /usr/local/share/ca-certificates/ http://certstore.inl.gov/pki/CAINLROOT_B64.crt
RUN /usr/sbin/update-ca-certificates
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt
ENV REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
ENV CURL_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
ENV SSL_CERT_DIR=/etc/ssl/certs/

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM nginx:stable-alpine AS production
ADD http://certstore.inl.gov/pki/CAINLROOT_B64.crt /usr/local/share/ca-certificates/
RUN /usr/sbin/update-ca-certificates
RUN apk update && \
    apk upgrade libxml2 libxslt libexpat xz-libs
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html/coreii-portal
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]