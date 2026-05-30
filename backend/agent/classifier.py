import os, json, asyncio, logging
from typing import List, Dict, AsyncGenerator
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
from scrapers.reddit import scrape as scrape_rd
from scrapers.news import scrape as scrape_nw
from core.cleaner import clean
from core.aggregator import aggregate
from core.db import save_run
from agent.prompts import prompt_template, build_posts_text

logger = logging.getLogger(__name__)

SCRAPERS = {"rd": scrape_rd, "nw": scrape_nw}
SRC_LABELS = {"rd": "Reddit", "nw": "News"}

_groq_llm = ChatGroq(model="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY"))
_gemini_llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=os.getenv("GEMINI_API_KEY"))

_parser = StrOutputParser()
_groq_chain = prompt_template | _groq_llm | _parser
_gemini_chain = prompt_template | _gemini_llm | _parser


class SentimentAgent:

    async def run(self, keyword: str, sources: List[str], date_range: str = "all") -> dict:
        raw = await self._scrape(sources, keyword, date_range)
        posts = clean(raw, keyword)
        classified = await self._classify(posts, keyword)
        summary = aggregate(classified)
        await save_run(keyword, sources, classified, summary)
        return {"keyword": keyword, "posts": classified, "summary": summary}

    async def run_stream(self, keyword: str, sources: List[str], date_range: str = "all") -> AsyncGenerator:
        yield {"step": "scrape", "status": "running",
               "msg": f"Scraping {', '.join(SRC_LABELS[s] for s in sources if s in SRC_LABELS)}…"}
        raw = await self._scrape(sources, keyword, date_range)
        yield {"step": "scrape", "status": "done",
               "msg": f"Fetched {len(raw)} raw posts", "count": len(raw)}

        yield {"step": "clean", "status": "running", "msg": "Removing duplicates and noise…"}
        posts = clean(raw, keyword)
        yield {"step": "clean", "status": "done",
               "msg": f"{len(posts)} clean posts ready", "count": len(posts)}

        yield {"step": "classify", "status": "running", "msg": "AI agent classifying sentiment…"}
        classified = await self._classify(posts, keyword)
        yield {"step": "classify", "status": "done",
               "msg": f"Classified {len(classified)} posts", "count": len(classified)}

        yield {"step": "aggregate", "status": "running", "msg": "Building report…"}
        summary = aggregate(classified)
        await save_run(keyword, sources, classified, summary)
        yield {"step": "aggregate", "status": "done", "msg": "Done",
               "results": classified, "summary": summary}

    async def _scrape(self, sources, keyword, date_range="all"):
        tasks = [SCRAPERS[s](keyword, limit=25, date_range=date_range) for s in sources if s in SCRAPERS]
        batches = await asyncio.gather(*tasks)
        return [p for batch in batches for p in batch]

    async def _classify(self, posts: List[Dict], keyword: str) -> List[Dict]:
        results = []
        for i in range(0, len(posts), 20):
            batch = posts[i:i+20]
            raw = await self._invoke_with_fallback(batch, keyword)
            parsed = json.loads(raw.replace("```json", "").replace("```", "").strip())
            for item in parsed:
                idx = item.get("index", 0)
                if idx < len(batch):
                    batch[idx].update({
                        "sentiment": item.get("sentiment", "neutral"),
                        "confidence": round(item.get("confidence", 0.80), 2),
                        "reason": item.get("reason", ""),
                        "kp": item.get("kp", []),
                    })
            results.extend(batch)
        return results

    async def _invoke_with_fallback(self, batch: List[Dict], keyword: str) -> str:
        inputs = {"keyword": keyword, "posts_text": build_posts_text(batch)}
        try:
            return await _groq_chain.ainvoke(inputs)
        except Exception as e:
            err_str = f"{type(e).__name__} {e}"
            if "rate" in err_str.lower() or "quota" in err_str.lower() or "429" in err_str:
                logger.warning("Groq limit hit, falling back to Gemini for this batch")
                return await _gemini_chain.ainvoke(inputs)
            raise
