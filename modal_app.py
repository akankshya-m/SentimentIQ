# Deploy: modal deploy modal_app.py
# Dev:    modal serve modal_app.py

import modal
from pathlib import Path

BACKEND_DIR = Path(__file__).parent / "backend"

app = modal.App("sentiment-analysis")

# Persistent volume keeps SQLite data across deploys and cold starts
db_volume = modal.Volume.from_name("sentiment-db", create_if_missing=True)

image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install([
        "fastapi[standard]",
        "groq",
        "httpx",
        "ntscraper",
        "trafilatura",
        "feedparser",
        "aiosqlite",
        "pydantic",
        "python-multipart",
        "python-dotenv",
        "certifi",
        "langchain",
        "langchain-groq",
        "langchain-google-genai",
        "langchain-core",
    ])
    .add_local_dir(str(BACKEND_DIR), remote_path="/app")
)


@app.function(
    image=image,
    secrets=[modal.Secret.from_name("sentiment-secrets")],
    volumes={"/data": db_volume},
    # keep_warm=1,  # Uncomment to eliminate cold starts (~$5/month extra)
)
@modal.concurrent(max_inputs=10)
@modal.asgi_app()
def web():
    import sys
    import os
    sys.path.insert(0, "/app")
    os.environ.setdefault("DB_PATH", "/data/sentiment.db")
    from main import app as fastapi_app
    return fastapi_app
