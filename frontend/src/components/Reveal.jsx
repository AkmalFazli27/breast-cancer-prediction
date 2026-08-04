import { useReveal } from '../hooks/useReveal'

// Wraps children in a scroll-reveal element; delay staggers the transition, reset re-reveals on scroll up. 
export default function Reveal({ as: Tag = 'div', delay = 0, reset = false, className = '', children }) {
  const { ref, visible } = useReveal({ reset })
  return (
    <Tag
      ref={ref}
      className={`${visible ? 'reveal-visible' : 'reveal'} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}