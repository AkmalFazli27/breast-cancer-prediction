import { useState } from 'react'
import { Info } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

/** A single labeled numeric input for one model feature, with inline validation and a tooltip. */
export default function FeatureInput({ meta }) {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const [showTip, setShowTip] = useState(false)
  const error = errors?.[meta.key]

  return (
    <div className="relative">
      <label
        htmlFor={meta.key}
        className="flex items-start justify-between gap-2 text-[13px] leading-snug text-ink-soft"
      >
        <span className="notation text-ink">{meta.key}</span>
        <button
          type="button"
          className="mt-0.5 shrink-0 text-faded transition-colors hover:text-hematoxylin cursor-help"
          aria-label={`About ${meta.key}`}
          aria-describedby={`tip-${meta.key}`}
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
          onFocus={() => setShowTip(true)}
          onBlur={() => setShowTip(false)}
        >
          <Info className="size-3.5" strokeWidth={1.75} aria-hidden />
        </button>
      </label>

      <input
        id={meta.key}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        className="field mt-1"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `err-${meta.key}` : `tip-${meta.key}`}
        {...register(meta.key, { valueAsNumber: false })}
      />

      {showTip && (
        <span
          id={`tip-${meta.key}`}
          role="tooltip"
          className="absolute right-0 top-full z-20 mt-1 w-56 border border-rule-ink bg-paper px-3 py-2 text-xs leading-relaxed text-ink shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
        >
          {meta.tooltip}
        </span>
      )}

      {error && (
        <span
          id={`err-${meta.key}`}
          role="alert"
          className="mt-1 block text-xs text-carmine"
        >
          {error.message}
        </span>
      )}
    </div>
  )
}