import { useEffect, useRef } from 'react'

/**
 * Adds the `is-revealed` class to the referenced element when it
 * enters the viewport, driving the global [data-reveal] transition.
 *
 * Usage:
 *   const ref = useReveal()
 *   <div ref={ref} data-reveal>…</div>
 *
 * Set `--reveal-delay` on the element for staggered entrances.
 */
export function useReveal({
  threshold = 0.15,
  once = true,
  rootMargin = '0px 0px -8% 0px',
  watch = [],
} = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    // Observe the node itself and/or any [data-reveal] descendants,
    // so one ref can orchestrate a staggered entrance sequence.
    const targets = []
    if (node.hasAttribute('data-reveal')) targets.push(node)
    node.querySelectorAll('[data-reveal]').forEach((el) => targets.push(el))

    // Graceful fallback when IntersectionObserver is unavailable
    if (typeof IntersectionObserver === 'undefined') {
      for (const el of targets) el.classList.add('is-revealed')
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.remove('is-revealed')
          }
        }
      },
      { threshold, rootMargin },
    )

    for (const el of targets) observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once, rootMargin, ...watch])

  return ref
}
