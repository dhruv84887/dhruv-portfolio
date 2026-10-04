import { useEffect, useRef } from 'react'

/**
 * Shared, rAF-throttled page pointer (-1..1). A single window
 * listener serves every 3D scene in the app — components just read
 * `pointer.current.x/y` inside frame loops (never React state).
 */
const sharedPointer = { x: 0, y: 0 }
let consumerCount = 0
let rafId = 0
let pending = false
let latestX = 0
let latestY = 0

const flush = () => {
  pending = false
  rafId = 0
  sharedPointer.x = (latestX / Math.max(window.innerWidth, 1)) * 2 - 1
  sharedPointer.y = (latestY / Math.max(window.innerHeight, 1)) * 2 - 1
}

const onPointerMove = (event) => {
  if (event.pointerType !== 'mouse') return
  latestX = event.clientX
  latestY = event.clientY
  if (pending) return
  pending = true
  rafId = window.requestAnimationFrame(flush)
}

function subscribe() {
  if (consumerCount++ > 0) return
  // No mouse-follow work on touch-only devices
  if (
    typeof window.matchMedia === 'function' &&
    !window.matchMedia('(hover: hover)').matches
  ) {
    return
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true })
}

function unsubscribe() {
  if (--consumerCount > 0) return
  window.removeEventListener('pointermove', onPointerMove)
  if (rafId) {
    window.cancelAnimationFrame(rafId)
    rafId = 0
    pending = false
  }
}

export function usePointerPosition(enabled = true) {
  const pointer = useRef(sharedPointer)

  useEffect(() => {
    if (!enabled) return undefined
    subscribe()
    return unsubscribe
  }, [enabled])

  return pointer
}
