import { useEffect, useState } from 'react'

/**
 * Tracks whether an element is near the viewport (IntersectionObserver).
 * Use it to gate WebGL bursts and heavy effects while sections are
 * offscreen. Starts as `false` so no scene compiles shaders at load —
 * the initial IO observation flips it on just before it's needed.
 */
export function useInView(ref, { rootMargin = '200px 0px' } = {}) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin, threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  return inView
}
