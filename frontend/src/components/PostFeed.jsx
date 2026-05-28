import PostCard from "./PostCard"

export default function PostFeed({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        No posts match this filter.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post, i) => (
        <PostCard key={i} post={post} index={i} />
      ))}
    </div>
  )
}
