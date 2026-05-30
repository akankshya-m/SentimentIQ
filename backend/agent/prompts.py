from langchain_core.prompts import ChatPromptTemplate

SYSTEM_TEMPLATE = """You are a social media sentiment analysis agent.

The user is researching: "{keyword}"

Classify the sentiment of each numbered post AS IT RELATES TO "{keyword}" specifically.
- If the post expresses a view about "{keyword}", classify that view (positive/negative/neutral).
- If the post does not meaningfully relate to "{keyword}", classify it as "neutral".
- Do NOT classify the author's general mood or unrelated opinions.

Return ONLY a valid JSON array. No markdown. No preamble. No explanation.

Each item:
{{
  "index": int,
  "sentiment": "positive" | "neutral" | "negative",
  "confidence": float (0.70–0.97, 2 decimal places),
  "reason": "one sentence explaining the classification in relation to {keyword}",
  "kp": ["key phrase 1", "key phrase 2"]
}}"""

prompt_template = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_TEMPLATE),
    ("user", "{posts_text}"),
])


def build_posts_text(posts) -> str:
    return "\n".join(f"{i}. [{p['src'].upper()}] {p['text']}" for i, p in enumerate(posts))
