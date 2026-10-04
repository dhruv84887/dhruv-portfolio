import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'

import {
  useInView,
  usePrefersReducedMotion,
  useReveal,
  useTilt,
} from '../../animations/index.js'
import { skillCategories } from '../../data/portfolio.js'
import ErrorBoundary from '../../components/common/ErrorBoundary.jsx'
import SkillsCore from '../../components/three/SkillsCore.jsx'
import ParticleField from '../../components/three/ParticleField.jsx'
import SceneRuntime from '../../components/three/SceneRuntime.jsx'
import styles from './Skills.module.css'

/** Polar position (in stage %) for a chip within an orbit of `total`. */
function orbitPosition(index, total) {
  const angle = ((-90 + (360 / total) * index) * Math.PI) / 180
  return {
    x: 50 + 36 * Math.cos(angle),
    y: 50 + 36 * Math.sin(angle),
  }
}

function SkillChip({ skill, index, total, tiltDisabled }) {
  const cardRef = useTilt({ max: 9, scale: 1.05, disabled: tiltDisabled })
  const position = orbitPosition(index, total)

  return (
    <li
      className={styles.orbitItem}
      style={{
        left: `${position.x.toFixed(2)}%`,
        top: `${position.y.toFixed(2)}%`,
        '--i': index,
        '--depth': `${8 + (index % 3) * 3}px`,
        '--reveal-delay': `${420 + index * 70}ms`,
      }}
    >
      <div className={styles.chipWrap} data-reveal>
        <div className={styles.chip}>
          <div className={styles.card} ref={cardRef}>
            <span className={styles.chipMark} aria-hidden="true" />
            <span className={styles.chipLabel}>{skill}</span>
          </div>
        </div>
      </div>
    </li>
  )
}

export default function Skills() {
  const [active, setActive] = useState(skillCategories[0].id)
  const [isMobile, setIsMobile] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const sectionRef = useReveal({ rootMargin: '0px', watch: [active] })
  const inView = useInView(sectionRef, { rootMargin: '240px 0px' })
  const stageRef = useRef(null)

  // Mobile breakpoint — scales the particle field down like the other scenes
  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)')
    const onChange = () => setIsMobile(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const category =
    skillCategories.find((item) => item.id === active) ?? skillCategories[0]

  const positions = useMemo(
    () =>
      category.skills.map((_, index) =>
        orbitPosition(index, category.skills.length),
      ),
    [category],
  )

  // Smooth mouse-follow parallax for the floating constellation
  useEffect(() => {
    if (reducedMotion) return undefined

    let frame = 0
    const onPointerMove = (event) => {
      if (event.pointerType !== 'mouse' || frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const stage = stageRef.current
        if (!stage) return
        const nx = (event.clientX / window.innerWidth) * 2 - 1
        const ny = (event.clientY / window.innerHeight) * 2 - 1
        stage.style.setProperty('--px', nx.toFixed(3))
        stage.style.setProperty('--py', ny.toFixed(3))
      })
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [reducedMotion])

  // Toolbar arrow-key navigation between category filters
  const onFilterKeyDown = (event, index) => {
    const count = skillCategories.length
    let next = null
    if (event.key === 'ArrowRight') next = (index + 1) % count
    else if (event.key === 'ArrowLeft') next = (index - 1 + count) % count
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = count - 1
    if (next === null) return

    event.preventDefault()
    const buttons =
      event.currentTarget.parentElement.querySelectorAll('[role="button"]')
    buttons[next]?.focus()
  }

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={`section ${styles.skills}`}
      aria-labelledby="skills-title"
    >
      <div className="container">
        <header className={styles.header}>
          <p className="eyebrow" data-reveal style={{ '--reveal-delay': '0ms' }}>
            <span aria-hidden="true">//</span> tech stack
          </p>

          <h2
            id="skills-title"
            className={styles.title}
            data-reveal
            style={{ '--reveal-delay': '90ms' }}
          >
            Skills &amp; <span className="text-gradient">Technologies</span>
          </h2>

          <p
            className={styles.subtitle}
            data-reveal
            style={{ '--reveal-delay': '180ms' }}
          >
            Tools and technologies I use to build modern digital experiences.
          </p>

          <div
            className={styles.tabsWrap}
            data-reveal
            style={{ '--reveal-delay': '270ms' }}
          >
            <div
              className={styles.tabs}
              role="toolbar"
              aria-label="Filter skills by category"
            >
              {skillCategories.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={item.id === active}
                  className={styles.tab}
                  onClick={() => setActive(item.id)}
                  onKeyDown={(event) => onFilterKeyDown(event, index)}
                >
                  {item.label}
                  <span className={styles.tabCount}>{item.skills.length}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        <div
          className={styles.stage}
          ref={stageRef}
          data-reveal
          style={{ '--reveal-delay': '360ms' }}
        >
          {/* Glowing data-flow connections: core → skill chips */}
          <div className={styles.connections} aria-hidden="true">
            <svg width="100%" height="100%">
              <g key={active}>
                {positions.map((point, index) => (
                  <line
                    key={category.skills[index]}
                    className={styles.connection}
                    x1="50%"
                    y1="50%"
                    x2={`${point.x.toFixed(2)}%`}
                    y2={`${point.y.toFixed(2)}%`}
                    style={{ '--i': index }}
                  />
                ))}
              </g>
            </svg>
          </div>

          {/* 3D knowledge core + floating particles */}
          <div className={styles.coreVisual} aria-hidden="true">
            <div className={styles.stageGlow} />
            <div className={styles.canvasWrap}>
            <ErrorBoundary>
              <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{
                  antialias: true,
                  alpha: true,
                  powerPreference: 'high-performance',
                }}
                frameloop="demand"
              >
                <SkillsCore animate={!reducedMotion} />
                <ParticleField
                  count={isMobile ? 30 : 80}
                  radius={3.2}
                  size={0.05}
                  animate={!reducedMotion}
                />
                <SceneRuntime
                  enabled={inView}
                  burst={reducedMotion ? 0 : 2400}
                  interactive={!reducedMotion}
                />
              </Canvas>
            </ErrorBoundary>
            </div>
          </div>

          {/* Floating skill constellation / mobile grid */}
          <ul className={styles.orbit} aria-label={`${category.label} skills`}>
            {category.skills.map((skill, index) => (
              <SkillChip
                key={`${category.id}-${skill}`}
                skill={skill}
                index={index}
                total={category.skills.length}
                tiltDisabled={reducedMotion}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
