import { useEffect, useState } from "react"
import { api } from "../utils/api"

const STEPS = [
  { key: "scrape", label: "Scraping sources" },
  { key: "clean", label: "Cleaning & deduplication" },
  { key: "classify", label: "AI sentiment classification" },
  { key: "aggregate", label: "Building report" },
]

function StepRow({ step, state, msg, count }) {
  return (
    <div className="flex items-start gap-4 py-4">
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300"
        style={{
          borderColor: state === "done" ? "#16a34a" : state === "running" ? "#0F4C81" : "#cbd5e1",
          backgroundColor: state === "done" ? "#16a34a" : state === "running" ? "#e8f1fb" : "white",
        }}>
        {state === "done" && (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {state === "running" && (
          <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        )}
        {state === "pending" && (
          <div className="w-2 h-2 rounded-full bg-slate-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-medium text-sm transition-colors ${
          state === "done" ? "text-slate-700" : state === "running" ? "text-brand animate-pulse" : "text-slate-400"
        }`}>
          {step.label}
        </div>
        {msg && (
          <div className="text-xs text-slate-500 mt-0.5 font-mono">{msg}</div>
        )}
      </div>
      {count !== undefined && state === "done" && (
        <span className="flex-shrink-0 text-xs font-mono bg-brand-100 text-brand px-2 py-0.5 rounded-full">
          {count} posts
        </span>
      )}
    </div>
  )
}

export default function PipelineLog({ keyword, sources, onComplete }) {
  const [stepStates, setStepStates] = useState({
    scrape: { state: "pending", msg: "", count: undefined },
    clean: { state: "pending", msg: "", count: undefined },
    classify: { state: "pending", msg: "", count: undefined },
    aggregate: { state: "pending", msg: "", count: undefined },
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    const url = api.streamUrl(keyword, sources)
    const es = new EventSource(url)

    es.onmessage = (e) => {
      if (e.data === "[DONE]") {
        es.close()
        return
      }
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
      } catch (err) {
        // ignore parse errors
      }
    }

    es.onerror = () => {
      es.close()
      setError("Connection lost. Please try again.")
    }

    return () => es.close()
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-brand px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg">Sentiment Intelligence</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold text-slate-800">Analysing</h2>
            <p className="text-slate-500 mt-1">
              Running pipeline for <span className="font-medium text-brand">"{keyword}"</span>
            </p>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
              {error}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm divide-y divide-slate-100 px-6">
              {STEPS.map((step) => (
                <StepRow
                  key={step.key}
                  step={step}
                  {...stepStates[step.key]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
