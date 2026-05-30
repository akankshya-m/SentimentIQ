from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from contextlib import asynccontextmanager
from core.db import init_db, verify_user
from models.schemas import AnalyseRequest
from pydantic import BaseModel
import json

@asynccontextmanager
async def lifespan(_app):
    await init_db()
    yield

app = FastAPI(title="Sentiment Analysis API", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.post("/api/analyse")
async def analyse(req: AnalyseRequest):
    from agent.classifier import SentimentAgent
    agent = SentimentAgent()
    return await agent.run(req.keyword, req.sources, req.date_range)

@app.get("/api/analyse/stream")
async def analyse_stream(
    keyword: str = Query(...),
    sources: str = Query("tw,rd,nw"),
    date_range: str = Query("all"),
):
    from agent.classifier import SentimentAgent
    agent = SentimentAgent()
    src_list = [s.strip() for s in sources.split(",")]

    async def generate():
        async for event in agent.run_stream(keyword, src_list, date_range):
            yield f"data: {json.dumps(event)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})

@app.get("/api/history")
async def history():
    from core.db import get_recent_runs
    return await get_recent_runs()

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/login")
async def login(req: LoginRequest):
    user = await verify_user(req.email, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return user
