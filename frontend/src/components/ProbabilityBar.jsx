/** A single hairlined bar showing the benign/malignant probability split. */
export default function ProbabilityBar({ benignPct, malignantPct }) {
  return (
    <div>
      <div className="flex h-4 w-full overflow-hidden border border-rule-ink">
        <div
          className="bar-grow bg-benign"
          style={{ width: `${benignPct}%` }}
          aria-label={`Benign ${benignPct}%`}
        />
        <div
          className="bar-grow bg-carmine"
          style={{ width: `${malignantPct}%` }}
          aria-label={`Malignant ${malignantPct}%`}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="size-2 bg-benign" aria-hidden /> Benign
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 bg-carmine" aria-hidden /> Malignant
        </span>
      </div>
    </div>
  )
}