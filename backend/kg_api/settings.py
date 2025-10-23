# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import os
from dotenv import load_dotenv

load_dotenv()

# Port for hosting the knowledge graph API
KG_API_PORT = int(os.getenv("KG_API_PORT"))
