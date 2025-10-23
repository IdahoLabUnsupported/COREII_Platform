# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import sys
import requests
from ..settings import ML_API_URL


def create_embeddings(inputs: list[str]) -> list[list[float]]:
    """Call the machine learning API to create vector embeddings."""
    try:
        embeddings_url = ML_API_URL + "create-embeddings"
        response = requests.post(embeddings_url, json={"inputs": inputs})
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error occurred while creating embeddings: {e}")
        print("Failed to create embeddings via the ML API. Is it running?")
        sys.exit(1)
