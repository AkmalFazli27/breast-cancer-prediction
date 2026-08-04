// Scale a feature value into [0,1].
export function scaleToUnit(value, meta) {
  return (value - meta.min) / (meta.max - meta.min)
}

// Pick a nice slider step (~200-2000 increments per track).
export function sensibleStep(min, max) {
  const range = max - min
  const raw = range / 500
  const exp = Math.floor(Math.log10(raw))
  const base = Math.pow(10, exp)
  const normalized = raw / base
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  return nice * base
}

// Snap a value to the nearest step from min (matches browser range snapping).
export function roundStep(value, step, min = 0) {
  const snapped = min + Math.round((value - min) / step) * step
  const decimals = step < 1 ? Math.min(6, Math.ceil(-Math.log10(step)) + 1) : 0
  return Number(snapped.toFixed(decimals))
}

// Confidence (high/medium/low) from the probability margin.
export function confidenceLevel(benignPct, malignantPct) {
  const margin = Math.abs(benignPct - malignantPct)
  if (margin >= 30) return 'high'
  if (margin >= 15) return 'medium'
  return 'low'
}

/**
 * Build radar data in legacy axis order; match meta by base+suffix
 * (names mix spaces and underscores).
 */
export function buildRadarData(input, FEATURE_META, RADAR_BASES) {
  return RADAR_BASES.map((base) => {
    const suffixKeys = {}
    for (const suffix of ['mean', 'se', 'worst']) {
      const meta = FEATURE_META.find((f) => f.base === base && f.suffix === suffix)
      if (meta && input[meta.key] !== undefined && input[meta.key] !== null) {
        suffixKeys[suffix] = Number(scaleToUnit(Number(input[meta.key]), meta).toFixed(3))
      }
    }
    return { base, ...suffixKeys }
  })
}