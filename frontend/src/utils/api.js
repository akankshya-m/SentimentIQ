const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000"

export const api = {
  analyse: (keyword, sources) =>
    fetch(`${BASE}/api/analyse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword, sources }),
    }).then((r) => r.json()),

  streamUrl: (keyword, sources, dateRange = "all") =>
    `${BASE}/api/analyse/stream?keyword=${encodeURIComponent(keyword)}&sources=${sources.join(",")}&date_range=${dateRange}`,

  history: () => fetch(`${BASE}/api/history`).then((r) => r.json()),

  login: (email, password) =>
    fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then(async (r) => {
      if (!r.ok) throw new Error((await r.json()).detail || "Login failed")
      return r.json()
    }),
}
