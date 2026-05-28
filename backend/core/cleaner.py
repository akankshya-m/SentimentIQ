import re
from difflib import SequenceMatcher
from typing import List, Dict

def clean(posts: List[Dict]) -> List[Dict]:
    seen = []
    out = []
    for p in posts:
        text = p.get("text", "")
        text = re.sub(r"<[^>]+>", "", text)          # strip HTML
        text = re.sub(r"http\S+", "", text)           # strip URLs
        text = re.sub(r"@\w+", "", text)              # strip @mentions
        text = " ".join(text.split())                 # normalise whitespace
        if len(text) < 15:
            continue
        # near-duplicate check
        if any(SequenceMatcher(None, text, s).ratio() > 0.82 for s in seen):
            continue
        seen.append(text)
        p["text"] = text
        out.append(p)
    return out
