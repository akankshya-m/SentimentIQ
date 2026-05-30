import { useState } from "react"
import { api } from "../utils/api"

const PAGE_BG = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f172a 0%, #0d1b35 50%, #0f172a 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px 16px",
  fontFamily: "Inter, sans-serif",
}

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.")
      return
    }
    setLoading(true)
    try {
      const user = await api.login(email.trim(), password)
      onLogin(user)
    } catch (err) {
      setError(err.message || "Invalid email or password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={PAGE_BG}>
      <div style={{ width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", alignItems: "center", gap: "28px" }}>

        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "96px", height: "96px", borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 0 40px rgba(59,130,246,0.2)",
          }}>
            <img src="./screen.png" alt="Sentiment IQ" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 600, color: "#e3e2e6", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
            Sentiment IQ
          </h1>
        </div>

        {/* Sign In Card */}
        <div className="glass-card-elevated" style={{ width: "100%", padding: "32px 28px", display: "flex", flexDirection: "column", gap: "24px" }}>

          <h2 style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: "#e3e2e6", letterSpacing: "-0.01em" }}>
            Sign In
          </h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Email field */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em",
                color: "#8e9199", textTransform: "uppercase",
              }}>
                <EnvelopeIcon />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                autoComplete="email"
                style={{
                  width: "100%", height: "52px", borderRadius: "8px",
                  background: "rgba(13,14,17,0.9)", border: "1px solid #334155",
                  color: "#e3e2e6", fontSize: "16px", padding: "0 16px",
                  outline: "none", fontFamily: "Inter, sans-serif",
                  transition: "border-color 200ms ease, box-shadow 200ms ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6"
                  e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#334155"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>

            {/* Password field */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em",
                color: "#8e9199", textTransform: "uppercase",
              }}>
                <LockIcon />
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    width: "100%", height: "52px", borderRadius: "8px",
                    background: "rgba(13,14,17,0.9)", border: "1px solid #334155",
                    color: "#e3e2e6", fontSize: "16px", padding: "0 48px 0 16px",
                    outline: "none", fontFamily: "Inter, sans-serif",
                    transition: "border-color 200ms ease, box-shadow 200ms ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6"
                    e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#334155"
                    e.target.style.boxShadow = "none"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "#8e9199", display: "flex", alignItems: "center", padding: 0,
                    transition: "color 150ms ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#adc8f5"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#8e9199"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: "10px 14px", borderRadius: "8px",
                background: "rgba(147,0,10,0.2)", border: "1px solid #93000a",
                color: "#ffb4ab", fontSize: "13px",
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", height: "50px", borderRadius: "8px", border: "none",
                background: loading ? "rgba(59,130,246,0.4)" : "linear-gradient(135deg, #1e3a5f, #3b82f6)",
                color: "white", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em",
                textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "Inter, sans-serif", transition: "opacity 200ms ease",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                marginTop: "4px",
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.88" }}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              {loading ? <Spinner /> : null}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "13px", color: "#8e9199", fontFamily: "Inter, sans-serif",
                transition: "color 150ms ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#adc8f5"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#8e9199"}
            >
              Forgot password?
            </button>
          </div>
        </div>

        {/* Demo credentials hint */}
        <div style={{
          width: "100%", padding: "12px 16px", borderRadius: "8px",
          background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          <span style={{ fontSize: "16px" }}>💡</span>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", color: "#8e9199", textTransform: "uppercase", marginBottom: "2px" }}>
              Demo Account
            </div>
            <div style={{ fontSize: "13px", color: "#adc8f5", fontFamily: "monospace" }}>
              demo@sentimentiq.com &nbsp;/&nbsp; demo123
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
      style={{ animation: "step-spin 0.75s linear infinite" }}>
      <path strokeLinecap="round" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

function EnvelopeIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )
}
