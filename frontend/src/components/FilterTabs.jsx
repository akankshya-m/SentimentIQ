const SRC_LABELS = { rd: "Reddit", nw: "News" }

export default function FilterTabs({ active, onChange, sources }) {
  const sentimentTabs = ["all", "positive", "neutral", "negative"]
  const srcTabs = sources.filter((s) => ["rd", "nw"].includes(s))

  const tabs = [
    ...sentimentTabs.map((t) => ({ key: t, label: t.charAt(0).toUpperCase() + t.slice(1) })),
    ...srcTabs.map((s) => ({ key: s, label: SRC_LABELS[s] || s })),
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            active === key
              ? "bg-brand text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:border-brand/50 hover:text-brand"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
