import { Canvas } from '@react-three/fiber'

import HeroObject from '../../components/three/HeroObject.jsx'
import ParticleField from '../../components/three/ParticleField.jsx'
import SceneRuntime from '../../components/three/SceneRuntime.jsx'
import styles from './Hero.module.css'

/**
 * Hero 3D scene — loaded via dynamic import AFTER the hero UI is
 * visible. Renders a short entrance burst, then goes fully idle
 * (demand-based) and only redraws while the pointer is over it.
 */
export default function HeroScene({ inView = true, reduced = false }) {
  return (
    <div className={styles.canvasWrap}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 46 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        frameloop="demand"
      >
        <HeroObject animate={!reduced} />
        <ParticleField
          count={90}
          radius={3.6}
          size={0.045}
          animate={!reduced}
        />
        <SceneRuntime
          enabled={inView}
          burst={reduced ? 0 : 2600}
          interactive={!reduced}
        />
      </Canvas>
    </div>
  )
}
