import os
import httpx
from typing import List, Dict

REDDIT_TIME_MAP = {
    "today":         "day",
    "yesterday":     "day",
    "last_week":     "week",
    "last_month":    "month",
    "last_3_months": "year",
    "last_6_months": "year",
}

async def scrape(keyword: str, limit: int = 25, date_range: str = "all") -> List[Dict]:
    params = {"q": keyword, "limit": limit, "sort": "new"}
    if date_range in REDDIT_TIME_MAP:
        params["t"] = REDDIT_TIME_MAP[date_range]
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) "
                      "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
        "Cookie": os.getenv("REDDIT_COOKIE", ""),
    }
    results = []
    try:
        async with httpx.AsyncClient() as client:
            r = await client.get(
                "https://www.reddit.com/search.json",
                params=params, headers=headers, timeout=10
            )
            r.raise_for_status()
            children = r.json()["data"]["children"]

        for child in children:
            post = child["data"]
            title = post.get("title", "")
            body = post.get("selftext", "")
            text = f"{title}. {body}".strip(". ") if len(body) > 20 else title
            text = text[:500]
            if len(text) > 20:
                results.append({
                    "text": text,
                    "src": "rd",
                    "url": f"https://www.reddit.com{post['permalink']}",
                    "author": post.get("author", ""),
                    "date": str(post.get("created_utc", "")),
                })
    except Exception as e:
        print(f"Reddit scrape error: {e}")
    return results[:limit]
