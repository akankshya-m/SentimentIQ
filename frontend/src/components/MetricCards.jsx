const CARDS = [
  { key: "total", label: "Total Posts", color: "text-brand", bg: "bg-brand-50" },
  { key: "positive", label: "Positive", color: "text-green-700", bg: "bg-green-50" },
  { key: "neutral", label: "Neutral", color: "text-slate-600", bg: "bg-slate-50" },
  { key: "negative", label: "Negative", color: "text-red-700", bg: "bg-red-50" },
]

export default function MetricCards({ summary }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {CARDS.map(({ key, label, color, bg }) => (
        <div key={key} className={`${bg} rounded-xl p-4 border border-slate-200`}>
          <div className={`text-3xl font-bold font-mono ${color}`}>
            {summary[key] ?? 0}
          </div>
          <div className="text-sm text-slate-500 mt-1">{label}</div>
        </div>
      ))}
    </div>
  )
}
