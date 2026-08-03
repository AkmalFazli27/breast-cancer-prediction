import axios from 'axios'
import { FEATURE_KEYS } from '../constants/features'
import { TOP_FEATURES } from '../constants/metrics'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''
const API_TIMEOUT = 10000

/**
 * POST /api/v1/predict — the PRD's API contract.
 * Sends the 22 features under their exact column names (spaces preserved);
 * the backend re-orders internally.
 */
export async function predict(features) {
  const { data } = await axios.post(`${API_BASE}/api/v1/predict`, features, {
    timeout: API_TIMEOUT,
  })
  return data
}

/**
 * Demo predictor — used only when no API base URL is configured.
 *
 * SYNTHETIC. This is a stand-in built from the published feature-importance
 * rankings so the interface can be exercised before the FastAPI backend is
 * wired up. It must never be presented as the real model; the UI labels it.
 */
export function predictDemo(features) {
  const weight = Object.fromEntries(
    TOP_FEATURES.map(({ key, importance }) => [key, importance]),
  )
  const score = FEATURE_KEYS.reduce((sum, key) => {
    const w = weight[key] ?? 0
    if (!w) return sum
    const raw = Number(features[key])
    if (Number.isFinite(raw)) return sum + w * raw
    return sum
  }, 0)

  // Logistic transform of a weighted score; thresholds chosen so benign
  // inputs (dataset means) resolve to a clear Benign verdict.
  const malignantLogit = (score - 9.2) / 2.2
  const malignant = 1 / (1 + Math.exp(-malignantLogit))
  const benign = 1 - malignant

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        prediction: malignant >= 0.5 ? 'Malignant' : 'Benign',
        probability: {
          benign: Number((benign * 100).toFixed(1)),
          malignant: Number((malignant * 100).toFixed(1)),
        },
      })
    }, 650)
  })
}

export const isDemoMode = !API_BASE