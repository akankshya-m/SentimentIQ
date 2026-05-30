import { useState } from "react"
import SummaryStrip from "../components/SummaryStrip"
import MetricCards from "../components/MetricCards"
import FilterTabs from "../components/FilterTabs"
import PostFeed from "../components/PostFeed"
import ExportButton from "../components/ExportButton"

const SENTIMENT_COLOR = {
  positive: "#10b981",
  negative: "#f43f5e",
  neutral: "#94a3b8",
}

function getSentimentLabel(score) {
  if (score >= 0.2) return "Positive"
  if (score <= -0.2) return "Negative"
  return "Neutral"
}

export default function ResultsPage({ result, keyword, sources, onBack }) {
  const [activeFilter, setActiveFilter] = useState("all")
  const { posts = [], summary = {} } = result

  const filteredPosts = posts.filter((p) => {
    if (activeFilter === "all") return true
    if (["positive", "neutral", "negative"].includes(activeFilter)) return p.sentiment === activeFilter
    return p.src === activeFilter
  })

  const score = summary.score ?? 0
  const sentLabel = getSentimentLabel(score)
  const sentColor = SENTIMENT_COLOR[sentLabel.toLowerCase()] || SENTIMENT_COLOR.neutral

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #0d1b35 50%, #0f172a 100%)" }}>
      {/* Sticky top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20, height: "56px",
        background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #334155",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", gap: "16px",
      }}>
        {/* Left: back */}
        <button
          onClick={onBack}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "6px 14px", borderRadius: "8px", border: "1px solid #334155",
            background: "transparent", color: "#c4c6cf", fontSize: "14px",
            cursor: "pointer", transition: "all 200ms ease", fontFamily: "Inter, sans-serif",
            whiteSpace: "nowrap", flexShrink: 0,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.color = "#3b82f6" }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.color = "#c4c6cf" }}
        >
          ← New Search
        </button>

        {/* Center: keyword + sentiment pill + score */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, justifyContent: "center", overflow: "hidden" }}>
          <span style={{ fontSize: "20px", fontWeight: 500, color: "#e3e2e6", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {keyword}
          </span>
          <span style={{
            padding: "2px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600,
            background: `${sentColor}1a`, border: `1px solid ${sentColor}`, color: sentColor, flexShrink: 0,
          }}>
            {sentLabel}
          </span>
          <span style={{ fontSize: "14px", color: "#c4c6cf", flexShrink: 0 }}>
            {score >= 0 ? "+" : ""}{score.toFixed(2)}
          </span>
        </div>

        {/* Right: export */}
        <div style={{ flexShrink: 0 }}>
          <ExportButton posts={posts} keyword={keyword} summary={summary} />
        </div>
      </div>

      {/* Summary bar */}
      <div style={{ paddingTop: "24px" }}>
        <SummaryStrip summary={summary} />
      </div>

      {/* Metric cards */}
      <MetricCards summary={summary} />

      {/* Top phrases */}
      {summary.top_phrases && summary.top_phrases.length > 0 && (
        <div style={{ padding: "0 40px 24px" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", color: "#8e9199", textTransform: "uppercase", marginBottom: "10px" }}>
            TOP PHRASES
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {summary.top_phrases.map((phrase, i) => (
              <span key={i} style={{
                padding: "4px 12px", borderRadius: "9999px", fontSize: "14px",
                background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
                color: "#adc8f5",
              }}>
                {phrase}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <FilterTabs active={activeFilter} onChange={setActiveFilter} sources={sources} posts={posts} />

      {/* Post feed */}
      <div style={{ padding: "24px 40px" }}>
        <PostFeed posts={filteredPosts} />
      </div>
    </div>
  )
}
