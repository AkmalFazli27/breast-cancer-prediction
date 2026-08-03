/** Min–max scaling of a single feature into [0,1], mirroring the legacy app. */
export function scaleToUnit(value, meta) {
  return (value - meta.min) / (meta.max - meta.min)
}

/**
 * Builds radar data in the legacy axis order.
 * Each base axis carries its mean / se / worst values (missing suffixes are skipped).
 */
export function buildRadarData(input, FEATURE_META, RADAR_BASES) {
  return RADAR_BASES.map((base) => {
    const suffixKeys = {}
    for (const suffix of ['mean', 'se', 'worst']) {
      const key = `${base}_${suffix}`
      const meta = FEATURE_META.find((f) => f.key === key)
      if (meta && input[key] !== undefined && input[key] !== null) {
        suffixKeys[suffix] = Number(scaleToUnit(Number(input[key]), meta).toFixed(3))
      }
    }
    return { base, ...suffixKeys }
  })
}

/** Confidence level from the probability margin, per the PRD's badge spec. */
export function confidenceLevel(benignPct, malignantPct) {
  const margin = Math.abs(benignPct - malignantPct)
  if (margin >= 30) return 'high'
  if (margin >= 15) return 'medium'
  return 'low'
}