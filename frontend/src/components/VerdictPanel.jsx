import { Loader2, RotateCcw, WifiOff } from 'lucide-react'
import ConfidenceBadge from './ConfidenceBadge'
import ProbabilityBar from './ProbabilityBar'

const EMPTY_STATE = {
  eyebrow: 'Awaiting measurement',
  title: 'No prediction yet',
  body: 'Enter the 22 cell-nuclei measurements and submit to run the model.',
}

/**
 * The prediction result — verdict headline, probabilities, confidence badge.
 * Handles idle / loading / success / error states.
 */
export default function VerdictPanel({ state, result, onReset, isDemoMode = false }) {
  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center gap-3 border border-rule bg-stock px-6 py-14 text-center">
        <Loader2 className="size-6 animate-spin text-hematoxylin" strokeWidth={1.5} aria-hidden />
        <p className="text-sm text-ink-soft">
          Running inference — scaler, then logistic regression…
        </p>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div
        className="border border-carmine bg-carmine-soft px-6 py-10 text-center"
        role="alert"
      >
        <WifiOff className="mx-auto size-6 text-carmine" strokeWidth={1.5} aria-hidden />
        <h2 className="mt-3 font-display text-xl text-ink">Service unavailable</h2>
        <p className="measure mx-auto mt-1 text-sm text-ink-soft">
          The prediction service could not be reached. The model is served from a
          backend API; try again in a moment.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-5 border border-carmine px-4 py-1.5 text-sm text-carmine transition-colors hover:bg-carmine hover:text-paper"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="border border-rule bg-stock px-6 py-12 text-center">
        <p className="small-notation text-faded">
          {EMPTY_STATE.eyebrow}
        </p>
        <h2 className="mt-2 font-display text-2xl text-ink">{EMPTY_STATE.title}</h2>
        <p className="measure mx-auto mt-2 text-sm text-ink-soft">{EMPTY_STATE.body}</p>
      </div>
    )
  }

  const benign = result.probability.benign
  const malignant = result.probability.malignant
  const isBenign = result.prediction === 'Benign'

  return (
    <div className="border border-rule">
      <div
        className={`border-b border-rule px-6 py-6 ${
          isBenign ? 'bg-benign-soft' : 'bg-carmine-soft'
        }`}
      >
        <p className="small-notation text-faded">Verdict</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h2
            className={`font-display text-4xl leading-none ${
              isBenign ? 'text-benign' : 'text-carmine'
            }`}
          >
            {result.prediction}
          </h2>
          <ConfidenceBadge benignPct={benign} malignantPct={malignant} />
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          {isBenign
            ? 'The model reads this cell cluster as benign — not a diagnosis.'
            : 'The model reads this cell cluster as malignant — not a diagnosis.'}
        </p>
      </div>

      <div className="px-6 py-5">
        <div className="flex items-baseline justify-between">
          <h4 className="font-display text-base text-ink">Probability</h4>
          <span className="small-notation text-faded">
            benign {benign.toFixed(1)}% / malignant {malignant.toFixed(1)}%
          </span>
        </div>
        <div className="mt-3">
          <ProbabilityBar
            key={`${benign}-${malignant}`}
            benignPct={benign}
            malignantPct={malignant}
          />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-rule pt-4">
          <p className="text-xs text-faded">
            Logistic regression · scaled features · {isDemoMode ? 'demo' : 'live'} model
          </p>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-ink-soft transition-colors hover:text-hematoxylin"
          >
            <RotateCcw className="size-3.5" strokeWidth={1.75} aria-hidden /> New prediction
          </button>
        </div>
      </div>
    </div>
  )
}