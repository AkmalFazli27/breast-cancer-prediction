import axios from 'axios'
import { FEATURE_KEYS, FEATURE_META } from '../constants/features'
import { TOP_FEATURES } from '../constants/metrics'
import { scaleToUnit } from '../utils/scaling'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''
const API_TIMEOUT = 10000

export async function predict(features) {
  const { data } = await axios.post(`${API_BASE}/api/v1/predict`, features, {
    timeout: API_TIMEOUT,
  })
  return data
}
export function predictDemo(features) {
  const weight = Object.fromEntries(
    TOP_FEATURES.map(({ key, importance }) => [key, importance]),
  )
  const meta = Object.fromEntries(FEATURE_META.map((f) => [f.key, f]))
  const score = FEATURE_KEYS.reduce((sum, key) => {
    const w = weight[key] ?? 0
    if (!w) return sum
    const raw = Number(features[key])
    if (!Number.isFinite(raw)) return sum
    return sum + w * scaleToUnit(raw, meta[key])
  }, 0)

  const totalWeight = TOP_FEATURES.reduce((s, f) => s + f.importance, 0)
  const normalized = score / totalWeight
  const malignantLogit = (normalized - 0.55) / 0.18
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