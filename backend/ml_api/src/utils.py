# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import re
import json
from typing import Union


def string_to_json(input_string: str) -> Union[dict, list, None]:
    """
    Convert a potentially malformed JSON string safely to JSON.
    This is useful for transforming the output of an LLM into
    JSON that can be used as a python dict or list.
    """
    json_match = re.search(r"({|\[)[^}]*?(}|\])", input_string)
    if not json_match:
        return None
    json_str = input_string[json_match.start() : json_match.end()]
    if (json_str.startswith("{") and not json_str.endswith("}")) or (
        json_str.startswith("[") and not json_str.endswith("]")
    ):
        return None
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        stack = []
        for i, char in enumerate(json_str):
            if char in "{[":
                stack.append(char)
            elif char in "}]":
                if not stack:
                    continue
                if (char == "}" and stack[-1] == "{") or (
                    char == "]" and stack[-1] == "["
                ):
                    stack.pop()
                    if not stack:
                        try:
                            return json.loads(json_str[: i + 1])
                        except json.JSONDecodeError:
                            continue
        return None
