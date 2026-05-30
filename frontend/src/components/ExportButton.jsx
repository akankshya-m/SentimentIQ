import { useState, useRef, useEffect } from "react"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function ExportButton({ posts, keyword, summary }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function exportExcel() {
    setOpen(false)
    const rows = posts.map((p) => ({
      Keyword:    keyword,
      Platform:   p.src === "rd" ? "Reddit" : "News",
      Sentiment:  p.sentiment || "",
      Confidence: p.confidence ? `${Math.round(p.confidence * 100)}%` : "",
      Reason:     p.reason || "",
      KeyPhrases: (p.kp || []).join("; "),
      Text:       p.text || "",
      URL:        p.url || "",
    }))

    const summaryRows = summary ? [
      { Metric: "Total Posts",   Value: summary.total },
      { Metric: "Positive",      Value: summary.positive },
      { Metric: "Neutral",       Value: summary.neutral },
      { Metric: "Negative",      Value: summary.negative },
      { Metric: "Sentiment Score", Value: summary.score?.toFixed(3) },
    ] : []

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "Posts")
    if (summaryRows.length) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryRows), "Summary")
    }
    XLSX.writeFile(wb, `sentiment_${slug(keyword)}.xlsx`)
  }

  function exportPDF() {
    setOpen(false)
    const doc = new jsPDF({ orientation: "landscape" })
    const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })

    // Header
    doc.setFontSize(18)
    doc.setTextColor(173, 200, 245)
    doc.text("Sentiment Intelligence Report", 14, 16)

    doc.setFontSize(11)
    doc.setTextColor(140, 145, 153)
    doc.text(`Keyword: ${keyword}   |   Date: ${date}`, 14, 24)

    // Summary row
    if (summary) {
      doc.setFontSize(10)
      doc.setTextColor(227, 226, 230)
      const s = summary
      doc.text(
        `Total: ${s.total}   Positive: ${s.positive}   Neutral: ${s.neutral}   Negative: ${s.negative}   Score: ${s.score?.toFixed(3)}`,
        14, 32
      )
    }

    // Posts table
    autoTable(doc, {
      startY: 38,
      head: [["Platform", "Sentiment", "Conf.", "Reason", "Key Phrases", "Text"]],
      body: posts.map((p) => [
        p.src === "rd" ? "Reddit" : "News",
        (p.sentiment || "").toUpperCase(),
        p.confidence ? `${Math.round(p.confidence * 100)}%` : "",
        p.reason || "",
        (p.kp || []).join(", "),
        (p.text || "").slice(0, 120) + ((p.text || "").length > 120 ? "…" : ""),
      ]),
      styles: { fontSize: 8, cellPadding: 3, textColor: [227, 226, 230], fillColor: [30, 41, 59] },
      headStyles: { fillColor: [30, 58, 95], textColor: [173, 200, 245], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [15, 23, 42] },
      columnStyles: {
        0: { cellWidth: 18 },
        1: { cellWidth: 22 },
        2: { cellWidth: 14 },
        3: { cellWidth: 55 },
        4: { cellWidth: 45 },
        5: { cellWidth: "auto" },
      },
    })

    doc.save(`sentiment_${slug(keyword)}.pdf`)
  }

  const ITEMS = [
    { label: "Excel (.xlsx)", icon: <ExcelIcon />, action: exportExcel },
    { label: "PDF (.pdf)",    icon: <PdfIcon />,   action: exportPDF },
  ]

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "8px 16px", borderRadius: "8px", border: "1px solid #3b82f6",
          background: "transparent", color: "#3b82f6", fontSize: "14px", fontWeight: 400,
          cursor: "pointer", transition: "all 200ms ease", fontFamily: "Inter, sans-serif",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(59,130,246,0.1)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <ExportIcon />
        Export
      </button>

      {open && (
        <div className="glass-card-elevated" style={{
          position: "absolute", right: 0, top: "calc(100% + 8px)",
          minWidth: "160px", zIndex: 100, overflow: "hidden",
        }}>
          {ITEMS.map(({ label, icon, action }) => (
            <button
              key={label}
              onClick={action}
              style={{
                width: "100%", padding: "11px 16px", border: "none", background: "transparent",
                color: "#c4c6cf", fontSize: "14px", textAlign: "left", cursor: "pointer",
                transition: "background 200ms ease", fontFamily: "Inter, sans-serif",
                display: "flex", alignItems: "center", gap: "10px",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(59,130,246,0.1)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function slug(kw) {
  return kw.replace(/\s+/g, "_") + "_" + new Date().toISOString().slice(0, 10)
}

function ExportIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

function ExcelIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path strokeLinecap="round" d="M8 8l8 8M16 8l-8 8" />
    </svg>
  )
}

function PdfIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2h-2" />
      <path strokeLinecap="round" d="M9 17v-5h2a2 2 0 010 4H9" />
      <path strokeLinecap="round" d="M13 17v-5h3" />
      <path strokeLinecap="round" d="M13 14h2" />
    </svg>
  )
}
