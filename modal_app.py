"""
Modal deployment for Sentiment Analysis backend.

Setup (one-time):
    pip install modal
    modal setup
    modal secret create sentiment-secrets \
        GROQ_API_KEY=<your-key> \
        TWITTER_BEARER_TOKEN=<your-token> \
        TWITTER_ACCESS_TOKEN=<your-token> \
        TWITTER_ACCESS_TOKEN_SECRET=<your-secret>

Deploy:
    modal deploy modal_app.py

Serve locally (dev):
    modal serve modal_app.py
"""

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
