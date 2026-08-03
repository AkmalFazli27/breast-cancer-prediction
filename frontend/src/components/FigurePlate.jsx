/** A framed, captioned figure — the paper's plate grammar. */
export default function FigurePlate({ number, caption, children, className = '' }) {
  return (
    <figure className={`figure-plate ${className}`}>
      {children}
      {caption && (
        <figcaption className="figure-caption px-4 py-3">
          <span className="font-medium text-ink">{number}</span>
          <span> {caption}</span>
        </figcaption>
      )}
    </figure>
  )
}