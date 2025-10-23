# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import json
import re
from openai import OpenAI
from typing import Generator, Dict, Any, List, Optional
from settings import MODEL_ID_OPENAI, OPENAI_API_KEY, OPENAI_BASE_URL

DEFAULT_MAX_TOKENS = 10000
DEFAULT_TEMPERATURE = 0.0


def semantic_search(query: str, dataset: str) -> None:
    pass


def osti_search():
    pass


def get_openai_client():
    return OpenAI()


def convert_message(fe_messages: list[dict]) -> list[dict]:
    """
    Convert messages from the front end (which uses LLama/Bedrock format) to OpenAI format
    """
    openai_messages: list[dict] = []

    for msg in fe_messages:
        role = msg["role"]
        content = msg["content"]

        openai_messages.append({
            "role": role,
            "content": content[0]["text"],
        })

    return openai_messages


def filter_reasoning_tags(text: str) -> str:
    """
    Remove <reasoning></reasoning> tags and their content from text.

    Args:
        text: Input text that may contain reasoning tags

    Returns:
        Text with reasoning tags removed
    """
    # Remove reasoning tags and everything between them
    # re.DOTALL makes . match newlines too
    filtered_text = re.sub(r'<reasoning>.*?</reasoning>', '', text, flags=re.DOTALL)

    # Clean up any extra whitespace left behind
    filtered_text = filtered_text.strip()

    return filtered_text


def filter_reasoning_from_stream(text_chunk: str, buffer: str = "") -> tuple[str, str]:
    """
    Filter reasoning tags from streaming text chunks.
    Since reasoning tags might span multiple chunks, we need to buffer.

    Args:
        text_chunk: New chunk of streaming text
        buffer: Accumulated buffer from previous chunks

    Returns:
        Tuple of (filtered_output, new_buffer)
    """
    # Add new chunk to buffer
    buffer += text_chunk

    # Check if we have complete reasoning tags
    reasoning_pattern = r'<reasoning>.*?</reasoning>'

    # Find all complete reasoning blocks
    matches = list(re.finditer(reasoning_pattern, buffer, re.DOTALL))

    if matches:
        # Remove all complete reasoning blocks
        filtered_buffer = buffer
        for match in reversed(matches):  # Reverse to maintain indices
            filtered_buffer = filtered_buffer[:match.start()] + filtered_buffer[match.end():]

        # Check if there's an incomplete reasoning tag at the end
        incomplete_start = filtered_buffer.rfind('<reasoning>')
        if incomplete_start != -1:
            # There's an incomplete reasoning tag, keep it in buffer
            output = filtered_buffer[:incomplete_start]
            new_buffer = filtered_buffer[incomplete_start:]
        else:
            output = filtered_buffer
            new_buffer = ""

    else:
        # No complete reasoning blocks found
        # Check if we're in the middle of a reasoning block
        reasoning_start = buffer.find('<reasoning>')
        if reasoning_start != -1:
            # We're inside a reasoning block, don't output anything
            output = buffer[:reasoning_start] if reasoning_start > 0 else ""
            new_buffer = buffer[reasoning_start:] if reasoning_start >= 0 else buffer
        else:
            # No reasoning tags, output everything
            output = buffer
            new_buffer = ""

    return output, new_buffer


def get_llm_response(
        messages: list[dict],
        max_tokens: int = DEFAULT_MAX_TOKENS,
        temperature: float = DEFAULT_TEMPERATURE,
) -> str:
    """Return the entire LLM response without streaming using chat-like messages."""
    client = get_openai_client()

    openai_messages = convert_message(messages)

    request_params = {
        "model": MODEL_ID_OPENAI,
        "messages": openai_messages,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "stream": False,
    }

    response = client.chat.completions.create(**request_params)
    response_text = filter_reasoning_tags(response.choices[0].message.content)
    return response_text


