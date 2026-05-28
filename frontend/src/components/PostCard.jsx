const SRC_META = {
  rd: { label: "Reddit", color: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
  nw: { label: "News", color: "bg-violet-100 text-violet-700", dot: "bg-violet-500" },
}

const SENTIMENT_META = {
  positive: { label: "Positive", color: "bg-green-100 text-green-700 border border-green-200" },
  neutral: { label: "Neutral", color: "bg-slate-100 text-slate-600 border border-slate-200" },
  negative: { label: "Negative", color: "bg-red-100 text-red-700 border border-red-200" },
}

export default function PostCard({ post, index }) {
  const src = SRC_META[post.src] || SRC_META.nw
  const sentiment = SENTIMENT_META[post.sentiment] || SENTIMENT_META.neutral

  return (
    <div
      className="bg-white border border-slate-200 rounded-xl p-5 hover:border-brand/40 hover:shadow-sm transition-all duration-200"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: "both" }}
    >
      {/* Top row: text + sentiment badge */}
      <div className="flex gap-4">
        <p className="flex-1 text-slate-800 text-sm leading-relaxed">{post.text}</p>
        <span className={`flex-shrink-0 h-fit text-xs font-medium px-2.5 py-1 rounded-full ${sentiment.color}`}>
          {sentiment.label}
        </span>
      </div>

      {/* Middle row: platform + reason + confidence */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium ${src.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${src.dot}`} />
          {src.label}
        </span>
        {post.reason && (
          <span className="flex-1 min-w-0 truncate italic">{post.reason}</span>
        )}
        {post.confidence && (
          <span className="font-mono ml-auto flex-shrink-0">{Math.round(post.confidence * 100)}%</span>
        )}
      </div>

      {/* Key phrases */}
      {post.kp && post.kp.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {post.kp.map((phrase, i) => (
            <span key={i} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
              {phrase}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
