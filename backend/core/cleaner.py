import re
from difflib import SequenceMatcher
from typing import List, Dict, Optional

_STOP_WORDS = {
    "a", "an", "the", "in", "of", "is", "it", "to", "and", "or", "for",
    "on", "at", "by", "as", "be", "was", "are", "with", "that", "this",
    "from", "have", "has", "had", "not", "but", "can", "all", "we", "i",
    "my", "me", "he", "she", "they", "its", "our", "your",
}

def _keyword_tokens(keyword: str) -> List[str]:
    return [w.lower() for w in re.split(r"\W+", keyword) if w and w.lower() not in _STOP_WORDS]

def _is_relevant(text: str, tokens: List[str]) -> bool:
    if not tokens:
        return True
    lower = text.lower()
    return any(tok in lower for tok in tokens)

def clean(posts: List[Dict], keyword: Optional[str] = None) -> List[Dict]:
    tokens = _keyword_tokens(keyword) if keyword else []
    seen = []
    out = []
    for p in posts:
        text = p.get("text", "")
        text = re.sub(r"<[^>]+>", "", text)
        text = re.sub(r"http\S+", "", text)
        text = re.sub(r"@\w+", "", text)
        text = " ".join(text.split())
        if len(text) < 15:
            continue
        if tokens and not _is_relevant(text, tokens):
            continue
        if any(SequenceMatcher(None, text, s).ratio() > 0.82 for s in seen):
            continue
        seen.append(text)
        p["text"] = text
        out.append(p)
    return out
