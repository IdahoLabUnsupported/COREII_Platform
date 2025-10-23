# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

# Machine learning API

This is the backend API that controls access to language models for text generation and vector embeddings. All environment variables are shown in the `.env.example` file. Please copy this file, rename it to `.env`, and set the appropriate variables. All environment variables are accessed in the `settings.py` file.

## Running locally

To run locally, you must be able to access the models and run the Python application.

### Running the Python application

This is a [FastAPI](https://fastapi.tiangolo.com/) application. To run it locally:

1. Create a virtual environment: `python3.12 -m venv venv`
1. Activate the environment: `.venv/bin/activate` (or `.\venv\Scripts\Activate.ps1` on Windows)
1. Update pip: `pip install -U pip`
1. Install requirements: `pip install -r requirements.txt`
1. Run the app using `python -m uvicorn main:app --reload`
1. Swagger docs will be available at [http://localhost:8000/docs](http://localhost:8000/docs), where `8000` is the `ML_API_PORT` number specified in the `.env` file. 
