export default function ExportButton({ posts, keyword }) {
  function handleExport() {
    const headers = ["keyword", "platform", "sentiment", "confidence", "reason", "key_phrases", "text"]
    const rows = posts.map((p) => [
      keyword,
      p.src,
      p.sentiment,
      p.confidence,
      `"${(p.reason || "").replace(/"/g, '""')}"`,
      `"${(p.kp || []).join("; ").replace(/"/g, '""')}"`,
      `"${(p.text || "").replace(/"/g, '""')}"`,
    ])
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    const date = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `sentiment_${keyword.replace(/\s+/g, "_")}_${date}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:border-brand/50 hover:text-brand transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export CSV
    </button>
  )
}
