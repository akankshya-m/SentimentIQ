const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000"

export const api = {
  analyse: (keyword, sources) =>
    fetch(`${BASE}/api/analyse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword, sources }),
    }).then((r) => r.json()),

  streamUrl: (keyword, sources) =>
    `${BASE}/api/analyse/stream?keyword=${encodeURIComponent(keyword)}&sources=${sources.join(",")}`,

  history: () => fetch(`${BASE}/api/history`).then((r) => r.json()),
}
