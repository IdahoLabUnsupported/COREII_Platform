# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import os
from minio import Minio
from minio.error import S3Error
from settings import (
    MINIO_ENDPOINT,
    MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY,
    BUCKET_NAME,
    OMIT_EIA,
    OMIT_ARC,
    OMIT_CYOTE_REPORTS,
    OMIT_CYOTE_OBSERVABLES,
    OMIT_KEV,
    OMIT_MITRE,
    OMIT_NIST,
    OMIT_EERE_FOAS,
)

DATASETS_TO_OMIT = {
    "EIA/": OMIT_EIA,
    "ARC/": OMIT_ARC,
    "Cyote/": OMIT_CYOTE_REPORTS and OMIT_CYOTE_OBSERVABLES,
    "KEV/": OMIT_KEV,
    "MITRE/": OMIT_MITRE,
    "NIST/": OMIT_NIST,
    "EERE_FOAS/": OMIT_EERE_FOAS,
}
# Precompute the set of prefixes that should be skipped
OMIT_PREFIXES = {prefix for prefix, omit_flag in DATASETS_TO_OMIT.items() if omit_flag}


# Copy datsets from MinIO into the container
def copy_data(output_dir="/code/datasets"):
    try:
        # Initialize MinIO client
        client = Minio(
            MINIO_ENDPOINT,
            access_key=MINIO_ACCESS_KEY,
            secret_key=MINIO_SECRET_KEY,
            secure=False,
        )

        # Ensure bucket exists
        if not client.bucket_exists(BUCKET_NAME):
            raise Exception(f"Bucket '{BUCKET_NAME}' does not exist")

        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)

        # List all objects in the bucket
        objects = list(client.list_objects(BUCKET_NAME, recursive=True))

        print(f"Found {len(objects)} objects in bucket '{BUCKET_NAME}'")

        # Download each object
        for obj in objects:
            # Check if the object should be skipped using set lookup (O(1) time complexity)
            if any(obj.object_name.startswith(prefix) for prefix in OMIT_PREFIXES):
                continue  # Skip downloading

            # Create subdirectories if needed
            object_path = os.path.join(output_dir, obj.object_name)
            os.makedirs(os.path.dirname(object_path), exist_ok=True)

            print(f"Downloading: {obj.object_name}")
            # Download the object
            client.fget_object(BUCKET_NAME, obj.object_name, object_path)

        print(f"\nSuccessfully downloaded all files to {output_dir}")

    except S3Error as err:
        print(f"A minio error occurred: {err}")
    except Exception as err:
        print(f"A minio error occurred: {err}")
