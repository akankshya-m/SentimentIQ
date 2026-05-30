const METRICS = [
  {
    key: "total",
    label: "TOTAL POSTS",
    color: "#3b82f6",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    key: "positive",
    label: "POSITIVE",
    color: "#10b981",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "neutral",
    label: "NEUTRAL",
    color: "#94a3b8",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "negative",
    label: "NEGATIVE",
    color: "#f43f5e",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function MetricCards({ summary }) {
  const total = summary.total || 0

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: "24px",
      padding: "0 40px 24px",
    }}>
      {METRICS.map(({ key, label, color, icon }) => {
        const value = summary[key] ?? 0
        const pct = key !== "total" && total ? (value / total) * 100 : null
        return (
          <div key={key} className="glass-card" style={{ padding: "24px" }}>
            <div style={{ color, marginBottom: "8px" }}>{icon}</div>
            <div style={{ fontSize: "48px", fontWeight: 700, letterSpacing: "-0.02em", color, lineHeight: 1 }}>
              {value}
            </div>
            <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", color: "#8e9199", marginTop: "4px", textTransform: "uppercase" }}>
              {label}
            </div>
            {pct !== null && (
              <div style={{ marginTop: "10px" }}>
                <div style={{ height: "4px", borderRadius: "9999px", background: "#293548", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "9999px", transition: "width 700ms ease" }} />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
