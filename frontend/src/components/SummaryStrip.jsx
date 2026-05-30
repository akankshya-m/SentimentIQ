function getScoreLabel(score) {
  if (score >= 0.5) return "Strongly Positive"
  if (score >= 0.3) return "Mostly Positive"
  if (score >= 0.1) return "Leaning Positive"
  if (score > -0.1) return "Mixed"
  if (score > -0.3) return "Leaning Negative"
  if (score > -0.5) return "Mostly Negative"
  return "Strongly Negative"
}

function getScoreColor(score) {
  if (score >= 0.2) return "#10b981"
  if (score <= -0.2) return "#f43f5e"
  return "#94a3b8"
}

export default function SummaryStrip({ summary }) {

  const { score = 0 } = summary
  const markerPct = ((score + 1) / 2) * 100
  const color = getScoreColor(score)
  const label = getScoreLabel(score)
  const scoreDisplay = (score >= 0 ? "+" : "") + score.toFixed(2)

  return (
    <div style={{ padding: "0 40px 24px" }}>
      <div style={{ position: "relative", marginBottom: "12px" }}>
        {/* Gradient bar */}
        <div style={{
          height: "8px", borderRadius: "9999px",
          background: "linear-gradient(to right, #f43f5e 0%, #94a3b8 50%, #10b981 100%)",
        }} />
        {/* Marker */}
        <div style={{
          position: "absolute", top: "50%", transform: "translate(-50%, -50%)",
          left: `${markerPct}%`,
          width: "12px", height: "12px", borderRadius: "9999px",
          background: "white", boxShadow: "0 0 0 3px rgba(255,255,255,0.3)",
          transition: "left 700ms ease",
        }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "14px", fontWeight: 600, color, fontFamily: "monospace" }}>{scoreDisplay}</span>
        <span style={{ fontSize: "14px", color: "#c4c6cf" }}>{label}</span>
      </div>
    </div>
  )
}
