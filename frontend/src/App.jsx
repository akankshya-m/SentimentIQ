import { useState } from "react"
import SearchPage from "./pages/SearchPage"
import ResultsPage from "./pages/ResultsPage"

export default function App() {
  const [result, setResult] = useState(null)
  const [keyword, setKeyword] = useState("")
  const [sources, setSources] = useState(["tw", "rd", "nw"])

  return result
    ? <ResultsPage result={result} keyword={keyword} sources={sources}
                   onBack={() => setResult(null)} />
    : <SearchPage onResult={(kw, srcs, res) => {
        setKeyword(kw); setSources(srcs); setResult(res)
      }} />
}
