const SENTIMENT_COLOR = {
  positive: "#10b981",
  negative: "#f43f5e",
  neutral: "#94a3b8",
}

const SRC_LABEL = { rd: "RD", nw: "NW" }

export default function PostCard({ post }) {
  const color = SENTIMENT_COLOR[post.sentiment] || SENTIMENT_COLOR.neutral
  const label = post.sentiment ? post.sentiment.charAt(0).toUpperCase() + post.sentiment.slice(1) : "Neutral"
  const conf = post.confidence ? `${Math.round(post.confidence * 100)}%` : null
  const src = SRC_LABEL[post.src] || post.src?.toUpperCase()

  function handleClick() {
    if (post.url) window.open(post.url, "_blank", "noopener,noreferrer")
  }

  return (
    <div
      onClick={handleClick}
      style={{
        display: "flex",
        background: "rgba(30,41,59,0.8)", backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid #334155", borderRadius: "12px",
        borderLeft: `4px solid ${color}`,
        padding: "16px", gap: "12px",
        cursor: post.url ? "pointer" : "default",
        transition: "border-color 200ms ease, background 200ms ease",
      }}
      onMouseEnter={(e) => { if (post.url) e.currentTarget.style.borderColor = "#4a6080" }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#334155" }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            {/* Source badge */}
            <span style={{
              padding: "2px 8px", borderRadius: "9999px", fontSize: "11px", fontWeight: 600,
              background: "#1e3a5f", color: "#adc8f5", border: "1px solid #3b82f6",
            }}>{src}</span>
            {post.author && (
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#8e9199", letterSpacing: "0.05em" }}>
                {post.author}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            {conf && (
              <span style={{ fontSize: "12px", fontWeight: 600, color, letterSpacing: "0.05em" }}>{conf}</span>
            )}
            {/* Sentiment pill */}
            <span style={{
              padding: "2px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600,
              background: `${color}1a`, border: `1px solid ${color}`,
              color, flexShrink: 0,
            }}>{label}</span>
          </div>
        </div>

        {/* Post text */}
        <p style={{
          fontSize: "14px", color: "#c4c6cf", lineHeight: 1.6, margin: "0 0 8px",
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {post.text}
        </p>

        {/* Reason */}
        {post.reason && (
          <p style={{ fontSize: "14px", color: "#8e9199", fontStyle: "italic", margin: "0 0 10px" }}>
            💡 {post.reason}
          </p>
        )}

        {/* Key phrases */}
        {post.kp && post.kp.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {post.kp.map((phrase, i) => (
              <span key={i} style={{
                padding: "2px 10px", borderRadius: "9999px", fontSize: "12px",
                background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
                color: "#adc8f5",
              }}>
                {phrase}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
