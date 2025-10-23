# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

from time import time
from etl.ingestors.seed_data import seed_tables
from etl.copy_data import copy_data
from etl.ingestors import (
    kev,
    eia,
    cisa,
    arc,
    cyote_text_reports,
    cyote_observables_data,
    mitre,
    nist,
    eere_foas,
)
from settings import (
    OMIT_KEV,
    OMIT_EIA,
    OMIT_CISA,
    OMIT_ARC,
    OMIT_CYOTE_REPORTS,
    OMIT_CYOTE_OBSERVABLES,
    OMIT_MITRE,
    OMIT_NIST,
    OMIT_EERE_FOAS,
)


INGESTION_SCRIPTS = {
    kev: OMIT_KEV,
    eia: OMIT_EIA,
    cisa: OMIT_CISA,
    arc: OMIT_ARC,
    cyote_text_reports: OMIT_CYOTE_REPORTS,
    cyote_observables_data: OMIT_CYOTE_OBSERVABLES,
    mitre: OMIT_MITRE,
    nist: OMIT_NIST,
    eere_foas: OMIT_EERE_FOAS,
}


def print_elapsed_time(start_time: time):
    """Print the elapsed time."""
    elapsed_min = (time() - start_time) / 60
    print(f"Elapsed time: {elapsed_min:.2f} minutes")


def run_ingestion_pipeline():
    """Run data ingestion pipleines."""

    start_time = time()

    copy_data()

    seed_tables()

    for ingestion_script, omit_flag in INGESTION_SCRIPTS.items():
        if omit_flag:
            print(f"Skipping {ingestion_script.__name__} due to OMIT flag.")
            continue

        try:
            print()
            ingestion_script.main()
        except Exception as e:
            print(f"\n\nERROR running {str(ingestion_script.__name__)}:")
            print(str(e))
        print_elapsed_time(start_time)


if __name__ == "__main__":
    run_ingestion_pipeline()
