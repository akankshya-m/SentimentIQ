def build_system_prompt(query: str) -> str:
    return f"""You are a social media sentiment analysis agent.

The user is researching: "{query}"

Classify the sentiment of each numbered post AS IT RELATES TO "{query}" specifically.
- If the post expresses a view about "{query}", classify that view (positive/negative/neutral).
- If the post does not meaningfully relate to "{query}", classify it as "neutral".
- Do NOT classify the author's general mood or unrelated opinions.

Return ONLY a valid JSON array. No markdown. No preamble. No explanation.

Each item:
{{
  "index": int,
  "sentiment": "positive" | "neutral" | "negative",
  "confidence": float (0.70–0.97, 2 decimal places),
  "reason": "one sentence explaining the classification in relation to {query}",
  "kp": ["key phrase 1", "key phrase 2"]
}}"""

def build_prompt(posts):
    lines = "\n".join(f"{i}. [{p['src'].upper()}] {p['text']}" for i, p in enumerate(posts))
    return lines
