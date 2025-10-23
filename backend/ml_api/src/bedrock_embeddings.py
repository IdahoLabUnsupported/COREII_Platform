# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

"""
Here we are using an embeddings model hosted on AWS Bedrock for development and testing purposes only.
"""

import json

try:
    import boto3
except:
    pass

from settings import (
    EMBEDDING_MODEL_ID,
    AWS_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    EMBEDDING_TOKEN_LIMIT,
)
from src.tokens import truncate_at_token_limit


def get_bedrock_client():
    """Get the AWS Bedrock client using a session."""
    session = boto3.Session(
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION,
    )
    return session.client("bedrock-runtime")


def create_embeddings(inputs: list[str]) -> list[list[float]]:
    """Create vector embeddings for a list of strings."""
    inputs = [truncate_at_token_limit(i, EMBEDDING_TOKEN_LIMIT) for i in inputs]

    client = get_bedrock_client()

    embeddings = []
    for input_string in inputs:
        response = client.invoke_model(
            modelId=EMBEDDING_MODEL_ID,
            contentType="application/json",
            accept="application/json",
            body=json.dumps({"inputText": input_string}),
        )
        result = json.loads(response["body"].read())
        embeddings.append(result["embedding"])
    return embeddings


if __name__ == "__main__":
    strings = ["Hello world.", "Each sentence is vectorized."]
    response = create_embeddings(strings)
    print(response)
