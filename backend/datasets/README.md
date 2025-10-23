# Datasets

This directory is used for storing test data that needs to be ingested into the COREII knowledge graph.

To use this directory,
1. Go to this Box folder: https://app.box.com/folder/293047182200
1. Download the `data.zip` file
1. Unzip the folder
1. Place the unzipped `data/` directory in this folder. For example, the GitHub repo path should be `COREII-Data-Lake/backend/datasets/data/...`.

The data ingestion scripts will then read the raw data and perform ETL to populate the COREII knowledge graph database.

## Test data

There is a small sampling of public data in this directory in the `data/test/` folder. Use this data to test the database initialization and ETL pipeline without using any non-public data.


## Dataset locations on KDI

* ARC
    * ARC data is in a zip folder. We want to read all JSON files inside it.
    * `/mnt/storage/data/inl001/ARC/ARC Market Intelligence Data Set.zip/`
* CyOTE
    * CyOTE data is in a single folder that contains a zip folder and a CSV file. We want to read all DOCX and PDF files inside the zip folder, and read the CSV file.
    * `/mnt/storage/data/inl001/CyOTE/CyOTE 27 Precursor Analyst Reports Text.zip`
    * `/mnt/storage/data/inl001/CyOTE/all_case_study_observables_w_d_notation.csv`
* CISA
    * CISA data is mirrored on GitLab. We need to clone the repo to the KDI, then read all the JSON files in the OT/white directory in the repo.
    * `https://code-caiser.caiser.ornlkdi.org/caiser-mirrors/inl001/cisa`
* EIA
    * look for newest folder inside `EIA`
    * `mnt/storage/data/inl001/EIA/newest_folder/AEO2023.zip/AEO2023.txt`
* OSTI
    * `/mnt/storage/data/inl001/OSTI/`
        * Each year has a directory, which holds month directories, which each hold individual .txt files containing one OSTI JSON each.
        * For example: `/mnt/storage/data/inl001/OSTI/2023/08/757002.txt`
        * some years and months are missing, and all month directory names are zero-padded (01, 02, 03...)
        * entire OSTI folder contains over 3.134 million text files (over 7.9 GB)

