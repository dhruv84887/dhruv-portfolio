import { useEffect, useRef, useState } from 'react'

/**
 * Counts from 0 to `target` the first time its element enters the
 * viewport (eased, rAF-driven). Returns a ref to attach to the element
 * and the current value. With `enabled: false` (reduced motion) the
 * final value is shown immediately.
 *
 * Usage:
 *   const { ref, value } = useCountUp(10, { enabled: !reduced })
 *   <li ref={ref}>{value}</li>
 */
export function useCountUp(target, { duration = 1500, enabled = true } = {}) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    // Reduced motion (or no observer) → final value immediately
    if (!enabled || typeof IntersectionObserver === 'undefined') {
      setValue(target)
      return undefined
    }

    let raf = 0
    let start = 0

    const run = () => {
      const step = (now) => {
        if (!start) start = now
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.round(target * eased))
        if (progress < 1) raf = window.requestAnimationFrame(step)
      }
      raf = window.requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          run()
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [target, duration, enabled])

  return { ref, value }
}
