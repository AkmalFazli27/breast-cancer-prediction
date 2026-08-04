import { useCallback, useState } from 'react'
import { predict, predictDemo, isDemoMode } from '../services/prediction'

/** Prediction hook: wraps the API call with loading, error, and result state. */
export function usePrediction() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const runPrediction = useCallback(async (values) => {
    setLoading(true)
    setError(null)
    try {
      const data = isDemoMode ? await predictDemo(values) : await predict(values)
      setResult(data)
    } catch (err) {
      setResult(null)
      setError(
        err?.code === 'ECONNABORTED'
          ? 'The request timed out. Please try again.'
          : 'The prediction service is unavailable. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  const resetResult = useCallback(() => {
    setResult(null)
    setError(null)
    setLoading(false)
  }, [])

  return { result, loading, error, runPrediction, resetResult, isDemoMode }
}