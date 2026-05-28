import { useState } from "react"
import { api } from "../utils/api"

export function useAnalysis() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function run(keyword, sources) {
    setLoading(true)
    setError(null)
    try {
      const data = await api.analyse(keyword, sources)
      setResult(data)
      return data
    } catch (err) {
      setError(err.message || "Analysis failed")
      return null
    } finally {
      setLoading(false)
    }
  }

  return { loading, result, error, run }
}
