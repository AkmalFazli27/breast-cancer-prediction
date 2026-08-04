/** Model metrics (source: results/model_summary.csv, test n=114). */
export const MODEL_METRICS = [
  { metric: 'Accuracy', value: '97.37%', note: '114 test samples' },
  { metric: 'Precision', value: '97.56%', note: 'among predicted positive' },
  { metric: 'Recall', value: '95.24%', note: 'among actual positive' },
  { metric: 'F1 Score', value: '96.39%', note: 'harmonic mean of P and R' },
  { metric: 'ROC-AUC', value: '99.04%', note: 'area under the ROC curve' },
]

export const CONFUSION_MATRIX = {
  TN: 71, FP: 1, FN: 2, TP: 40,
  total: 114,
}

export const TOP_FEATURES = [
  { key: 'concave points_worst', importance: 19.65 },
  { key: 'area_worst', importance: 17.3 },
  { key: 'concave points_mean', importance: 14.07 },
  { key: 'area_se', importance: 12.82 },
  { key: 'concavity_worst', importance: 8.07 },
]

export const MODEL_DETAILS = {
  model: 'Logistic Regression',
  features: 22,
  pipeline: '2023',
  algorithm: 'C = 10, l2 penalty, liblinear solver',
  dataset: 'Wisconsin Breast Cancer Diagnostic Dataset',
  samples: 569,
  train: 455,
  test: 114,
}