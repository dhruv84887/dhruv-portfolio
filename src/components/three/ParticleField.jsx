import { memo, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { usePointerPosition } from '../../animations/index.js'

const CYAN = new THREE.Color('#4df0ff')
const VIOLET = new THREE.Color('#8b5cf6')
const STAR = new THREE.Color('#e9edfb')

/**
 * Volumetric neon starfield with soft glowing particles.
 * Particles are distributed inside a spherical shell, colored with a
 * cyan→violet gradient (plus a few bright white stars).
 */
function ParticleField({
  count = 1500,
  radius = 16,
  size = 0.07,
  parallax = true,
  animate = true,
}) {
  const groupRef = useRef()
  const spinRef = useRef()
  const pointer = usePointerPosition(animate && parallax)

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3)

    for (let i = 0; i < count; i += 1) {
      // Even distribution inside a sphere shell (cbrt keeps it volumetric)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = radius * (0.3 + 0.7 * Math.cbrt(Math.random()))

      array[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta)
      array[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      array[i * 3 + 2] = r * Math.cos(phi)
    }

    return array
  }, [count, radius])

  const colors = useMemo(() => {
    const array = new Float32Array(count * 3)
    const color = new THREE.Color()

    for (let i = 0; i < count; i += 1) {
      if (Math.random() < 0.07) {
        color.copy(STAR)
      } else {
        color.copy(CYAN).lerp(VIOLET, Math.random())
      }

      array[i * 3 + 0] = color.r
      array[i * 3 + 1] = color.g
      array[i * 3 + 2] = color.b
    }

    return array
  }, [count])

  // Soft circular sprite so particles read as glowing orbs, not squares
  const sprite = useMemo(() => {
    const canvasSize = 64
    const canvas = document.createElement('canvas')
    canvas.width = canvasSize
    canvas.height = canvasSize
    const context = canvas.getContext('2d')
    const gradient = context.createRadialGradient(
      canvasSize / 2,
      canvasSize / 2,
      0,
      canvasSize / 2,
      canvasSize / 2,
      canvasSize / 2,
    )
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.35, 'rgba(255, 255, 255, 0.75)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, canvasSize, canvasSize)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useEffect(() => () => sprite.dispose(), [sprite])

  useFrame((state, delta) => {
    if (!groupRef.current || !spinRef.current) return

    if (animate) {
      // Slow galactic drift
      spinRef.current.rotation.y += delta * 0.022
      spinRef.current.rotation.x += delta * 0.006

      // Subtle pointer parallax (shared, rAF-throttled pointer)
      if (parallax) {
        const targetY = pointer.current.x * 0.16
        const targetX = -pointer.current.y * 0.1
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          targetY,
          0.03,
        )
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          targetX,
          0.03,
        )
      }
    }
  })

  return (
    <group ref={groupRef}>
      <group ref={spinRef}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={size}
            sizeAttenuation
            vertexColors
            map={sprite}
            transparent
            opacity={0.9}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </group>
  )
}

export default memo(ParticleField)
