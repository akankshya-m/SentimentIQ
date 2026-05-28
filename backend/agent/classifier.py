import os, json, asyncio
from groq import AsyncGroq
from typing import List, Dict, AsyncGenerator
from scrapers.reddit import scrape as scrape_rd
from scrapers.news import scrape as scrape_nw
from core.cleaner import clean
from core.aggregator import aggregate
from core.db import save_run
from agent.prompts import build_system_prompt, build_prompt

SCRAPERS = {"rd": scrape_rd, "nw": scrape_nw}
SRC_LABELS = {"rd": "Reddit", "nw": "News"}

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

GROQ_MODEL = "llama-3.3-70b-versatile"

class SentimentAgent:

    async def run(self, keyword: str, sources: List[str]) -> dict:
        raw = await self._scrape(sources, keyword)
        posts = clean(raw)
        classified = await self._classify(posts, keyword)
        summary = aggregate(classified)
        await save_run(keyword, sources, classified, summary)
        return {"keyword": keyword, "posts": classified, "summary": summary}

    async def run_stream(self, keyword: str, sources: List[str]) -> AsyncGenerator:
        # Step 1: scrape
        yield {"step": "scrape", "status": "running",
               "msg": f"Scraping {', '.join(SRC_LABELS[s] for s in sources if s in SRC_LABELS)}…"}
        raw = await self._scrape(sources, keyword)
        yield {"step": "scrape", "status": "done",
               "msg": f"Fetched {len(raw)} raw posts", "count": len(raw)}

        # Step 2: clean
        yield {"step": "clean", "status": "running", "msg": "Removing duplicates and noise…"}
        posts = clean(raw)
        yield {"step": "clean", "status": "done",
               "msg": f"{len(posts)} clean posts ready", "count": len(posts)}

        # Step 3: classify
        yield {"step": "classify", "status": "running",
               "msg": "AI agent classifying sentiment…"}
        classified = await self._classify(posts, keyword)
        yield {"step": "classify", "status": "done",
               "msg": f"Classified {len(classified)} posts", "count": len(classified)}

        # Step 4: aggregate
        yield {"step": "aggregate", "status": "running", "msg": "Building report…"}
        summary = aggregate(classified)
        await save_run(keyword, sources, classified, summary)
        yield {"step": "aggregate", "status": "done", "msg": "Done",
               "results": classified, "summary": summary}

    async def _scrape(self, sources, keyword):
        tasks = [SCRAPERS[s](keyword, limit=25) for s in sources if s in SCRAPERS]
        batches = await asyncio.gather(*tasks)
        return [p for batch in batches for p in batch]

    async def _classify(self, posts: List[Dict], keyword: str) -> List[Dict]:
        results = []
        for i in range(0, len(posts), 20):
            batch = posts[i:i+20]
            response = await client.chat.completions.create(
                model=GROQ_MODEL,
                max_tokens=2000,
                messages=[
                    {"role": "system", "content": build_system_prompt(keyword)},
                    {"role": "user", "content": build_prompt(batch)},
                ],
            )
            raw = response.choices[0].message.content
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
