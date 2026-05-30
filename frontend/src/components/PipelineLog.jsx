import { useEffect, useState } from "react"
import { api } from "../utils/api"

const STEPS = [
  { key: "scrape", label: "Scraping Sources", desc: "Fetching posts from Reddit & News" },
  { key: "clean", label: "Cleaning & Deduplication", desc: "Removing noise and near-duplicates" },
  { key: "classify", label: "AI Sentiment Classification", desc: "LLM scoring each post" },
  { key: "aggregate", label: "Building Report", desc: "Aggregating results and phrases" },
]

const PAGE_BG = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f172a 0%, #0d1b35 50%, #0f172a 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px 16px 80px",
}

export default function PipelineLog({ keyword, sources, dateRange = "all", onComplete }) {
  const [stepStates, setStepStates] = useState({
    scrape: { state: "pending", msg: "", count: undefined },
    clean: { state: "pending", msg: "", count: undefined },
    classify: { state: "pending", msg: "", count: undefined },
    aggregate: { state: "pending", msg: "", count: undefined },
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    const url = api.streamUrl(keyword, sources, dateRange)
    const es = new EventSource(url)

    es.onmessage = (e) => {
      if (e.data === "[DONE]") { es.close(); return }
      try {
        const event = JSON.parse(e.data)
        setStepStates((prev) => ({
          ...prev,
          [event.step]: {
            state: event.status === "done" ? "done" : "running",
            msg: event.msg,
            count: event.count,
          },
        }))
        if (event.step === "aggregate" && event.status === "done") {
          es.close()
          onComplete(event.results, event.summary)
        }
      } catch (_) {}
    }

    es.onerror = () => { es.close(); setError("Connection lost. Please try again.") }
    return () => es.close()
  }, [])

  return (
    <div style={PAGE_BG}>
      <div className="glass-card-elevated" style={{ width: "100%", maxWidth: "480px", padding: "32px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <span style={{
            width: "10px", height: "10px", borderRadius: "9999px", background: "#3b82f6", flexShrink: 0,
            animation: "pulse-dot 1s ease-in-out infinite",
          }} />
          <h2 style={{ fontSize: "20px", fontWeight: 500, color: "#e3e2e6", margin: 0 }}>
            Analysing <span style={{ color: "#3b82f6" }}>"{keyword}"</span>…
          </h2>
        </div>

        {error ? (
          <div style={{
            background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.4)",
            borderRadius: "8px", padding: "16px", color: "#f43f5e", fontSize: "14px",
          }}>
            {error}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {STEPS.map((step, idx) => {
              const { state, msg, count } = stepStates[step.key]
              const isLast = idx === STEPS.length - 1
              return (
                <div key={step.key}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                    {/* Step badge */}
                    <div style={{ flexShrink: 0, position: "relative" }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "9999px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "12px", fontWeight: 600, transition: "all 200ms ease",
                        ...stepBadgeStyle(state),
                      }}>
                        {state === "done" ? "✓" : state === "running" ? (
                          <span style={{
                            width: "14px", height: "14px", borderRadius: "9999px",
                            border: "2px solid #3b82f6", borderTopColor: "transparent",
                            display: "inline-block",
                            animation: "step-spin 1s linear infinite",
                          }} />
                        ) : idx + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, paddingBottom: isLast ? 0 : "24px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                        <span style={{ fontSize: "16px", fontWeight: 400, color: state === "pending" ? "#8e9199" : "#e3e2e6" }}>
                          {step.label}
                        </span>
                        {count !== undefined && state === "done" && (
                          <span style={{
                            padding: "2px 10px", borderRadius: "9999px",
                            background: "rgba(59,130,246,0.15)", color: "#3b82f6",
                            fontSize: "12px", fontWeight: 600, flexShrink: 0,
                          }}>
                            {count}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "14px", color: "#8e9199", marginTop: "2px" }}>
                        {msg || step.desc}
                      </div>
                    </div>
                  </div>

                  {/* Connector line */}
                  {!isLast && (
                    <div style={{ marginLeft: "15px", width: "1px", height: "16px", background: "#334155" }} />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function stepBadgeStyle(state) {
  if (state === "done") return {
    background: "rgba(16,185,129,0.2)", color: "#10b981", border: "1px solid #10b981",
  }
  if (state === "running") return {
    background: "rgba(59,130,246,0.2)", color: "#3b82f6", border: "1px solid #3b82f6",
  }
  return {
    background: "#293548", color: "#8e9199", border: "1px solid #334155",
  }
}
