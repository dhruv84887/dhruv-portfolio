import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Cinematic hero centerpiece: a faceted core with glowing edges,
 * a counter-rotating wireframe shell, orbital rings with a glowing
 * satellite — slow rotation, floating bob and page-wide mouse parallax.
 */
export default function HeroObject({ animate = true }) {
  const tiltRef = useRef(null)
  const spinRef = useRef(null)
  const shellRef = useRef(null)
  const orbitRef = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })

  const coreGeometry = useMemo(() => new THREE.IcosahedronGeometry(1.12, 0), [])
  const edgesGeometry = useMemo(
    () => new THREE.EdgesGeometry(coreGeometry),
    [coreGeometry],
  )

  useEffect(
    () => () => {
      coreGeometry.dispose()
      edgesGeometry.dispose()
    },
    [coreGeometry, edgesGeometry],
  )

  // Page-wide pointer tracking so the parallax reacts anywhere on screen
  useEffect(() => {
    if (!animate) return undefined

    const onPointerMove = (event) => {
      if (event.pointerType !== 'mouse') return
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [animate])

  useFrame((state, delta) => {
    if (!animate) return

    const d = Math.min(delta, 0.05)
    const elapsed = state.clock.elapsedTime

    if (tiltRef.current) {
      const tilt = tiltRef.current
      const { x, y } = pointer.current
      tilt.rotation.y = THREE.MathUtils.lerp(tilt.rotation.y, x * 0.3, 0.05)
      tilt.rotation.x = THREE.MathUtils.lerp(
        tilt.rotation.x,
        0.1 + y * 0.18,
        0.05,
      )
      tilt.position.y = Math.sin(elapsed * 0.7) * 0.08
    }

    if (spinRef.current) {
      spinRef.current.rotation.y += d * 0.22
      spinRef.current.rotation.x += d * 0.05
    }

    if (shellRef.current) {
      shellRef.current.rotation.y -= d * 0.12
      shellRef.current.rotation.x -= d * 0.04
    }

    if (orbitRef.current) {
      orbitRef.current.rotation.z += d * 0.55
    }
  })

  return (
    <>
      {/* Lighting rig — tuned for contrast: deeper ambient, crisper key
          light, stronger neon rim. Intensities only: zero render cost. */}
      <ambientLight intensity={0.34} />
      <directionalLight position={[4, 5, 6]} intensity={2.6} color="#eaf6ff" />
      <directionalLight
        position={[-5, 1, -4]}
        intensity={1.7}
        color="#8b5cf6"
      />
      <pointLight position={[-3.5, 1.5, 2.5]} intensity={36} color="#4df0ff" />
      <pointLight position={[3, -1.5, 2]} intensity={28} color="#8b5cf6" />
      <pointLight position={[0, -3, 1]} intensity={14} color="#9fb6ff" />

      {/* The object itself (tilts toward the mouse) */}
      <group ref={tiltRef} rotation={[0.1, 0.4, 0]}>
        {/* Faceted core with glowing edges */}
        <group ref={spinRef}>
          <mesh geometry={coreGeometry}>
            <meshStandardMaterial
              color="#0d1530"
              metalness={0.68}
              roughness={0.2}
              emissive="#0f3044"
              emissiveIntensity={0.72}
              flatShading
            />
          </mesh>
          <lineSegments geometry={edgesGeometry}>
            <lineBasicMaterial
              color="#4df0ff"
              transparent
              opacity={0.9}
              toneMapped={false}
            />
          </lineSegments>
        </group>

        {/* Counter-rotating wireframe shell */}
        <mesh ref={shellRef} scale={1.5}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#4df0ff"
            wireframe
            transparent
            opacity={0.14}
            toneMapped={false}
          />
        </mesh>

        {/* Orbital ring with a glowing satellite */}
        <group rotation={[Math.PI / 2.6, 0.3, 0.2]}>
          <mesh>
            <torusGeometry args={[1.85, 0.014, 6, 128]} />
            <meshBasicMaterial
              color="#8b5cf6"
              transparent
              opacity={0.9}
              toneMapped={false}
            />
          </mesh>
          <group ref={orbitRef}>
            <mesh position={[1.85, 0, 0]}>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshBasicMaterial color="#e9edfb" toneMapped={false} />
            </mesh>
          </group>
        </group>

        {/* Outer ring */}
        <group rotation={[-Math.PI / 3.2, -0.35, -0.25]}>
          <mesh>
            <torusGeometry args={[2.15, 0.01, 6, 128]} />
            <meshBasicMaterial
              color="#4df0ff"
              transparent
              opacity={0.55}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
    </>
  )
}
