import { confidenceLevel } from '../utils/scaling'

const LEVEL_STYLE = {
  high: 'border-benign text-benign bg-benign-soft',
  medium: 'border-hematoxylin text-hematoxylin bg-hematoxylin-pale',
  low: 'border-faded text-faded bg-stock',
}

const LEVEL_LABEL = { high: 'High confidence', medium: 'Medium confidence', low: 'Low confidence' }

// Confidence badge: High/Medium/Low from the probability margin.
export default function ConfidenceBadge({ benignPct, malignantPct }) {
  const level = confidenceLevel(benignPct, malignantPct)
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-0.5 text-xs font-medium ${LEVEL_STYLE[level]}`}
    >
      {LEVEL_LABEL[level]}
    </span>
  )
}