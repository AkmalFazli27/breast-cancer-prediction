/**
 * FEATURE_META: the 22 model features. Keys match the processed CSV (some
 * contain spaces) and are the API contract; label is the display name.
 * min/max/mean come from that dataset.
 */

import { roundStep, sensibleStep } from '../utils/scaling'

function titleCaseWords(str) {
  return str
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const QUALIFIERS = {
  mean: {
    label: 'Mean',
    meaning:
      'an average of the measurement across the sample of cell nuclei',
  },
  se: {
    label: 'Standard Error',
    meaning:
      'a measure of how much the measurement varied between cell nuclei',
  },
  worst: {
    label: 'Worst',
    meaning:
      'the largest (worst) value of the measurement among the cell nuclei',
  },
}

const BASE_MEANING = {
  texture: 'Texture — the variation in gray-scale values across the cell nuclei image',
  smoothness: 'Smoothness — local variation in the cell radius; lower is smoother',
  compactness: 'Compactness — how round the nucleus is: (perimeter\u00b2 / area) \u2212 1',
  'concave points': 'Concave points — the number of concave portions of the nuclear contour',
  concavity: 'Concavity — the severity of concave portions of the nuclear contour',
  symmetry: 'Symmetry — how symmetric the nucleus is around its major axis',
  'fractal dimension': 'Fractal dimension — a \u201ccoastline approximation\u201d of the boundary complexity',
  area: 'Area — the area of the cell nucleus',
}

/** @type {{key:string, label:string, group:'mean'|'se'|'worst', min:number, max:number, mean:number, tooltip:string}[]} */
export const FEATURE_META = [
  // ---- Mean (6) ----
  { key: 'texture_mean', base: 'texture', suffix: 'mean', min: 9.71, max: 39.28, mean: 19.2896 },
  { key: 'smoothness_mean', base: 'smoothness', suffix: 'mean', min: 0.0526, max: 0.1634, mean: 0.0964 },
  { key: 'compactness_mean', base: 'compactness', suffix: 'mean', min: 0.0194, max: 0.3454, mean: 0.1043 },
  { key: 'concave points_mean', base: 'concave points', suffix: 'mean', min: 0.0, max: 0.2012, mean: 0.0489 },
  { key: 'symmetry_mean', base: 'symmetry', suffix: 'mean', min: 0.106, max: 0.304, mean: 0.1812 },
  { key: 'fractal_dimension_mean', base: 'fractal dimension', suffix: 'mean', min: 0.05, max: 0.0974, mean: 0.0628 },
  // ---- Standard Error (8) ----
  { key: 'texture_se', base: 'texture', suffix: 'se', min: 0.3602, max: 4.885, mean: 1.2169 },
  { key: 'area_se', base: 'area', suffix: 'se', min: 6.802, max: 542.2, mean: 40.3371 },
  { key: 'smoothness_se', base: 'smoothness', suffix: 'se', min: 0.0017, max: 0.0311, mean: 0.007 },
  { key: 'compactness_se', base: 'compactness', suffix: 'se', min: 0.0023, max: 0.1354, mean: 0.0255 },
  { key: 'concavity_se', base: 'concavity', suffix: 'se', min: 0.0, max: 0.396, mean: 0.0319 },
  { key: 'concave points_se', base: 'concave points', suffix: 'se', min: 0.0, max: 0.0528, mean: 0.0118 },
  { key: 'symmetry_se', base: 'symmetry', suffix: 'se', min: 0.0079, max: 0.079, mean: 0.0205 },
  { key: 'fractal_dimension_se', base: 'fractal dimension', suffix: 'se', min: 0.0009, max: 0.0298, mean: 0.0038 },
  // ---- Worst (8) ----
  { key: 'texture_worst', base: 'texture', suffix: 'worst', min: 12.02, max: 49.54, mean: 25.6772 },
  { key: 'area_worst', base: 'area', suffix: 'worst', min: 185.2, max: 4254.0, mean: 880.5831 },
  { key: 'smoothness_worst', base: 'smoothness', suffix: 'worst', min: 0.0712, max: 0.2226, mean: 0.1324 },
  { key: 'compactness_worst', base: 'compactness', suffix: 'worst', min: 0.0273, max: 1.058, mean: 0.2543 },
  { key: 'concavity_worst', base: 'concavity', suffix: 'worst', min: 0.0, max: 1.252, mean: 0.2722 },
  { key: 'concave points_worst', base: 'concave points', suffix: 'worst', min: 0.0, max: 0.291, mean: 0.1146 },
  { key: 'symmetry_worst', base: 'symmetry', suffix: 'worst', min: 0.1565, max: 0.6638, mean: 0.2901 },
  { key: 'fractal_dimension_worst', base: 'fractal dimension', suffix: 'worst', min: 0.055, max: 0.2075, mean: 0.0839 },
].map((f) => ({
  ...f,
  label: `${titleCaseWords(f.base)} ${QUALIFIERS[f.suffix].label}`,
  tooltip: `${BASE_MEANING[f.base]}. The ${QUALIFIERS[f.suffix].meaning}.`,
}))

/** Feature group order. */
export const FEATURE_GROUPS = [
  {
    id: 'mean',
    title: 'Mean',
    numeral: 'I.',
    blurb:
      'An average of each measurement across the cell nuclei in the sample image.',
    keys: FEATURE_META.filter((f) => f.suffix === 'mean').map((f) => f.key),
  },
  {
    id: 'se',
    title: 'Standard Error',
    numeral: 'II.',
    blurb:
      'How much each measurement varied across the cell nuclei in the sample.',
    keys: FEATURE_META.filter((f) => f.suffix === 'se').map((f) => f.key),
  },
  {
    id: 'worst',
    title: 'Worst',
    numeral: 'III.',
    blurb:
      'The largest (worst) value of each measurement across the cell nuclei.',
    keys: FEATURE_META.filter((f) => f.suffix === 'worst').map((f) => f.key),
  },
]

export const FEATURE_KEYS = FEATURE_META.map((f) => f.key)

/** Default form values: dataset means snapped to slider steps. */
export const DEFAULT_VALUES = Object.fromEntries(
  FEATURE_META.map((f) => [
    f.key,
    roundStep(f.mean, sensibleStep(f.min, f.max), f.min),
  ]),
)

/** Radar axis order (legacy). */
export const RADAR_BASES = [
  'concavity',
  'area',
  'symmetry',
  'concave points',
  'texture',
  'compactness',
  'smoothness',
  'fractal dimension',
]

/** Radar axis label. */
export function radarBaseLabel(base) {
  return titleCaseWords(base)
}

/** Display label for a feature key. */
export function featureLabel(key) {
  return FEATURE_META.find((f) => f.key === key)?.label ?? key
}

export const CONFIDENCE_LEVELS = {
  high: { threshold: 30, label: 'High confidence' },
  medium: { threshold: 15, label: 'Medium confidence' },
  low: { threshold: 0, label: 'Low confidence' },
}