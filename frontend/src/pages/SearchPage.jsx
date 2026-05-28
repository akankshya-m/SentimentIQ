import { useState } from "react"
import PipelineLog from "../components/PipelineLog"

const QUICK_CHIPS = [
  "Jio 5G network",
  "Ola Electric scooter",
  "Tata Nexon EV",
  "CRED app",
  "OpenAI ChatGPT",
  "Samsung Galaxy S25",
]

const PLATFORMS = [
  { key: "rd", label: "Reddit", icon: "R" },
  { key: "nw", label: "News", icon: "N" },
]

export default function SearchPage({ onResult }) {
  const [keyword, setKeyword] = useState("")
  const [sources, setSources] = useState(["rd", "nw"])
  const [running, setRunning] = useState(false)

  function toggleSource(key) {
    setSources((prev) => {
      if (prev.includes(key)) {
        if (prev.length === 1) return prev // at least one required
        return prev.filter((s) => s !== key)
      }
      return [...prev, key]
    })
  }

  function handleAnalyse() {
    if (!keyword.trim() || sources.length === 0) return
    setRunning(true)
  }

  function handleComplete(results, summary) {
    onResult(keyword.trim(), sources, { posts: results, summary, keyword: keyword.trim() })
  }

  if (running) {
    return <PipelineLog keyword={keyword.trim()} sources={sources} onComplete={handleComplete} />
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top header */}
      <div className="bg-brand px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => { setKeyword(""); setSources(["rd", "nw"]) }}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg">Sentiment Intelligence</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl">
          {/* Search input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyse()}
              placeholder="Enter a keyword or topic…"
              className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-base"
            />
            <button
              onClick={handleAnalyse}
              disabled={!keyword.trim()}
              className="px-6 py-3 bg-brand text-white rounded-xl font-medium text-base hover:bg-brand-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Analyse
            </button>
          </div>

          {/* Platform toggles */}
          <div className="flex gap-2 mb-6">
            {PLATFORMS.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => toggleSource(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  sources.includes(key)
                    ? "bg-brand border-brand text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:border-brand/50"
                }`}
              >
                <span className="font-mono text-xs">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Quick searches */}
          <div>
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-medium">Quick searches</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setKeyword(chip)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm hover:bg-brand-100 hover:text-brand transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
