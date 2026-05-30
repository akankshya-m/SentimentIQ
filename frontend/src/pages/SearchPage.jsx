import { useState } from "react"
import PipelineLog from "../components/PipelineLog"

const QUICK_CHIPS = ["Jio 5G", "Ola Electric", "ChatGPT", "Tata Nexon EV", "iPhone 16"]

const SOURCE_OPTIONS = [
  { key: "rd", label: "Reddit" },
  { key: "nw", label: "News" },
]

const COMING_SOON_SOURCES = [
  { key: "tw", label: "Twitter" },
  { key: "fb", label: "Facebook" },
  { key: "li", label: "LinkedIn" },
]

const PAGE_BG = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f172a 0%, #0d1b35 50%, #0f172a 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px 16px",
}

export default function SearchPage({ onResult }) {
  const [keyword, setKeyword]   = useState("")
  const [sources, setSources]   = useState(["rd", "nw"])
  const [running, setRunning]   = useState(false)

  function toggleSource(key) {
    setSources((prev) =>
      prev.includes(key)
        ? prev.length > 1 ? prev.filter((s) => s !== key) : prev
        : [...prev, key]
    )
  }

  function handleAnalyse() {
    if (!keyword.trim() || sources.length === 0) return
    setRunning(true)
  }

  function handleComplete(results, summary) {
    onResult(keyword.trim(), sources, { posts: results, summary, keyword: keyword.trim() })
  }

  if (running) {
    return (
      <PipelineLog
        keyword={keyword.trim()}
        sources={sources}
        onComplete={handleComplete}
      />
    )
  }

  return (
    <div style={PAGE_BG}>
      <div style={{ width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column", gap: "32px" }}>

        {/* Headline */}
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "48px", fontWeight: 700, letterSpacing: "-0.02em", color: "#e3e2e6", margin: 0, lineHeight: 1.1 }}>
            Sentiment Intelligence
          </h1>
        </div>

        {/* Search card */}
        <div className="glass-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>

          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyse()}
            placeholder="Enter a keyword or topic…"
            style={{
              width: "100%", height: "48px", borderRadius: "8px",
              background: "rgba(15,23,42,0.8)", border: "1px solid #334155",
              color: "#e3e2e6", fontSize: "16px", padding: "0 16px",
              outline: "none", fontFamily: "Inter, sans-serif",
              transition: "border-color 200ms ease, box-shadow 200ms ease",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)" }}
            onBlur={(e)  => { e.target.style.borderColor = "#334155";  e.target.style.boxShadow = "none" }}
          />

          {/* Source chips */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#8e9199", letterSpacing: "0.05em", flexShrink: 0 }}>SOURCES:</span>
            {SOURCE_OPTIONS.map(({ key, label }) => {
              const active = sources.includes(key)
              return (
                <button
                  key={key}
                  onClick={() => toggleSource(key)}
                  style={{
                    padding: "4px 14px", borderRadius: "9999px", fontSize: "13px", fontWeight: 600,
                    background: active ? "rgba(59,130,246,0.2)" : "rgba(30,41,59,0.6)",
                    border: `1px solid ${active ? "#3b82f6" : "#334155"}`,
                    color: active ? "#adc8f5" : "#8e9199",
                    cursor: "pointer", transition: "all 200ms ease",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {label}
                </button>
              )
            })}
            {COMING_SOON_SOURCES.map(({ key, label }) => (
              <button
                key={key}
                disabled
                title="Coming soon"
                style={{
                  padding: "4px 14px", borderRadius: "9999px", fontSize: "13px", fontWeight: 600,
                  background: "rgba(15,23,42,0.4)",
                  border: "1px dashed #2d3748",
                  color: "#4a5568",
                  cursor: "not-allowed",
                  fontFamily: "Inter, sans-serif",
                  opacity: 0.55,
                }}
              >
                {label}
                <span style={{ fontSize: "9px", marginLeft: "5px", verticalAlign: "middle", fontWeight: 500, letterSpacing: "0.03em" }}>soon</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleAnalyse}
            disabled={!keyword.trim()}
            style={{
              width: "100%", height: "44px", borderRadius: "8px", border: "none",
              background: keyword.trim() ? "linear-gradient(135deg, #1e3a5f, #3b82f6)" : "rgba(59,130,246,0.3)",
              color: "white", fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em",
              textTransform: "uppercase", cursor: keyword.trim() ? "pointer" : "not-allowed",
              opacity: keyword.trim() ? 1 : 0.5,
              transition: "opacity 200ms ease",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Analyse
          </button>
        </div>

        {/* Quick chips */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11px", fontWeight: 500, color: "#8e9199", letterSpacing: "0.05em" }}>TRY:</span>
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setKeyword(chip)}
              style={{
                padding: "4px 12px", borderRadius: "9999px", fontSize: "14px",
                background: "rgba(30,41,59,0.6)", border: "1px solid #334155",
                color: "#c4c6cf", cursor: "pointer", transition: "all 200ms ease",
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.color = "#3b82f6" }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.color = "#c4c6cf" }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* How it works */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
          {HOW_STEPS.map((step, i) => (
            <div key={step.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div className="glass-card" style={{ padding: "16px", textAlign: "center", minWidth: "120px" }}>
                <div style={{ color: "#3b82f6", marginBottom: "6px", display: "flex", justifyContent: "center" }}>{step.icon}</div>
                <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", color: "#e3e2e6", textTransform: "uppercase" }}>{step.label}</div>
                <div style={{ fontSize: "11px", color: "#8e9199", marginTop: "2px" }}>{step.desc}</div>
              </div>
              {i < HOW_STEPS.length - 1 && (
                <span style={{ color: "#334155", fontSize: "18px", fontWeight: 300 }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const HOW_STEPS = [
  {
    label: "SCRAPE",
    desc: "Reddit & Google News",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
  {
    label: "CLEAN",
    desc: "Dedup & normalize",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
      </svg>
    ),
  },
  {
    label: "AI CLASSIFY",
    desc: "LLM sentiment scoring",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
]
