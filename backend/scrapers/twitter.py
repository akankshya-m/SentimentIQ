import asyncio
from typing import List, Dict

async def scrape(keyword: str, limit: int = 25) -> List[Dict]:
    loop = asyncio.get_event_loop()

    def _scrape():
        results = []

        # Primary: ntscraper (uses Nitter, no API key)
        try:
            from ntscraper import Nitter
            scraper = Nitter(log_level=0)
            data = scraper.get_tweets(keyword, mode="term", number=limit)
            for t in data.get("tweets", []):
                text = t.get("text", "").strip()
                if text and len(text) > 10:
                    results.append({
                        "text": text,
                        "src": "tw",
                        "url": t.get("link", ""),
                        "author": t.get("user", {}).get("username", ""),
                        "date": t.get("date", ""),
                    })
            if results:
                return results[:limit]
        except Exception:
            pass

        # Fallback: snscrape
        try:
            import snscrape.modules.twitter as sntwitter
            for i, tweet in enumerate(sntwitter.TwitterSearchScraper(keyword).get_items()):
                if i >= limit:
                    break
                results.append({
                    "text": tweet.rawContent,
                    "src": "tw",
                    "url": tweet.url,
                    "author": tweet.user.username,
                    "date": str(tweet.date),
                })
        except Exception:
            pass

        return results

    return await loop.run_in_executor(None, _scrape)
