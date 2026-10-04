import { useEffect, useState } from 'react'

/**
 * Tracks whether the page has been scrolled past `offset` px.
 * Uses requestAnimationFrame throttling for smooth performance.
 *
 * Usage: const scrolled = useScrollPosition(24)
 */
export function useScrollPosition(offset = 24) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let ticking = false

    const measure = () => {
      setScrolled(window.scrollY > offset)
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])

  return scrolled
}
