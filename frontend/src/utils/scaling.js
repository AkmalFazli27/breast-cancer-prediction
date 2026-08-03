/** Min–max scaling of a single feature into [0,1], mirroring the legacy app. */
export function scaleToUnit(value, meta) {
  return (value - meta.min) / (meta.max - meta.min)
}

/**
 * Picks a "nice" slider step (1/2/5 x 10^k) for a feature's range so the
 * track carries roughly 200-2000 increments regardless of scale.
 */
export function sensibleStep(min, max) {
  const range = max - min
  const raw = range / 500
  const exp = Math.floor(Math.log10(raw))
  const base = Math.pow(10, exp)
  const normalized = raw / base
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  return nice * base
}

/** Snaps a value to the nearest step multiple from min, matching the browser's range-input snapping. */
export function roundStep(value, step, min = 0) {
  const snapped = min + Math.round((value - min) / step) * step
  const decimals = step < 1 ? Math.min(6, Math.ceil(-Math.log10(step)) + 1) : 0
  return Number(snapped.toFixed(decimals))
}

/** Confidence level from the probability margin, per the PRD's badge spec. */
export function confidenceLevel(benignPct, malignantPct) {
  const margin = Math.abs(benignPct - malignantPct)
  if (margin >= 30) return 'high'
  if (margin >= 15) return 'medium'
  return 'low'
}

/**
 * Builds radar data in the legacy axis order.
 * Each base axis carries its mean / se / worst values (missing suffixes are skipped).
 * Matches meta by base+suffix (not by string-concatenated key) so it is immune
 * to the dataset's inconsistent naming — e.g. `concave points_mean` (space) vs
 * `fractal_dimension_mean` (underscore).
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