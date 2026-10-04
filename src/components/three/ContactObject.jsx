import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { usePointerPosition } from '../../animations/index.js'

/** Anchor points for connection lines / floating nodes. */
const ANCHORS = [
  [-1.7, 0.95, 0.4], // cyan bubble
  [1.75, -0.75, 0.3], // violet bubble
  [1.6, 1.3, -0.6], // orbit node
  [-1.5, -1.15, -0.4], // orbit node
]

function roundedRectGeometry(width, height, radius) {
  const x = -width / 2
  const y = -height / 2
  const shape = new THREE.Shape()
  shape.moveTo(x + radius, y)
  shape.lineTo(x + width - radius, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + radius)
  shape.lineTo(x + width, y + height - radius)
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  shape.lineTo(x + radius, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - radius)
  shape.lineTo(x, y + radius)
  shape.quadraticCurveTo(x, y, x + radius, y)
  return new THREE.ShapeGeometry(shape)
}

/**
 * Communication visual: glowing sphere core, floating holographic
 * chat bubbles, connection lines with travelling light pulses and
 * orbiting nodes. Slow rotation + mouse-follow parallax.
 */
export default function ContactObject({ animate = true }) {
  const tiltRef = useRef(null)
  const spinRef = useRef(null)
  const coreRef = useRef(null)
  const ringRef = useRef(null)
  const bubbleARef = useRef(null)
  const bubbleBRef = useRef(null)
  const pulseRefs = useRef([])
  const pointer = usePointerPosition(animate)

  const bubbleA = useMemo(() => roundedRectGeometry(1.7, 1.0, 0.24), [])
  const bubbleB = useMemo(() => roundedRectGeometry(1.35, 0.8, 0.22), [])
  const bubbleAEdges = useMemo(() => new THREE.EdgesGeometry(bubbleA), [bubbleA])
  const bubbleBEdges = useMemo(() => new THREE.EdgesGeometry(bubbleB), [bubbleB])
  const lineGeometries = useMemo(
    () =>
      ANCHORS.map(
        (anchor) =>
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(...anchor),
          ]),
      ),
    [],
  )

  useEffect(
    () => () => {
      bubbleA.dispose()
      bubbleB.dispose()
      bubbleAEdges.dispose()
      bubbleBEdges.dispose()
      lineGeometries.forEach((geometry) => geometry.dispose())
    },
    [bubbleA, bubbleB, bubbleAEdges, bubbleBEdges, lineGeometries],
  )

  useFrame((state, delta) => {
    if (!animate) return
    const d = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime

    if (spinRef.current) spinRef.current.rotation.y += d * 0.08
    if (ringRef.current) ringRef.current.rotation.z += d * 0.16

    if (coreRef.current && coreRef.current.material) {
      coreRef.current.material.emissiveIntensity =
        0.5 + Math.sin(t * 1.5) * 0.28
    }

    // Floating holographic bubbles
    if (bubbleARef.current) {
      bubbleARef.current.position.y = 0.95 + Math.sin(t * 0.9) * 0.14
      bubbleARef.current.rotation.y = Math.sin(t * 0.5) * 0.12
    }
    if (bubbleBRef.current) {
      bubbleBRef.current.position.y = -0.75 + Math.sin(t * 0.9 + 1.6) * 0.12
      bubbleBRef.current.rotation.y = Math.sin(t * 0.5 + 1) * 0.1
    }

    // Travelling light pulses along the connection lines
    pulseRefs.current.forEach((pulse, index) => {
      if (!pulse) return
      const anchor = ANCHORS[index]
      if (!anchor) return
      const travel = (Math.sin(t * (0.55 + index * 0.12) + index * 1.8) + 1) / 2
      pulse.position.set(
        anchor[0] * travel,
        anchor[1] * travel,
        anchor[2] * travel,
      )
    })

    // Mouse-follow parallax
    if (tiltRef.current) {
      const { x, y } = pointer.current
      tiltRef.current.rotation.y +=
        (x * 0.28 - tiltRef.current.rotation.y) * 0.05
      tiltRef.current.rotation.x +=
        (y * 0.16 - tiltRef.current.rotation.x) * 0.05
      tiltRef.current.position.y = Math.sin(t * 0.7) * 0.06
    }
  })

  return (
    <>
      {/* Soft neon lighting rig */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 5, 6]} intensity={2} color="#eaf6ff" />
      <directionalLight
        position={[-5, 1, -4]}
        intensity={1.3}
        color="#8b5cf6"
      />
      <pointLight position={[-3, 2, 3]} intensity={24} color="#4df0ff" />
      <pointLight position={[3, -2, 2]} intensity={20} color="#8b5cf6" />

      <group ref={tiltRef}>
        <group ref={spinRef}>
          {/* Glowing sphere core */}
          <mesh ref={coreRef}>
            <sphereGeometry args={[0.95, 32, 32]} />
            <meshStandardMaterial
              color="#0b1226"
              metalness={0.6}
              roughness={0.25}
              emissive="#4df0ff"
              emissiveIntensity={0.55}
            />
          </mesh>
          <mesh scale={1.03}>
            <sphereGeometry args={[0.95, 18, 18]} />
            <meshBasicMaterial
              color="#4df0ff"
              wireframe
              transparent
              opacity={0.12}
              toneMapped={false}
            />
          </mesh>

          {/* Connection lines */}
          {lineGeometries.map((geometry, index) => (
            <lineSegments key={index} geometry={geometry}>
              <lineBasicMaterial
                color="#4df0ff"
                transparent
                opacity={0.3}
                toneMapped={false}
              />
            </lineSegments>
          ))}

          {/* Travelling light pulses */}
          {ANCHORS.slice(0, 3).map((_, index) => (
            <mesh
              key={index}
              ref={(el) => {
                pulseRefs.current[index] = el
              }}
            >
              <sphereGeometry args={[0.055, 12, 12]} />
              <meshBasicMaterial color="#eafcff" toneMapped={false} />
            </mesh>
          ))}

          {/* Holographic message bubbles */}
          <group ref={bubbleARef} position={[-1.7, 0.95, 0.4]}>
            <mesh geometry={bubbleA}>
              <meshBasicMaterial
                color="#4df0ff"
                transparent
                opacity={0.14}
                side={THREE.DoubleSide}
                toneMapped={false}
              />
            </mesh>
            <lineSegments geometry={bubbleAEdges}>
              <lineBasicMaterial
                color="#4df0ff"
                transparent
                opacity={0.85}
                toneMapped={false}
              />
            </lineSegments>
            {/* Typing indicator dots */}
            {[-0.45, -0.18, 0.09].map((x) => (
              <mesh key={x} position={[x, 0, 0.03]}>
                <circleGeometry args={[0.07, 16]} />
                <meshBasicMaterial
                  color="#4df0ff"
                  transparent
                  opacity={0.9}
                  toneMapped={false}
                />
              </mesh>
            ))}
          </group>

          <group ref={bubbleBRef} position={[1.75, -0.75, 0.3]}>
            <mesh geometry={bubbleB}>
              <meshBasicMaterial
                color="#8b5cf6"
                transparent
                opacity={0.14}
                side={THREE.DoubleSide}
                toneMapped={false}
              />
            </mesh>
            <lineSegments geometry={bubbleBEdges}>
              <lineBasicMaterial
                color="#8b5cf6"
                transparent
                opacity={0.85}
                toneMapped={false}
              />
            </lineSegments>
            {/* Message line placeholders */}
            <mesh position={[-0.1, 0.14, 0.03]}>
              <planeGeometry args={[1.0, 0.08]} />
              <meshBasicMaterial
                color="#c9b8ff"
                transparent
                opacity={0.8}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[-0.32, -0.14, 0.03]}>
              <planeGeometry args={[0.55, 0.08]} />
              <meshBasicMaterial
                color="#c9b8ff"
                transparent
                opacity={0.6}
                toneMapped={false}
              />
            </mesh>
          </group>

          {/* Orbit ring with communication nodes */}
          <group ref={ringRef} rotation={[Math.PI / 2.6, 0.2, 0]}>
            <mesh>
              <torusGeometry args={[2.35, 0.01, 6, 128]} />
              <meshBasicMaterial
                color="#8b5cf6"
                transparent
                opacity={0.55}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[2.35, 0, 0]}>
              <sphereGeometry args={[0.07, 14, 14]} />
              <meshBasicMaterial color="#4df0ff" toneMapped={false} />
            </mesh>
            <mesh position={[-2.35, 0, 0]}>
              <sphereGeometry args={[0.07, 14, 14]} />
              <meshBasicMaterial color="#4df0ff" toneMapped={false} />
            </mesh>
          </group>
        </group>
      </group>
    </>
  )
}
