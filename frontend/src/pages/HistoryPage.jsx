import { useState } from "react"

const PAGE_BG = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f172a 0%, #0d1b35 50%, #0f172a 100%)",
  paddingBottom: "32px",
}

function scoreColor(score) {
  if (score > 0.2) return "#10b981"
  if (score < -0.2) return "#f43f5e"
  return "#94a3b8"
}

function scoreTrend(score) {
  if (score > 0.2) return "↑"
  if (score < -0.2) return "↘"
  return "→"
}

function formatDate(iso) {
  if (!iso) return ""
  const d = new Date(iso.endsWith("Z") ? iso : iso + "Z")
  const date = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })
  return `${date} • ${time}`
}

const PAGE_SIZE = 10

export default function HistoryPage({ history = [], onViewRun }) {
  const [filter, setFilter] = useState("")
  const [shown, setShown] = useState(PAGE_SIZE)

  const filtered = history.filter((r) =>
    r.keyword.toLowerCase().includes(filter.toLowerCase())
  )
  const visible = filtered.slice(0, shown)

  return (
    <div style={PAGE_BG}>
      {/* Title */}
      <div className="page-gutter" style={{ paddingTop: "40px", paddingBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 600, letterSpacing: "-0.01em", color: "#e3e2e6", margin: 0 }}>
          Search History
        </h1>
      </div>

      {/* Search + filter row */}
      <div className="page-gutter" style={{ paddingBottom: "16px", display: "flex", gap: "8px", alignItems: "center" }}>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by keyword…"
          style={{
            flex: 1, height: "44px", borderRadius: "8px",
            background: "rgba(15,23,42,0.8)", border: "1px solid #334155",
            color: "#e3e2e6", fontSize: "14px", padding: "0 16px",
            outline: "none", fontFamily: "Inter, sans-serif",
            transition: "border-color 200ms ease, box-shadow 200ms ease",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)" }}
          onBlur={(e) => { e.target.style.borderColor = "#334155"; e.target.style.boxShadow = "none" }}
        />
        <button style={{
          width: "44px", height: "44px", borderRadius: "8px", flexShrink: 0,
          border: "1px solid #334155", background: "transparent", color: "#8e9199",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}>
          <FilterIcon />
        </button>
      </div>

      {/* Cards */}
      <div className="page-gutter history-grid" style={{ alignItems: "start" }}>
        {visible.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", fontSize: "16px", color: "#8e9199" }}>
            {filter ? "No history matches this filter." : "No searches yet."}
          </div>
        ) : (
          visible.map((run) => {
            const color = scoreColor(run.score)
            const trend = scoreTrend(run.score)
            const scorePct = `${run.score >= 0 ? "+" : ""}${Math.round(run.score * 100)}%`
            return (
              <div key={run.id} className="glass-card" style={{ padding: "16px" }}>
                {/* Top row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "20px", fontWeight: 500, color: "#e3e2e6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {run.keyword}
                  </span>
                  <span style={{
                    padding: "3px 12px", borderRadius: "9999px", fontSize: "13px", fontWeight: 600,
                    background: `${color}1a`, border: `1px solid ${color}`, color, flexShrink: 0,
                  }}>
                    {scorePct} {trend}
                  </span>
                </div>

                {/* Meta row */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "14px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#8e9199", letterSpacing: "0.05em" }}>
                    <CalendarIcon /> {formatDate(run.created_at)}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#8e9199", letterSpacing: "0.05em" }}>
                    <CloudIcon /> {run.post_count} Sources
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#8e9199", letterSpacing: "0.05em" }}>
                    Standard Scan
                  </span>
                </div>

                {/* CTA */}
                <button
                  onClick={() => onViewRun(run)}
                  style={{
                    width: "100%", height: "40px", borderRadius: "8px",
                    background: "rgba(59,130,246,0.15)", border: "1px solid #334155",
                    color: "#adc8f5", fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em",
                    cursor: "pointer", transition: "all 200ms ease", fontFamily: "Inter, sans-serif",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(59,130,246,0.25)"; e.currentTarget.style.borderColor = "#3b82f6" }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(59,130,246,0.15)"; e.currentTarget.style.borderColor = "#334155" }}
                >
                  View Report →
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Load more */}
      {filtered.length > shown && (
        <div className="page-gutter" style={{ paddingTop: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => setShown((s) => s + PAGE_SIZE)}
            style={{
              width: "100%", height: "44px", borderRadius: "8px",
              border: "1px solid #334155", background: "transparent",
              color: "#c4c6cf", fontSize: "14px", cursor: "pointer",
              transition: "all 200ms ease", fontFamily: "Inter, sans-serif",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.color = "#3b82f6" }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.color = "#c4c6cf" }}
          >
            ⊕ Load More Searches
          </button>
          <span style={{ fontSize: "11px", fontWeight: 500, color: "#8e9199" }}>
            Showing {shown} of {filtered.length} searches
          </span>
        </div>
      )}
    </div>
  )
}

function FilterIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function CloudIcon() {
  return (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  )
}
