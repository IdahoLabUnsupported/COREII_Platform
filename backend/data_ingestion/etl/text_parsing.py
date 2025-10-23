# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import re
import pymupdf
from docx import Document


def read_unstructured_text_file(filepath: str, clean: bool = True) -> str:
    """
    Read the content of an unstructured text file.
    Optionally do some basic cleaning of the text with clean=True.
    """
    extension = filepath.split(".")[-1].lower()
    if extension in ["txt", "md"]:
        text = read_text_file(filepath)
    elif extension == "docx":
        text = read_docx_file(filepath)
    elif extension == "pdf":
        text = read_pdf_file(filepath)
    else:
        raise ValueError(
            f"Can't read unstructured text from file extension '{extension}'"
        )
    if clean:
        text = clean_text(text)
    return text


def read_text_file(filepath: str) -> str:
    """Read the content of a text file."""
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()
    return text


def read_docx_file(filepath: str) -> str:
    """Read the content of a docx file."""
    doc = Document(filepath)
    full_text = [para.text for para in doc.paragraphs if para.text]
    text = "\n".join(full_text)
    return text.strip()


def read_pdf_file(
    filepath: str,
    top_threshold: float | None = 0.1,
    bottom_threshold: float | None = 0.9,
) -> str:
    """
    Read the content of a pdf file.
    Optionally exclude the top and bottom sections of the page
    in order to avoid extracting page numbers
    and repetitive headers, and footers.
    """
    doc = pymupdf.open(filepath)
    if top_threshold is None and bottom_threshold is None:
        full_text = [page.get_text() for page in doc]
    else:
        full_text = []
        for page in doc:
            blocks = page.get_text("blocks")
            page_height = page.rect.height
            header_threshold = page_height * top_threshold
            footer_threshold = page_height * bottom_threshold
            page_text = ""
            for block in blocks:
                x0, y0, x1, y1, text, block_type, block_no = block
                if y1 < header_threshold:
                    continue
                if y0 > footer_threshold:
                    continue
                page_text += text
            full_text.append(page_text)
        text = " ".join(full_text)
    return text


def clean_text(text: str) -> str:
    """Clean a block of text."""
    # replace long lists of periods with "..."
    text = re.sub(r"\.{4,}", "...", text)
    # replace long lists of new line characters with " "
    text = re.sub(r"[\r\n]+", " ", text)
    # replace long lists of spaces with a single space
    text = re.sub(r"\s{2,}", " ", text)
    # replace long lists of tabs with a single tab
    text = re.sub(r"\t{2,}", "\t", text)
    return text


def recursive_text_splitter(
    text, max_chunk_size=500, separators=[r"\n\n+", r"\n", r"(?<=[.!?])\s+", " "]
):
    """
    Recursively splits text into chunks not exceeding max_chunk_size,
    preferentially on the provided separators. After splitting, it
    combines adjacent chunks where possible without exceeding max_chunk_size.

    Args:
        text (str): The text to split.
        max_chunk_size (int): The maximum allowed length of each chunk.
        separators (list): A list of separators to split on, in order of preference.

    Returns:
        list: A list of text chunks.
    """
    if not text:
        return []
    # if no separators are left, split arbitrarily
    if not separators:
        return [
            text[i : i + max_chunk_size] for i in range(0, len(text), max_chunk_size)
        ]
    separator = separators[0]

    # determine if the separator is a regex pattern

    regex_separators = [r"\n\n+", r"\n", r"(?<=[.!?])\s+"]
    is_regex = separator in regex_separators

    if is_regex:
        splits = re.split(separator, text)
        matches = list(re.finditer(separator, text))
        chunks = []
        for i, split in enumerate(splits):
            chunks.append(split)
            if i < len(matches):
                chunks.append(matches[i].group())
    else:
        splits = text.split(separator)
        chunks = []
        for i, split in enumerate(splits):
            chunks.append(split)
            if i < len(splits) - 1:
                chunks.append(separator)
    new_chunks = []
    for chunk in chunks:
        if len(chunk) > max_chunk_size:
            smaller_chunks = recursive_text_splitter(
                chunk, max_chunk_size, separators[1:]
            )
            new_chunks.extend(smaller_chunks)
        else:
            new_chunks.append(chunk)

    # combine adjacent chunks where possible
    combined_chunks = []
    current_chunk = ""
    for chunk in new_chunks:
        if len(current_chunk) + len(chunk) <= max_chunk_size:
            current_chunk += chunk
        else:
            if current_chunk:
                combined_chunks.append(current_chunk)
            current_chunk = chunk
    if current_chunk:
        combined_chunks.append(current_chunk)

    return combined_chunks