def get_llm_stream(
        messages: list[dict],
        tools: Optional[List[Dict[str, Any]]] = None,
        max_tokens: int = DEFAULT_MAX_TOKENS,
        temperature: float = DEFAULT_TEMPERATURE,
        tool_executor: Optional[callable] = None,
        filter_reasoning: bool = True,
) -> Generator[Dict[str, Any], None, None]:
    """
    Stream the LLM response with tool calling support.

    Args:
        messages: Chat messages
        tools: List of tool definitions
        max_tokens: Maximum tokens to generate
        temperature: Sampling temperature
        tool_executor: Function to execute tools (tool_name, tool_input) -> result
        filter_reasoning: If true, filter reason tags before generating response

    Yields:
        Dict with 'type' and content:
        - {'type': 'text', 'content': 'text chunk'}
        - {'type': 'tool_call', 'name': 'tool_name', 'input': {...}}
        - {'type': 'tool_result', 'name': 'tool_name', 'result': {...}}
        - {'type': 'stream_end'}
    """
    client = get_openai_client()

    openai_messages = convert_message(messages)

    # Prepare the request parameters
    request_params = {
        "model": MODEL_ID_OPENAI,
        "messages": openai_messages,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "stream": True,
    }

    # Add tools if provided
    if tools:
        request_params["tools"] = tools
        request_params["tool_choice"] = "auto"

    # Track tool calls and reasoning buffer
    tool_calls = {}
    reasoning_buffer = ""
    stream_ended = False

    try:
        response = client.chat.completions.create(**request_params)

        for chunk in response:
            if not chunk.choices:
                continue

            choice = chunk.choices[0]
            delta = choice.delta

            # Handle regular text content
            if delta.content is not None:
                text_content = delta.content

                # Filter reasoning tags if enabled
                if filter_reasoning:
                    filtered_output, reasoning_buffer = filter_reasoning_from_stream(
                        text_content, reasoning_buffer
                    )
                    if filtered_output:
                        yield filtered_output
                else:
                    yield text_content

            # Handle tool calls
            if delta.tool_calls:
                for tool_call in delta.tool_calls:
                    call_id = tool_call.id

                    # Initialize tool call if this is the first chunk for this call
                    if call_id not in tool_calls:
                        tool_calls[call_id] = {
                            "id": call_id,
                            "name": "",
                            "arguments": ""
                        }

                        # Show tool usage to user
                        tool_name = tool_call.function.name if tool_call.function and tool_call.function.name else "unknown"
                        yield f"\n🔧 Using {tool_name}..."

                    # Update tool name if provided
                    if tool_call.function and tool_call.function.name:
                        if not tool_calls[call_id]["name"]:
                            tool_calls[call_id]["name"] = tool_call.function.name

                    # Accumulate arguments
                    if tool_call.function and tool_call.function.arguments:
                        tool_calls[call_id]["arguments"] += tool_call.function.arguments

            # Check for termination conditions
            if choice.finish_reason == "tool_calls":
                # Process completed tool calls
                for call_id, tool_call_data in tool_calls.items():
                    try:
                        # Parse the accumulated JSON arguments
                        arguments = json.loads(tool_call_data["arguments"]) if tool_call_data["arguments"] else {}

                        yield f"\n🔧 Calling {tool_call_data['name']}\n"

                        # Execute tool if executor provided
                        if tool_executor:
                            try:
                                result = tool_executor(tool_call_data["name"], arguments)

                                # Display result to user
                                result_text = json.dumps(result, indent=2) if isinstance(result, dict) else str(result)
                                yield f"✅ Result: {result_text}\n\n"

                                # Add assistant message with tool call
                                messages.append({
                                    "role": "assistant",
                                    "tool_calls": [
                                        {
                                            "id": call_id,
                                            "type": "function",
                                            "function": {
                                                "name": tool_call_data["name"],
                                                "arguments": tool_call_data["arguments"]
                                            }
                                        }
                                    ]
                                })

                                # Add tool result message
                                messages.append({
                                    "role": "tool",
                                    "tool_call_id": call_id,
                                    "content": str(result)
                                })

                            except Exception as e:
                                error_msg = f"❌ Tool error: {str(e)}\n\n"
                                yield error_msg

                                # Add error to conversation
                                messages.append({
                                    "role": "assistant",
                                    "tool_calls": [
                                        {
                                            "id": call_id,
                                            "type": "function",
                                            "function": {
                                                "name": tool_call_data["name"],
                                                "arguments": tool_call_data["arguments"]
                                            }
                                        }
                                    ]
                                })

                                messages.append({
                                    "role": "tool",
                                    "tool_call_id": call_id,
                                    "content": f"Error: {str(e)}"
                                })
                                yield "</STREAM>"

                    except json.JSONDecodeError as e:
                        yield f"❌ Invalid tool arguments: {str(e)}\n\n"
                        yield "</STREAM>"

                # Continue the conversation after tool execution
                if tool_executor and tool_calls:
                    yield from get_llm_stream(
                        messages=messages,
                        tools=tools,
                        max_tokens=max_tokens,
                        temperature=temperature,
                        tool_executor=tool_executor,
                        filter_reasoning=filter_reasoning
                    )

                stream_ended = True
                break

            elif choice.finish_reason == "stop":
                # Normal completion - output any remaining buffered content
                if filter_reasoning and reasoning_buffer:
                    final_output = filter_reasoning_tags(reasoning_buffer)
                    if final_output.strip():
                        yield final_output

                stream_ended = True
                break

            elif choice.finish_reason == "length":
                yield "\n[Max tokens reached]"
                stream_ended = True
                break

            elif choice.finish_reason == "content_filter":
                yield "\n[Response filtered]"
                stream_ended = True
                break

        # Fallback termination
        if not stream_ended:
            if filter_reasoning and reasoning_buffer:
                final_output = filter_reasoning_tags(reasoning_buffer)
                if final_output.strip():
                    yield final_output

    except Exception as e:
        yield f"\n❌ Streaming error: {str(e)}"

    # Always yield termination signal
    yield "</STREAM>"


