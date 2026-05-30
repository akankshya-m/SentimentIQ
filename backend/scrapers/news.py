import asyncio, urllib.parse
from datetime import datetime, timedelta, timezone
from typing import List, Dict

DATE_OFFSETS = {
    "today":         0,
    "yesterday":     1,
    "last_week":     7,
    "last_month":    30,
    "last_3_months": 90,
    "last_6_months": 180,
}

def _build_query(keyword: str, date_range: str) -> str:
    if date_range not in DATE_OFFSETS:
        return keyword
    days = DATE_OFFSETS[date_range]
    now = datetime.now(timezone.utc)
    after = (now - timedelta(days=days)).strftime("%Y-%m-%d")
    if date_range == "yesterday":
        before = now.strftime("%Y-%m-%d")
        return f"{keyword} after:{after} before:{before}"
    return f"{keyword} after:{after}"

async def scrape(keyword: str, limit: int = 20, date_range: str = "all") -> List[Dict]:
    loop = asyncio.get_event_loop()
    query = _build_query(keyword, date_range)

    def _scrape():
        results = []
        try:
            import feedparser, trafilatura
            encoded = urllib.parse.quote(query)
            url = f"https://news.google.com/rss/search?q={encoded}&hl=en-IN&gl=IN&ceid=IN:en"
            feed = feedparser.parse(url)
            for entry in feed.entries[:limit]:
                title = entry.get("title", "")
                link = entry.get("link", "")
                try:
                    downloaded = trafilatura.fetch_url(link)
                    text = trafilatura.extract(downloaded, include_comments=False)
                    snippet = (text or title)[:400]
                except Exception:
                    snippet = title
                if snippet and len(snippet) > 15:
                    results.append({
                        "text": snippet,
                        "src": "nw",
                        "url": link,
                        "author": entry.get("source", {}).get("title", "News"),
                        "date": entry.get("published", ""),
                    })
        except Exception as e:
            print(f"News scrape error: {e}")
        return results

    return await loop.run_in_executor(None, _scrape)
