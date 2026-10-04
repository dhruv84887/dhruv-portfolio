import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** Syntax-highlighted "code" rows on the holographic screen. */
const CODE_LINES = [
  { width: 1.5, color: '#4df0ff', y: 0.42, phase: 0 },
  { width: 1.1, color: '#8b5cf6', y: 0.24, phase: 0.9 },
  { width: 1.35, color: '#e9edfb', y: 0.06, phase: 1.8 },
  { width: 0.9, color: '#4df0ff', y: -0.12, phase: 2.7 },
  { width: 1.2, color: '#ff5ea8', y: -0.3, phase: 3.6 },
]

/**
 * Floating holographic laptop: dark metal body with glowing edge
 * lines, a cyan screen panel and animated code rows + blinking cursor.
 */
export default function HoloLaptop({ animate = true }) {
  const groupRef = useRef(null)
  const lineRefs = useRef([])
  const cursorRef = useRef(null)

  // The inner BoxGeometry must be disposed too: EdgesGeometry copies the
  // positions it needs, so the source geometry is left dangling otherwise.
  const screenBox = useMemo(() => new THREE.BoxGeometry(2.3, 1.5, 0.06), [])
  const baseBox = useMemo(() => new THREE.BoxGeometry(2.3, 0.1, 1.5), [])

  const screenEdges = useMemo(
    () => new THREE.EdgesGeometry(screenBox),
    [screenBox],
  )
  const baseEdges = useMemo(() => new THREE.EdgesGeometry(baseBox), [baseBox])

  useEffect(
    () => () => {
      screenEdges.dispose()
      baseEdges.dispose()
      screenBox.dispose()
      baseBox.dispose()
    },
    [screenEdges, baseEdges, screenBox, baseBox],
  )

  useFrame((state) => {
    if (!animate) return
    const t = state.clock.elapsedTime

    // Gentle float + sway
    if (groupRef.current) {
      groupRef.current.position.y = -0.1 + Math.sin(t * 0.6) * 0.07
      groupRef.current.rotation.y = -0.3 + Math.sin(t * 0.35) * 0.05
    }

    // Code rows pulse at staggered phases
    for (let i = 0; i < lineRefs.current.length; i += 1) {
      const line = lineRefs.current[i]
      if (!line || !line.material) continue
      const wave = 0.5 + 0.5 * Math.sin(t * 1.4 + CODE_LINES[i].phase)
      line.material.opacity = 0.45 + 0.5 * wave
    }

    // Blinking cursor
    if (cursorRef.current && cursorRef.current.material) {
      cursorRef.current.material.opacity = Math.sin(t * 4) > 0 ? 0.95 : 0.15
    }
  })

  return (
    <group ref={groupRef} rotation={[0.1, -0.3, 0]} position={[0, -0.1, 0]}>
      {/* Base */}
      <mesh>
        <boxGeometry args={[2.3, 0.1, 1.5]} />
        <meshStandardMaterial
          color="#0c1224"
          metalness={0.75}
          roughness={0.35}
        />
      </mesh>
      <lineSegments geometry={baseEdges}>
        <lineBasicMaterial
          color="#4df0ff"
          transparent
          opacity={0.55}
          toneMapped={false}
        />
      </lineSegments>

      {/* Front glow strip */}
      <mesh position={[0, 0.01, 0.76]}>
        <boxGeometry args={[2.1, 0.015, 0.02]} />
        <meshBasicMaterial
          color="#4df0ff"
          transparent
          opacity={0.9}
          toneMapped={false}
        />
      </mesh>

      {/* Lid, hinged at the back edge */}
      <group position={[0, 0.05, -0.7]} rotation={[-0.28, 0, 0]}>
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[2.3, 1.5, 0.06]} />
          <meshStandardMaterial
            color="#0a0f20"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
        <lineSegments geometry={screenEdges} position={[0, 0.75, 0]}>
          <lineBasicMaterial
            color="#4df0ff"
            transparent
            opacity={0.6}
            toneMapped={false}
          />
        </lineSegments>

        {/* Holographic screen panel */}
        <mesh position={[0, 0.75, 0.045]}>
          <planeGeometry args={[2.15, 1.35]} />
          <meshBasicMaterial
            color="#062636"
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </mesh>

        {/* Animated code rows */}
        {CODE_LINES.map((line, index) => (
          <mesh
            key={line.y}
            ref={(el) => {
              lineRefs.current[index] = el
            }}
            position={[-1.05 + line.width / 2, 0.75 + line.y, 0.05]}
          >
            <planeGeometry args={[line.width, 0.07]} />
            <meshBasicMaterial
              color={line.color}
              transparent
              opacity={0.7}
              toneMapped={false}
            />
          </mesh>
        ))}

        {/* Blinking cursor after the last row */}
        <mesh ref={cursorRef} position={[0.24, 0.45, 0.05]}>
          <planeGeometry args={[0.09, 0.09]} />
          <meshBasicMaterial
            color="#e9edfb"
            transparent
            opacity={0.9}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}
