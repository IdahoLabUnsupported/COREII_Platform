# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

USE_BERT_TOKENIZER = True

if USE_BERT_TOKENIZER:
    from transformers import AutoTokenizer

    tokenizer = AutoTokenizer.from_pretrained("all-MiniLM-L6-v2_cache")
else:
    import tiktoken

    tokenizer = tiktoken.get_encoding("cl100k_base")


def count_tokens(input_string: str) -> int:
    """Count the number of tokens in a string."""
    return len(tokenizer.encode(input_string))


def truncate_at_token_limit(input_string, max_tokens: int = 256) -> str:
    """Truncate a string at a token limit."""
    new_string = input_string
    n_tokens = count_tokens(new_string)
    while n_tokens >= max_tokens:
        splits = new_string.rsplit(" ", 1)
        if len(splits) == 1:
            break
        new_string = splits[0]
        n_tokens = count_tokens(new_string)
    new_string = new_string.strip()
    return new_string


if __name__ == "__main__":

    input_string = "Hello, this is a test string as a a full sentence."  # * 10

    n_tokens = count_tokens(input_string)
    print(f"Originally contained {n_tokens} tokens.")

    new_string = truncate_at_token_limit(input_string, 8)
    print(f"New string: {new_string}")
    print(f"Now contains {count_tokens(new_string)} tokens.")
