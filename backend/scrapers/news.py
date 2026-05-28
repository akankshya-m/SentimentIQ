import asyncio, urllib.parse
from typing import List, Dict

async def scrape(keyword: str, limit: int = 20) -> List[Dict]:
    loop = asyncio.get_event_loop()

    def _scrape():
        results = []
        try:
            import feedparser, trafilatura
            encoded = urllib.parse.quote(keyword)
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
