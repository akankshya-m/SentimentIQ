import { useState, useEffect } from "react"
import LoginPage from "./pages/LoginPage"
import SearchPage from "./pages/SearchPage"
import ResultsPage from "./pages/ResultsPage"
import HistoryPage from "./pages/HistoryPage"
import { api } from "./utils/api"

const NAV_TABS = [
  { key: "search",   label: "Dashboard", icon: <GridIcon /> },
  { key: "history",  label: "History",   icon: <ClockIcon /> },
  { key: "saved",    label: "Saved",     icon: <BookmarkIcon /> },
  { key: "settings", label: "Settings",  icon: <GearIcon /> },
]

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser]             = useState(null)
  const [result, setResult]         = useState(null)
  const [keyword, setKeyword]       = useState("")
  const [sources, setSources]       = useState(["rd", "nw"])
  const [activeTab, setActiveTab]   = useState("search")
  const [history, setHistory]       = useState([])

  useEffect(() => {
    if (!isLoggedIn) return
    api.history().then(setHistory).catch(() => {})
  }, [isLoggedIn])

  function refreshHistory() {
    api.history().then(setHistory).catch(() => {})
  }

  function handleLogin(u) {
    setUser(u)
    setIsLoggedIn(true)
  }

  function handleResult(kw, srcs, res) {
    setKeyword(kw)
    setSources(srcs)
    setResult(res)
    setActiveTab("search")
    refreshHistory()
  }

  function handleLogout() {
    setIsLoggedIn(false)
    setUser(null)
    setResult(null)
    setHistory([])
    setActiveTab("search")
  }

  function handleBack() { setResult(null) }

  function handleViewRun(run) {
    setKeyword(run.keyword)
    setSources(run.sources)
    setResult({ posts: run.posts || [], summary: run.summary, keyword: run.keyword })
    setActiveTab("search")
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  const BG = { background: "linear-gradient(135deg, #0f172a 0%, #0d1b35 50%, #0f172a 100%)", minHeight: "100vh" }

  function renderPage() {
    if (activeTab === "search") {
      return result
        ? <ResultsPage result={result} keyword={keyword} sources={sources} onBack={handleBack} />
        : <SearchPage onResult={handleResult} />
    }
    if (activeTab === "history") return <HistoryPage history={history} onViewRun={handleViewRun} onRefresh={refreshHistory} />
    if (activeTab === "settings") return <Placeholder label="Settings" onLogout={handleLogout} />
    return <Placeholder label={NAV_TABS.find(t => t.key === activeTab)?.label} />
  }

  return (
    <div style={BG}>
      <div className="app-shell">
        {/* ── Desktop sidebar ── */}
        <aside className="app-sidebar">
          <SidebarContent active={activeTab} onChange={setActiveTab} user={user} onLogout={handleLogout} onRefreshHistory={refreshHistory} />
        </aside>

        {/* ── Page content ── */}
        <main className="app-main">
          {renderPage()}
        </main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="app-bottom-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: "64px",
        background: "rgba(15,23,42,0.97)", backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid #334155", zIndex: 50,
        alignItems: "center", justifyContent: "space-around",
      }}>
        {NAV_TABS.map(({ key, label, icon }) => {
          const isActive = activeTab === key
          return (
            <button key={key} onClick={() => { setActiveTab(key); if (key === "history") refreshHistory() }} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
              padding: "4px 16px", borderRadius: "9999px",
              background: isActive ? "rgba(59,130,246,0.2)" : "transparent",
              border: "none", cursor: "pointer",
              color: isActive ? "#3b82f6" : "#8e9199",
              transition: "all 200ms ease",
            }}>
              {icon}
              <span style={{ fontSize: "11px", fontWeight: 500, lineHeight: 1.2 }}>{label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

function SidebarContent({ active, onChange, user, onLogout, onRefreshHistory }) {
  return (
    <>
      {/* Logo */}
      <div style={{
        padding: "24px 20px 20px",
        borderBottom: "1px solid #334155",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0,
          overflow: "hidden",
          boxShadow: "0 0 20px rgba(59,130,246,0.12)",
        }}>
          <img src="./screen.png" alt="Sentiment IQ" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#e3e2e6", lineHeight: 1.2 }}>
            Sentiment IQ
          </div>
          <div style={{ fontSize: "11px", color: "#8e9199", marginTop: "1px" }}>AI Analysis Engine</div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {NAV_TABS.map(({ key, label, icon }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => { onChange(key); if (key === "history") onRefreshHistory() }}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                width: "100%", padding: "10px 12px", borderRadius: "10px",
                background: isActive ? "rgba(59,130,246,0.18)" : "transparent",
                border: `1px solid ${isActive ? "rgba(59,130,246,0.35)" : "transparent"}`,
                color: isActive ? "#adc8f5" : "#8e9199",
                fontSize: "14px", fontWeight: isActive ? 600 : 400,
                cursor: "pointer", transition: "all 180ms ease",
                textAlign: "left", fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "rgba(59,130,246,0.08)"; e.currentTarget.style.color = "#c4c6cf" } }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8e9199" } }}
            >
              <span style={{ flexShrink: 0 }}>{icon}</span>
              {label}
            </button>
          )
        })}
      </nav>

      {/* User info + logout at bottom */}
      {user && (
        <div style={{ borderTop: "1px solid #334155" }}>
          <div style={{
            padding: "16px 20px 12px",
            display: "flex", alignItems: "center", gap: "10px",
          }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "9999px", flexShrink: 0,
              background: "linear-gradient(135deg, #1e3a5f, #3b82f6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: 700, color: "white",
            }}>
              {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "13px", fontWeight: 500, color: "#e3e2e6", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.name || "User"}
              </div>
              <div style={{ fontSize: "11px", color: "#8e9199", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.email}
              </div>
            </div>
          </div>
          <div style={{ padding: "0 12px 16px" }}>
            <button
              onClick={onLogout}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                width: "100%", padding: "9px 12px", borderRadius: "10px",
                background: "transparent", border: "1px solid transparent",
                color: "#8e9199", fontSize: "14px", fontWeight: 400,
                cursor: "pointer", transition: "all 180ms ease",
                textAlign: "left", fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244,63,94,0.1)"; e.currentTarget.style.borderColor = "rgba(244,63,94,0.3)"; e.currentTarget.style.color = "#f43f5e" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = "#8e9199" }}
            >
              <LogoutIcon />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function Placeholder({ label, onLogout }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: "24px" }}>
      <span style={{ color: "var(--color-outline)" }}>{label} — coming soon</span>
      {onLogout && (
        <button
          onClick={onLogout}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 20px", borderRadius: "10px",
            background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)",
            color: "#f43f5e", fontSize: "14px", fontWeight: 500,
            cursor: "pointer", fontFamily: "Inter, sans-serif",
            transition: "all 180ms ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(244,63,94,0.18)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(244,63,94,0.1)"}
        >
          <LogoutIcon /> Sign Out
        </button>
      )}
    </div>
  )
}

function GridIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 7v5l3 3" />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
}
