import { useState } from "react"
import SummaryStrip from "../components/SummaryStrip"
import MetricCards from "../components/MetricCards"
import FilterTabs from "../components/FilterTabs"
import PostFeed from "../components/PostFeed"
import ExportButton from "../components/ExportButton"

const SRC_LABELS = { rd: "Reddit", nw: "News" }

export default function ResultsPage({ result, keyword, sources, onBack }) {
  const [activeFilter, setActiveFilter] = useState("all")
  const { posts = [], summary = {} } = result

  const filteredPosts = posts.filter((p) => {
    if (activeFilter === "all") return true
    if (["positive", "neutral", "negative"].includes(activeFilter)) return p.sentiment === activeFilter
    return p.src === activeFilter
  })

  const platformNames = sources.map((s) => SRC_LABELS[s] || s).join(", ")
  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-brand px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg">Sentiment Intelligence</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {/* Title row */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              "{keyword}"
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {posts.length} posts · {platformNames} · {date}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:border-brand/50 hover:text-brand transition-colors"
            >
              New search
            </button>
            <ExportButton posts={posts} keyword={keyword} />
          </div>
        </div>

        {/* Summary strip */}
        <SummaryStrip summary={summary} />

        {/* Metric cards */}
        <MetricCards summary={summary} />

        {/* Top phrases */}
        {summary.top_phrases && summary.top_phrases.length > 0 && (
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-2">Top phrases</p>
            <div className="flex flex-wrap gap-2">
              {summary.top_phrases.map((phrase, i) => (
                <span key={i} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-sm">
                  {phrase}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <FilterTabs active={activeFilter} onChange={setActiveFilter} sources={sources} />

        {/* Post feed */}
        <PostFeed posts={filteredPosts} />
      </div>
    </div>
  )
}
