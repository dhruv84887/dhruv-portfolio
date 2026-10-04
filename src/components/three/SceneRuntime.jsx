import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

/**
 * Demand-based rendering controller for decorative scenes.
 *
 * - Short entrance "burst" (frames the scene for ~2.4s when it scrolls
 *   into view, so it still feels alive), then the scene goes fully idle
 *   (frameloop="demand" — no rAF, no GPU work).
 * - Afterward it only renders while the user actually interacts with the
 *   canvas (pointer over it) or when the window resizes.
 *
 * Idle cost: zero. This replaces continuous 60fps rendering.
 */
export default function SceneRuntime({
  enabled = true,
  burst = 2400,
  interactive = true,
}) {
  const invalidate = useThree((state) => state.invalidate)
  const gl = useThree((state) => state.gl)

  // Entrance burst, then idle. burst <= 0 renders a single frame.
  useEffect(() => {
    if (!enabled) return undefined
    if (burst <= 0) {
      invalidate()
      return undefined
    }

    let raf = 0
    const start = performance.now()
    const step = (now) => {
      invalidate()
      if (now - start < burst) raf = window.requestAnimationFrame(step)
    }
    raf = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(raf)
  }, [enabled, burst, invalidate])

  // Interaction-only rendering: pointer/touch on this canvas + resize.
  useEffect(() => {
    if (!enabled || !interactive) return undefined

    const canvas = gl.domElement
    let raf = 0
    let pending = false

    const requestFrame = (event) => {
      if (
        event.type === 'pointermove' &&
        event.pointerType &&
        event.pointerType !== 'mouse'
      ) {
        return
      }
      if (pending) return
      pending = true
      raf = window.requestAnimationFrame(() => {
        pending = false
        invalidate()
      })
    }

    const onResize = () => invalidate()

    canvas.addEventListener('pointermove', requestFrame, { passive: true })
    canvas.addEventListener('pointerdown', requestFrame, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      if (raf) window.cancelAnimationFrame(raf)
      canvas.removeEventListener('pointermove', requestFrame)
      canvas.removeEventListener('pointerdown', requestFrame)
      window.removeEventListener('resize', onResize)
    }
  }, [enabled, interactive, invalidate, gl])

  return null
}
