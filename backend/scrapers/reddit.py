import httpx
from typing import List, Dict

async def scrape(keyword: str, limit: int = 25) -> List[Dict]:
    params = {"q": keyword, "limit": limit}
    headers = {"User-Agent": "SentimentPOC/1.0"}
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
