import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''
const API_TIMEOUT = 10000

export async function predict(features) {
  const { data } = await axios.post(`${API_BASE}/api/v1/predict`, features, {
    timeout: API_TIMEOUT,
  })
  return data
}