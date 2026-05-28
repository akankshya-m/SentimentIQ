from collections import Counter

def aggregate(posts):
    total = len(posts)
    if not total:
        return {}
    pos = sum(1 for p in posts if p.get("sentiment") == "positive")
    neg = sum(1 for p in posts if p.get("sentiment") == "negative")
    neu = total - pos - neg
    score = round((pos - neg) / total, 3)

    by_src = {}
    for src in ["tw", "rd", "nw"]:
        sub = [p for p in posts if p.get("src") == src]
        if sub:
            by_src[src] = {
                "total": len(sub),
                "positive": sum(1 for p in sub if p.get("sentiment") == "positive"),
                "neutral": sum(1 for p in sub if p.get("sentiment") == "neutral"),
                "negative": sum(1 for p in sub if p.get("sentiment") == "negative"),
            }

    all_kp = [k for p in posts for k in p.get("kp", [])]
    top_phrases = [phrase for phrase, _ in Counter(all_kp).most_common(12)]

    return {
        "total": total, "positive": pos, "neutral": neu, "negative": neg,
        "score": score, "by_src": by_src, "top_phrases": top_phrases,
    }
