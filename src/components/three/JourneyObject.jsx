import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** Cube corner positions for the glowing node dots. */
const CORNERS = [
  [-1.35, -1.35, -1.35],
  [1.35, -1.35, -1.35],
  [-1.35, 1.35, -1.35],
  [1.35, 1.35, -1.35],
  [-1.35, -1.35, 1.35],
  [1.35, -1.35, 1.35],
  [-1.35, 1.35, 1.35],
  [1.35, 1.35, 1.35],
]

/**
 * "Tech artifact": a glowing dodecahedron core inside a rotating
 * wireframe cube frame with corner nodes. Slowly spins, floats, and
 * reacts subtly to page scrolling. Freezes under reduced motion.
 */
export default function JourneyObject({ animate = true }) {
  const tiltRef = useRef(null)
  const spinRef = useRef(null)
  const coreRef = useRef(null)
  const scrollY = useRef(0)
  const smoothScroll = useRef(0)

  // Dispose both the derived edges AND their source geometries —
  // EdgesGeometry copies data, leaving the originals leaked otherwise.
  const coreBase = useMemo(() => new THREE.DodecahedronGeometry(1.05, 0), [])
  const cubeBase = useMemo(() => new THREE.BoxGeometry(2.7, 2.7, 2.7), [])
  const coreEdges = useMemo(
    () => new THREE.EdgesGeometry(coreBase),
    [coreBase],
  )
  const cubeEdges = useMemo(() => new THREE.EdgesGeometry(cubeBase), [cubeBase])

  useEffect(
    () => () => {
      coreEdges.dispose()
      cubeEdges.dispose()
      coreBase.dispose()
      cubeBase.dispose()
    },
    [coreEdges, cubeEdges, coreBase, cubeBase],
  )

  // Subtle reaction to page scroll
  useEffect(() => {
    if (!animate) return undefined
    const onScroll = () => {
      scrollY.current = window.scrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [animate])

  useFrame((state, delta) => {
    if (!animate) return
    const d = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime

    if (spinRef.current) {
      spinRef.current.rotation.y += d * 0.14
      spinRef.current.rotation.x += d * 0.05
    }

    if (coreRef.current && coreRef.current.material) {
      coreRef.current.material.emissiveIntensity =
        0.5 + Math.sin(t * 1.4) * 0.25
    }

    if (tiltRef.current) {
      const raw = scrollY.current * 0.0006
      const target = Math.max(-0.4, Math.min(0.4, raw))
      smoothScroll.current += (target - smoothScroll.current) * 0.05
      tiltRef.current.rotation.x = smoothScroll.current
      tiltRef.current.position.y = Math.sin(t * 0.7) * 0.08
    }
  })

  return (
    <>
      {/* Lighting rig — same language as the other sections */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 5, 6]} intensity={2.1} color="#eaf6ff" />
      <directionalLight
        position={[-5, 1, -4]}
        intensity={1.3}
        color="#8b5cf6"
      />
      <pointLight position={[-3, 2, 3]} intensity={24} color="#4df0ff" />
      <pointLight position={[3, -2, 2]} intensity={20} color="#8b5cf6" />

      <group ref={tiltRef} rotation={[0.1, 0.2, 0]}>
        <group ref={spinRef}>
          {/* Wireframe cube frame */}
          <mesh>
            <boxGeometry args={[2.7, 2.7, 2.7]} />
            <meshBasicMaterial
              color="#4df0ff"
              wireframe
              transparent
              opacity={0.1}
              toneMapped={false}
            />
          </mesh>
          <lineSegments geometry={cubeEdges}>
            <lineBasicMaterial
              color="#4df0ff"
              transparent
              opacity={0.5}
              toneMapped={false}
            />
          </lineSegments>

          {/* Faceted core with glowing edges */}
          <mesh ref={coreRef}>
            <dodecahedronGeometry args={[1.05, 0]} />
            <meshStandardMaterial
              color="#0c1330"
              metalness={0.65}
              roughness={0.28}
              emissive="#8b5cf6"
              emissiveIntensity={0.55}
              flatShading
            />
          </mesh>
          <lineSegments geometry={coreEdges}>
            <lineBasicMaterial
              color="#4df0ff"
              transparent
              opacity={0.85}
              toneMapped={false}
            />
          </lineSegments>

          {/* Glowing corner nodes */}
          {CORNERS.map((position, index) => (
            <mesh key={index} position={position}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshBasicMaterial
                color={index % 2 ? '#4df0ff' : '#e9edfb'}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      </group>
    </>
  )
}
