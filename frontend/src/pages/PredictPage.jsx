import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Loader2, RotateCcw } from 'lucide-react'
import FigurePlate from '../components/FigurePlate'
import FeatureGroup from '../components/FeatureGroup'
import RadarFigure from '../components/RadarFigure'
import VerdictPanel from '../components/VerdictPanel'
import { DEFAULT_VALUES, FEATURE_GROUPS } from '../constants/features'
import { predictionSchema } from '../constants/schema'
import { usePrediction } from '../hooks/usePrediction'

function ResetModal({ open, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm border border-rule-ink bg-paper p-6 shadow-[0_2px_12px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
        style={{ marginTop: 0 }}
      >
        <h3 id="reset-title" className="font-display text-2xl text-ink">
          Reset all measurements?
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          This restores the 22 fields to the dataset means. The current verdict will be
          cleared.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="border border-rule-ink px-4 py-1.5 text-sm text-ink transition-colors hover:bg-stock"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="border border-hematoxylin bg-hematoxylin px-4 py-1.5 text-sm text-paper transition-colors hover:bg-hematoxylin-deep"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PredictPage() {
  const methods = useForm({
    resolver: zodResolver(predictionSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched',
  })
  const { watch, handleSubmit, reset, formState } = methods
  const { errors } = formState
  const { result, loading, error, runPrediction, resetResult, isDemoMode } = usePrediction()
  const [showReset, setShowReset] = useState(false)

  const watchedValues = watch()
  const radarValues = Object.keys(watchedValues).length ? watchedValues : DEFAULT_VALUES
  const dirty = Object.keys(formState.dirtyFields).length > 0

  const onSubmit = (values) => {
    runPrediction(values)
  }

  const doReset = () => {
    setShowReset(false)
    resetResult()
    reset(DEFAULT_VALUES)
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="paper-in">
        <p className="small-notation text-faded uppercase tracking-[0.18em]">
          Instrument — {FEATURE_GROUPS.length} measurement groups
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight tracking-tight text-ink md:text-5xl">
          Enter the measurements
        </h1>
        <p className="measure mt-4 text-ink-soft">
          The {22} fields below are the model&apos;s features, grouped by how each
          measurement was summarized. Fields are prefilled with the dataset&apos;s means,
          so you can run a verdict out of the box.
        </p>
      </div>

      {isDemoMode && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 border border-faded bg-stock px-4 py-3"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-faded" strokeWidth={1.75} aria-hidden />
          <p className="text-sm leading-relaxed text-ink-soft">
            No prediction API configured — running on a <strong>synthetic demo model</strong>{' '}
            derived from the published feature importances, clearly not the real pipeline.
            Point <span className="notation">VITE_API_BASE_URL</span> at the FastAPI backend
            for live inference.
          </p>
        </div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
            {/* Inputs */}
            <div className="space-y-4">
              {FEATURE_GROUPS.map((group, i) => (
                <FeatureGroup key={group.id} group={group} defaultOpen={i === 0} />
              ))}

              <div className="flex flex-wrap items-center gap-4 border-t border-rule pt-5">
                <button
                  type="submit"
                  disabled={loading || Object.keys(errors).length > 0}
                  className="inline-flex items-center gap-2 border border-hematoxylin bg-hematoxylin px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-hematoxylin-deep disabled:cursor-not-allowed disabled:bg-stock disabled:text-faded disabled:border-rule-ink"
                >
                  {loading && <Loader2 className="size-4 animate-spin" strokeWidth={1.75} aria-hidden />}
                  {loading ? 'Running…' : 'Predict'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReset(true)}
                  disabled={!dirty && !result}
                  className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-hematoxylin disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RotateCcw className="size-4" strokeWidth={1.75} aria-hidden />
                  Reset to means
                </button>
                <span className="ml-auto small-notation text-faded">
                  {`${Object.keys(errors).length} of ${22} fields invalid`}
                </span>
              </div>
            </div>

            {/* Result column */}
            <aside className="space-y-6">
              <VerdictPanel
                state={loading ? 'loading' : error ? 'error' : result ? 'success' : 'idle'}
                result={result}
                isDemoMode={isDemoMode}
                onReset={() => {
                  resetResult()
                  reset(DEFAULT_VALUES)
                }}
              />

              <FigurePlate
                number="Fig. 2"
                caption="The values above, scaled per feature to [0, 1]. Filter by Mean, Standard Error, or Worst measurement."
              >
                <RadarFigure values={radarValues} />
              </FigurePlate>

              <div className="border border-rule-ink bg-stock px-4 py-3">
                <p className="small-notation text-faded uppercase tracking-widest">Disclaimer</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                  Educational use only. Not a substitute for professional medical advice,
                  diagnosis, or treatment.
                </p>
              </div>
            </aside>
          </div>
        </form>
      </FormProvider>

      <ResetModal open={showReset} onConfirm={doReset} onCancel={() => setShowReset(false)} />
    </main>
  )
}