# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import os
import json
import zipfile
import requests
from pathlib import Path
from etl.serialization import unserialize_dates, DateEncoder
from settings import (
    RAW_DATA_DIRECTORY_CISA,
    CISA_GIT_DOWNLOAD_URL,
    CISA_MIRROR_PRIVATE_TOKEN,
)


def list_directory_files(dir_path: str, extensions: list[str] = ["*"]):
    """List all files in a directory."""
    files = [str(path) for path in Path(dir_path).rglob("*") if path.is_file()]
    if "*" not in extensions:
        files = [
            f
            for f in files
            if any(f.lower().endswith(ext.lower()) for ext in extensions)
        ]
    return files


def read_json_file(filepath: str) -> dict | list:
    """Read a local JSON file and return its contents."""
    with open(filepath, "r") as file:
        data = json.load(file)
    data = unserialize_dates(data)
    return data


def save_json_file(data: dict | list, filepath: str, indent: int = 4) -> None:
    """Save a local JSON file from a python dict."""
    with open(filepath, "w") as f:
        json.dump(data, f, indent=4, cls=DateEncoder)


def save_text_file(data: str, filepath: str) -> None:
    """Save a local text file from a python string."""
    with open(filepath, "w") as f:
        f.write(data)


def download_github_repo_as_zip(zipped_path) -> None:
    """
    Download a GitHub/Gitlab repository as a zip file.
    """
    if CISA_MIRROR_PRIVATE_TOKEN != "NONE":
        headers = {"PRIVATE-TOKEN": CISA_MIRROR_PRIVATE_TOKEN}
        response = requests.get(CISA_GIT_DOWNLOAD_URL, stream=True, headers=headers)
    else:
        response = requests.get(CISA_GIT_DOWNLOAD_URL, stream=True)

    if response.status_code == 200:
        with open(zipped_path, "wb") as file:
            for chunk in response.iter_content(chunk_size=128):
                file.write(chunk)
    else:
        print(f"Failed to download repository: {response.status_code}")


def unzip_folder(zipped_path: str, unzipped_path: str) -> None:
    """Unzip a local zip folder."""
    try:
        with zipfile.ZipFile(zipped_path, "r") as z:
            z.extractall(unzipped_path)
    except Exception as e:
        print(f"Error: {str(e)}")


def repo_to_dir() -> None:
    """Download a GitHub repo as a zip folder and unzip it."""

    zipped_path = os.path.join(RAW_DATA_DIRECTORY_CISA, "cisa-csaf" + ".zip")
    unzipped_path = os.path.join(RAW_DATA_DIRECTORY_CISA, "cisa-csaf")

    if not os.path.exists(RAW_DATA_DIRECTORY_CISA):
        os.makedirs(RAW_DATA_DIRECTORY_CISA)

    # first we download the entire GitHub repo as a zip folder
    # so that we only incur a single request against GitHub's API
    download_github_repo_as_zip(zipped_path)
    # unzip the downloaded GitHub repo directory
    unzip_folder(
        zipped_path=zipped_path,
        unzipped_path=unzipped_path,
    )


def is_zip_file(filepath):
    """Check to see if the give file is a ZIP file"""
    return zipfile.is_zipfile(filepath)
