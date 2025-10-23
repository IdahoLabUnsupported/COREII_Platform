# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.docs import get_swagger_ui_html

from settings import ML_API_PORT
from src.chat import determine_chat_action, DetermineChatActionPayload
from src.tokens import count_tokens

from src.open_ai_llm import get_llm_stream, get_llm_response
from src.bedrock_embeddings import create_embeddings

app = FastAPI(
    title="COREII ML API",
    description="A machine learning API for text generation, vector embeddings, and chat actions.",
    version="1.0.0",
    contact={"name": "Idaho National Laboratory"},
    docs_url=None,
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class LLMRequestPayload(BaseModel):
    messages: list[dict] = Field(
        ..., example=[{"role": "user", "content": [{"text": "Hello World!"}]}]
    )
    temperature: float = 0.0


class EmbeddingsRequestPayload(BaseModel):
    inputs: list[str]


@app.get(
    "/",
    tags=["Test"],
    responses={
        200: {
            "description": "string",
            "content": {
                "application/json": {
                    "example": {"success": "bool", "message": "string"}
                }
            },
        }
    },
)
async def test_connection() -> dict:
    """Test connection to the API server."""
    return {"success": True, "message": "COREII ML API is running!"}


@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title,
        swagger_js_url="/static/swagger-ui-bundle.js",
        swagger_css_url="/static/swagger-ui.css",
    )


@app.get("/count-tokens", tags=["Tokens"])
async def count_tokens_endpoint(input_string: str) -> int:
    """Count tokens in a string. Useful for testing offline functionality of tiktoken."""
    return count_tokens(input_string)


@app.post("/llm-response", tags=["Text Generation"])
async def llm_response_(request: LLMRequestPayload) -> str:
    """Return an LLM response without streaming"""
    return get_llm_response(request.messages)


@app.post("/stream-llm-response", tags=["Text Generation"])
async def get_llm_stream_(request: LLMRequestPayload):
    """Stream an LLM response"""
    return StreamingResponse(
        get_llm_stream(
            request.messages,
            temperature=request.temperature,
        )
    )


@app.post("/create-embeddings", tags=["Vector Embeddings"])
async def create_embeddings_(
        request: EmbeddingsRequestPayload,
) -> list[list[float]]:
    """Create vector embeddings for a list of string inputs"""
    if request.inputs:
        return create_embeddings(request.inputs)
    return []


@app.post(
    "/determine-chat-action",
    tags=["Chat"],
    responses={
        200: {
            "description": "string",
            "content": {
                "application/json": {
                    "example": {"action": "string", "response": "string"}
                }
            },
        }
    },
)
async def determine_chat_action_(request: DetermineChatActionPayload):
    """Deteremine whether to respond or do RAG lookup during a chat."""
    return determine_chat_action(request.messages, request.dataOverview)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=ML_API_PORT)
