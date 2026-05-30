import PostCard from "./PostCard"

export default function PostFeed({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "48px 0",
        fontSize: "16px", color: "#8e9199",
      }}>
        No posts match this filter.
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {posts.map((post, i) => (
        <PostCard key={i} post={post} />
      ))}
    </div>
  )
}
