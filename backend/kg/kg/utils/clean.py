# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

def remove_duplicate_dict_values(dicts: list[dict], key: str) -> list[dict]:
    """Remove dictionaries form a list when they have duplicate key-value pairs."""
    vals = set()
    keep_dicts = []
    for d in dicts:
        if d.get(key) not in vals:
            keep_dicts.append(d)
            vals.add(d[key])
    return keep_dicts


def remove_keys(data: dict | list, excluded_keys: set[str]) -> dict | list:
    """Remove keys from a nested dict or list of dicts."""
    if isinstance(data, dict):
        return {
            k: remove_keys(v, excluded_keys)
            for k, v in data.items()
            if k not in excluded_keys
        }
    elif isinstance(data, list):
        return [remove_keys(item, excluded_keys) for item in data]
    else:
        return data
