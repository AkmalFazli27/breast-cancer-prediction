import { CONFUSION_MATRIX, MODEL_METRICS, TOP_FEATURES } from '../constants/metrics'

/** The paper's results table — metrics with their n, confusion matrix, top features. */
export default function ModelMetrics() {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section aria-labelledby="metrics-heading">
        <h3 id="metrics-heading" className="font-display text-xl">
          Performance on the held-out test set
        </h3>
        <p className="small-notation mt-1 text-faded">n = {CONFUSION_MATRIX.total} test samples</p>
        <table className="results-table mt-4">
          <thead>
            <tr>
              <th scope="col">Metric</th>
              <th scope="col">Score</th>
              <th scope="col">Note</th>
            </tr>
          </thead>
          <tbody>
            {MODEL_METRICS.map((row) => (
              <tr key={row.metric}>
                <td className="text-ink">{row.metric}</td>
                <td className="notation font-medium text-ink">{row.value}</td>
                <td className="text-ink-soft">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section aria-labelledby="cm-heading">
        <h3 id="cm-heading" className="font-display text-xl">
          Confusion matrix
        </h3>
        <p className="small-notation mt-1 text-faded">
          Predicted vs. actual on the held-out test set
        </p>
        <table className="results-table mt-4">
          <thead>
            <tr>
              <th scope="col">Actual →</th>
              <th scope="col">Predicted Benign</th>
              <th scope="col">Predicted Malignant</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-ink">Benign</td>
              <td className="notation font-medium text-benign">TN {CONFUSION_MATRIX.TN}</td>
              <td className="notation font-medium text-carmine">FP {CONFUSION_MATRIX.FP}</td>
            </tr>
            <tr>
              <td className="text-ink">Malignant</td>
              <td className="notation font-medium text-carmine">FN {CONFUSION_MATRIX.FN}</td>
              <td className="notation font-medium text-benign">TP {CONFUSION_MATRIX.TP}</td>
            </tr>
          </tbody>
        </table>

        <h3 className="font-display text-xl pt-8">Top-5 contributing features</h3>
        <p className="small-notation mt-1 text-faded">Feature-importance ranking, model coefficients</p>
        <table className="results-table mt-4">
          <tbody>
            {TOP_FEATURES.map((f, i) => (
              <tr key={f.key}>
                <td className="w-8 notation text-faded">{String(i + 1).padStart(2, '0')}</td>
                <td className="notation text-ink">{f.key}</td>
                <td className="notation font-medium text-ink text-right">{f.importance.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}