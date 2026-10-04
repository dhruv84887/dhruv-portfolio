import { useEffect, useRef } from 'react'

/**
 * Premium 3D tilt on hover (perspective rotateX/rotateY) with
 * --mx/--my spotlight and --tx/--ty image-parallax variables.
 * Performance: rAF-throttled, cached bounding rect (recomputed only
 * after scroll/resize), no React state, disabled on touch devices.
 */
export function useTilt({ max = 10, scale = 1.04, disabled = false } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || disabled) return undefined
    if (
      typeof window.matchMedia === 'function' &&
      !window.matchMedia('(hover: hover)').matches
    ) {
      return undefined
    }

    let rect = null
    let raf = 0
    let pending = false
    let latestX = 0
    let latestY = 0

    const apply = () => {
      pending = false
      raf = 0
      if (!rect) rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const rawX = (latestX - rect.left) / rect.width
      const rawY = (latestY - rect.top) / rect.height
      const px = Math.min(Math.max(rawX, 0), 1)
      const py = Math.min(Math.max(rawY, 0), 1)

      el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
      el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
      el.style.setProperty('--tx', (px - 0.5).toFixed(3))
      el.style.setProperty('--ty', (py - 0.5).toFixed(3))
      el.style.transform = [
        'perspective(750px)',
        `rotateX(${((0.5 - py) * 2 * max).toFixed(2)}deg)`,
        `rotateY(${((px - 0.5) * 2 * max).toFixed(2)}deg)`,
        `scale(${scale})`,
      ].join(' ')
    }

    const onPointerMove = (event) => {
      if (event.pointerType !== 'mouse') return
      latestX = event.clientX
      latestY = event.clientY
      if (pending) return
      pending = true
      raf = window.requestAnimationFrame(apply)
    }

    const onPointerLeave = () => {
      if (raf) window.cancelAnimationFrame(raf)
      pending = false
      raf = 0
      rect = null
      el.style.removeProperty('transform')
      el.style.removeProperty('--mx')
      el.style.removeProperty('--my')
      el.style.removeProperty('--tx')
      el.style.removeProperty('--ty')
    }

    const invalidate = () => {
      rect = null
    }

    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('scroll', invalidate, { passive: true })
    window.addEventListener('resize', invalidate)

    return () => {
      if (raf) window.cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('scroll', invalidate)
      window.removeEventListener('resize', invalidate)
    }
  }, [max, scale, disabled])

  return ref
}
