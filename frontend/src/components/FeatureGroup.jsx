import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { FEATURE_META } from '../constants/features'
import FeatureInput from './FeatureInput'

/** A collapsible feature group (Mean / Standard Error / Worst) as a fieldset. */
export default function FeatureGroup({ group, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const features = FEATURE_META.filter((f) => group.keys.includes(f.key))

  return (
    <fieldset className="border border-rule bg-paper">
      <legend className="sr-only">{group.title}</legend>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between border-b border-rule bg-stock px-4 py-2.5 text-left transition-colors hover:bg-stock-deep"
      >
        <span className="flex items-baseline gap-3">
          <span className="small-notation text-faded">{group.numeral}</span>
          <span className="font-display text-base text-ink">{group.title}</span>
          <span className="small-notation text-faded">{features.length} features</span>
        </span>
        <ChevronDown
          className={`size-4 text-faded transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.75}
          aria-hidden
        />
      </button>

      {open && (
        <div className="grid gap-x-6 gap-y-4 px-4 py-4 sm:grid-cols-2">
          {features.map((meta) => (
            <FeatureInput key={meta.key} meta={meta} />
          ))}
        </div>
      )}
    </fieldset>
  )
}