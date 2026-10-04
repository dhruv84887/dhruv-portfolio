import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

import { usePointerPosition } from '../../animations/index.js'

/**
 * Central "knowledge core" for the Skills section: a pulsing nucleus
 * wrapped in a gyroscope of orbital rings, glowing nodes and a faint
 * wireframe shell. Reacts to the mouse and freezes under reduced motion.
 */
export default function SkillsCore({ animate = true }) {
  const tiltRef = useRef(null)
  const nucleusRef = useRef(null)
  const ringARef = useRef(null)
  const ringBRef = useRef(null)
  const ringCRef = useRef(null)
  const shellRef = useRef(null)
  const pointer = usePointerPosition(animate)

  useFrame((state, delta) => {
    if (!animate) return

    const d = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime

    // Gentle energy pulse in the nucleus
    if (nucleusRef.current && nucleusRef.current.material) {
      nucleusRef.current.material.emissiveIntensity =
        0.55 + Math.sin(t * 1.5) * 0.28
    }

    // Gyroscopic ring precession (each ring on its own rhythm)
    if (ringARef.current) {
      ringARef.current.rotation.z += d * 0.32
      ringARef.current.rotation.x += d * 0.05
    }
    if (ringBRef.current) {
      ringBRef.current.rotation.y += d * 0.26
    }
    if (ringCRef.current) {
      ringCRef.current.rotation.x -= d * 0.2
      ringCRef.current.rotation.z += d * 0.12
    }
    if (shellRef.current) {
      shellRef.current.rotation.y -= d * 0.07
    }

    // Smooth mouse-follow parallax + floating bob
    if (tiltRef.current) {
      const tilt = tiltRef.current
      const { x, y } = pointer.current
      tilt.rotation.y += (x * 0.28 - tilt.rotation.y) * 0.05
      tilt.rotation.x += (0.12 + y * 0.16 - tilt.rotation.x) * 0.05
      tilt.position.y = Math.sin(t * 0.8) * 0.06
    }
  })

  return (
    <>
      {/* Lighting rig — same language as the Hero */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 5, 6]} intensity={2.1} color="#eaf6ff" />
      <directionalLight
        position={[-5, 1, -4]}
        intensity={1.3}
        color="#8b5cf6"
      />
      <pointLight position={[-3, 2, 3]} intensity={26} color="#4df0ff" />
      <pointLight position={[3, -2, 2]} intensity={22} color="#8b5cf6" />

      <group ref={tiltRef} rotation={[0.12, 0.2, 0]}>
        {/* Pulsing nucleus */}
        <mesh ref={nucleusRef}>
          <sphereGeometry args={[0.52, 32, 32]} />
          <meshStandardMaterial
            color="#0b1226"
            metalness={0.6}
            roughness={0.22}
            emissive="#4df0ff"
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* Gyroscopic rings with orbiting nodes */}
        <group ref={ringARef} rotation={[Math.PI / 3, 0.15, 0]}>
          <mesh>
            <torusGeometry args={[0.8, 0.016, 6, 128]} />
            <meshBasicMaterial
              color="#8b5cf6"
              transparent
              opacity={0.9}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0.8, 0, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#4df0ff" toneMapped={false} />
          </mesh>
        </group>

        <group ref={ringBRef} rotation={[-Math.PI / 4, 0.5, 0.35]}>
          <mesh>
            <torusGeometry args={[1.0, 0.012, 6, 128]} />
            <meshBasicMaterial
              color="#4df0ff"
              transparent
              opacity={0.8}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 1.0, 0]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="#e9edfb" toneMapped={false} />
          </mesh>
        </group>

        <group ref={ringCRef} rotation={[Math.PI / 2.2, -0.4, 0.5]}>
          <mesh>
            <torusGeometry args={[1.18, 0.01, 6, 128]} />
            <meshBasicMaterial
              color="#4df0ff"
              transparent
              opacity={0.45}
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* Faint outer shell tying the constellation together */}
        <mesh ref={shellRef} scale={1.3}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#4df0ff"
            wireframe
            transparent
            opacity={0.1}
            toneMapped={false}
          />
        </mesh>
      </group>
    </>
  )
}