# Example tool executor function
def execute_tool(tool_name: str, tool_input: dict) -> Any:
    """Execute a tool and return the result."""
    if tool_name == "calculator":
        # Example calculator tool
        expression = tool_input.get("expression", "")
        try:
            result = eval(expression)  # Use safely in production!
            return {"result": result}
        except Exception as e:
            return {"error": str(e)}

    elif tool_name == "search":
        # Example search tool
        query = tool_input.get("query", "")
        # Implement your search logic here
        return {"results": f"Search results for: {query}"}

    else:
        return {"error": f"Unknown tool: {tool_name}"}


# Example usage
def example_usage():
    """Example of how to use the streaming function with tools."""

    # Define tools
    tools = [
        {
            "toolSpec": {
                "name": "calculator",
                "description": "Perform mathematical calculations",
                "inputSchema": {
                    "json": {
                        "type": "object",
                        "properties": {
                            "expression": {
                                "type": "string",
                                "description": "Mathematical expression to evaluate"
                            }
                        },
                        "required": ["expression"]
                    }
                }
            }
        }
    ]

    messages = [
        {
            "role": "user",
            "content": [{"text": "What is 15 * 24 + 7?"}]
        }
    ]

    # Stream with tools
    for chunk in get_llm_stream(
            messages=messages,
            tools=tools,
            tool_executor=execute_tool
    ):
        if chunk["type"] == "text":
            print(chunk["content"], end="", flush=True)
        elif chunk["type"] == "tool_call":
            print(f"\n[Calling {chunk['name']} with {chunk['input']}]")
        elif chunk["type"] == "tool_result":
            print(f"[Tool result: {chunk['result']}]")
        elif chunk["type"] == "stream_end":
            print("\n[Stream ended]")
            break
