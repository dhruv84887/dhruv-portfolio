import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

import { usePointerPosition } from '../../animations/index.js'
import HoloLaptop from './HoloLaptop.jsx'

/**
 * About section scene: holographic laptop + rotating technology rings
 * + orbiting tech fragments, with smooth mouse-follow parallax.
 * `simplified` drops the heavier layers for mobile devices.
 */
export default function DeveloperScene({ animate = true, simplified = false }) {
  const tiltRef = useRef(null)
  const ringARef = useRef(null)
  const ringBRef = useRef(null)
  const nodesRef = useRef(null)
  const pointer = usePointerPosition(animate)

  useFrame((state, delta) => {
    if (!animate) return
    const d = Math.min(delta, 0.05)

    if (ringARef.current) {
      ringARef.current.rotation.z += d * 0.18
      ringARef.current.rotation.x += d * 0.04
    }
    if (ringBRef.current) {
      ringBRef.current.rotation.y -= d * 0.14
      ringBRef.current.rotation.z += d * 0.06
    }
    if (nodesRef.current) {
      nodesRef.current.rotation.y += d * 0.1
    }

    // Smooth mouse-follow parallax
    if (tiltRef.current) {
      const { x, y } = pointer.current
      tiltRef.current.rotation.y += (x * 0.24 - tiltRef.current.rotation.y) * 0.045
      tiltRef.current.rotation.x += (y * 0.14 - tiltRef.current.rotation.x) * 0.045
    }
  })

  return (
    <>
      {/* Lighting rig — same language as Hero & Skills */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 5, 6]} intensity={2.1} color="#eaf6ff" />
      <directionalLight
        position={[-5, 1, -4]}
        intensity={1.3}
        color="#8b5cf6"
      />
      <pointLight position={[-3, 2, 3]} intensity={26} color="#4df0ff" />
      <pointLight position={[3, -2, 2]} intensity={22} color="#8b5cf6" />

      <group ref={tiltRef}>
        <HoloLaptop animate={animate} />

        {/* Rotating technology rings */}
        <group ref={ringARef} rotation={[Math.PI / 2.5, 0.2, 0]}>
          <mesh>
            <torusGeometry args={[2.0, 0.014, 6, 200]} />
            <meshBasicMaterial
              color="#8b5cf6"
              transparent
              opacity={0.85}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[2.0, 0, 0]} rotation={[0.4, 0.2, 0]}>
            <octahedronGeometry args={[0.07, 0]} />
            <meshBasicMaterial color="#4df0ff" toneMapped={false} />
          </mesh>
        </group>

        {!simplified && (
          <group ref={ringBRef} rotation={[-Math.PI / 3.4, -0.4, 0.3]}>
            <mesh>
              <torusGeometry args={[2.35, 0.01, 6, 220]} />
              <meshBasicMaterial
                color="#4df0ff"
                transparent
                opacity={0.5}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[0, 2.35, 0]}>
              <octahedronGeometry args={[0.055, 0]} />
              <meshBasicMaterial color="#e9edfb" toneMapped={false} />
            </mesh>
          </group>
        )}

        {/* Small floating tech fragments */}
        {!simplified && (
          <group ref={nodesRef} rotation={[0.3, 0, 0.2]}>
            <mesh position={[1.6, 0.9, -0.4]}>
              <tetrahedronGeometry args={[0.06]} />
              <meshBasicMaterial color="#4df0ff" toneMapped={false} />
            </mesh>
            <mesh position={[-1.8, 0.5, 0.3]}>
              <tetrahedronGeometry args={[0.05]} />
              <meshBasicMaterial color="#8b5cf6" toneMapped={false} />
            </mesh>
            <mesh position={[-0.6, -1.1, 0.8]}>
              <tetrahedronGeometry args={[0.045]} />
              <meshBasicMaterial color="#ff5ea8" toneMapped={false} />
            </mesh>
            <mesh position={[1.2, -0.8, -0.9]}>
              <tetrahedronGeometry args={[0.055]} />
              <meshBasicMaterial color="#e9edfb" toneMapped={false} />
            </mesh>
          </group>
        )}
      </group>
    </>
  )
}
