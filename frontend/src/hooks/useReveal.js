import { useEffect, useRef, useState } from 'react'

// Reveals an element as it scrolls into view; with reset, hides it again when it leaves.
export function useReveal({ reset = false } = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (reset) {
          setVisible(entries[0].isIntersecting)
        } else if (entries[0].isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reset])

  return { ref, visible }
}