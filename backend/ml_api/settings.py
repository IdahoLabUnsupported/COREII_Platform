# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import os
from dotenv import load_dotenv

load_dotenv()

# Read the lokcal tiktoken cache so we can count tokens without external network calls
TIKTOKEN_CACHE_NAME = "9b5ad71b2ce5302211f9c61530b329a4922fc6a4"
TIKTOKEN_CACHE_DIR = "tiktoken_cache"
os.environ["TIKTOKEN_CACHE_DIR"] = TIKTOKEN_CACHE_DIR
assert os.path.exists(os.path.join(TIKTOKEN_CACHE_DIR, TIKTOKEN_CACHE_NAME))

# Port for hosting the machine learning API
ML_API_PORT = int(os.getenv("ML_API_PORT", "8000"))

# Max number of tokens to send to an embedding model.
# if more tokens are sent, string will be truncated until
# its length is below the token limit.
# This limit is a hard cap based on the embeddings model used.
EMBEDDING_TOKEN_LIMIT = 256

# Testing LLM usage with LLM and embeddings models using AWS Bedrock.
# This setting will never be used in production on-premises.
EMBEDDING_MODEL_ID = os.getenv("EMBEDDING_MODEL_ID", "amazon.titan-embed-text-v2:0")
AWS_REGION = os.getenv("AWS_REGION", "us-west-2")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
MODEL_ID_OPENAI = os.getenv("MODEL_ID_OPENAI", "openai.gpt-oss-120b-1:0")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://bedrock-runtime.us-west-2.amazonaws.com/openai/v1")