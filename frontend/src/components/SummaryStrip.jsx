import { useEffect, useState } from "react"

function getScoreLabel(score) {
  if (score >= 0.5) return "Strongly positive"
  if (score >= 0.3) return "Mostly positive"
  if (score >= 0.1) return "Leaning positive"
  if (score > -0.1) return "Mixed"
  if (score > -0.3) return "Leaning negative"
  if (score > -0.5) return "Mostly negative"
  return "Strongly negative"
}

function getScoreColor(score) {
  if (score >= 0.3) return "#16a34a"
  if (score <= -0.3) return "#dc2626"
  return "#64748b"
}

export default function SummaryStrip({ summary }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  const { total = 0, positive = 0, neutral = 0, negative = 0, score = 0 } = summary

  const posW = total ? (positive / total) * 100 : 0
  const neuW = total ? (neutral / total) * 100 : 0
  const negW = total ? (negative / total) * 100 : 0

  const scoreColor = getScoreColor(score)
  const scoreLabel = getScoreLabel(score)
  const scoreDisplay = score >= 0 ? `+${score.toFixed(2)}` : score.toFixed(2)

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center">
      {/* Score circle */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center"
          style={{ borderColor: scoreColor }}>
          <span className="text-xl font-bold font-mono" style={{ color: scoreColor }}>
            {scoreDisplay}
          </span>
        </div>
        <span className="text-sm font-medium text-slate-600">{scoreLabel}</span>
      </div>

      {/* Bar + legend */}
      <div className="flex-1 w-full">
        <div className="h-4 rounded-full overflow-hidden flex bg-slate-100">
          <div
            className="h-full bg-green-500 transition-all duration-700 ease-out"
            style={{ width: animated ? `${posW}%` : "0%" }}
          />
          <div
            className="h-full bg-slate-300 transition-all duration-700 ease-out delay-100"
            style={{ width: animated ? `${neuW}%` : "0%" }}
          />
          <div
            className="h-full bg-red-500 transition-all duration-700 ease-out delay-200"
            style={{ width: animated ? `${negW}%` : "0%" }}
          />
        </div>
        <div className="mt-3 flex gap-6 text-sm">
          <span className="flex items-center gap-1.5 text-green-700">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            Positive <span className="font-mono font-semibold">{posW.toFixed(0)}%</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            Neutral <span className="font-mono font-semibold">{neuW.toFixed(0)}%</span>
          </span>
          <span className="flex items-center gap-1.5 text-red-700">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            Negative <span className="font-mono font-semibold">{negW.toFixed(0)}%</span>
          </span>
        </div>
      </div>
    </div>
  )
}
