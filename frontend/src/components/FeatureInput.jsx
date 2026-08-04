import { useState } from 'react'
import { Info } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { roundStep, sensibleStep } from '../utils/scaling'

/** One feature slider: label, tooltip, min/max bounds, value readout. */
export default function FeatureInput({ meta }) {
  const { register, watch } = useFormContext()
  const [showTip, setShowTip] = useState(false)
  const step = sensibleStep(meta.min, meta.max)
  const current = roundStep(Number(watch(meta.key)), step, meta.min)

  return (
    <div className="relative">
      <label
        htmlFor={meta.key}
        className="flex items-start justify-between gap-2 text-[13px] leading-snug text-ink-soft"
      >
        <span className="notation text-ink">{meta.label}</span>
        <button
          type="button"
          className="relative mt-0.5 shrink-0 text-faded transition-colors hover:text-hematoxylin cursor-help"
          aria-label={`About ${meta.label}`}
          aria-describedby={`tip-${meta.key}`}
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
          onFocus={() => setShowTip(true)}
          onBlur={() => setShowTip(false)}
        >
          <Info className="size-3.5" strokeWidth={1.75} aria-hidden />
          {showTip && (
            <span
              id={`tip-${meta.key}`}
              role="tooltip"
              className="absolute right-0 top-full z-20 mt-1 w-56 border border-rule-ink bg-paper px-3 py-2 text-xs leading-relaxed text-ink shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
            >
              {meta.tooltip}
            </span>
          )}
        </button>
      </label>

      <div className="mt-1.5 flex items-center gap-3">
        <input
          id={meta.key}
          type="range"
          min={meta.min}
          max={meta.max}
          step={step}
          className="slider flex-1"
          aria-label={meta.label}
          {...register(meta.key, { valueAsNumber: true })}
        />
        <output
          htmlFor={meta.key}
          className="notation w-16 shrink-0 text-right text-ink"
          aria-live="polite"
        >
          {current}
        </output>
      </div>

      <div className="mt-1 flex justify-between small-notation text-faded">
        <span>{meta.min}</span>
        <span>{meta.max}</span>
      </div>
    </div>
  )
}