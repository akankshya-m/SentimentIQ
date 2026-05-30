const SRC_LABELS = { rd: "Reddit", nw: "News" }

const SENTIMENT_TABS = ["all", "positive", "neutral", "negative"]

export default function FilterTabs({ active, onChange, sources, posts = [] }) {
  const srcTabs = sources.filter((s) => ["rd", "nw"].includes(s))

  const tabs = [
    ...SENTIMENT_TABS.map((t) => ({
      key: t,
      label: t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1),
      count: t === "all" ? posts.length : posts.filter((p) => p.sentiment === t).length,
    })),
    ...srcTabs.map((s) => ({
      key: s,
      label: SRC_LABELS[s] || s,
      count: posts.filter((p) => p.src === s).length,
    })),
  ]

  return (
    <div style={{
      position: "sticky", top: "56px", zIndex: 10,
      background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid #334155",
      padding: "12px 40px",
      display: "flex", gap: "8px", flexWrap: "wrap",
    }}>
      {tabs.map(({ key, label, count }) => {
        const isActive = active === key
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "6px 14px", borderRadius: "9999px", fontSize: "14px", fontWeight: 500,
              border: isActive ? "1px solid #3b82f6" : "1px solid transparent",
              background: isActive ? "rgba(59,130,246,0.2)" : "transparent",
              color: isActive ? "#3b82f6" : "#8e9199",
              cursor: "pointer", transition: "all 200ms ease",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {label}
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#8e9199" }}>{count}</span>
          </button>
        )
      })}
    </div>
  )
}
