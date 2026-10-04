import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'

import { usePrefersReducedMotion, useReveal } from '../../animations/index.js'
import { journeyItems } from '../../data/portfolio.js'
import ErrorBoundary from '../../components/common/ErrorBoundary.jsx'
import JourneyObject from '../../components/three/JourneyObject.jsx'
import ParticleField from '../../components/three/ParticleField.jsx'
import SceneRuntime from '../../components/three/SceneRuntime.jsx'
import TimelineItem from './TimelineItem.jsx'
import styles from './Journey.module.css'

/** Decorative floating particles (hand-tuned positions). */
const particles = [
  { left: '5%', top: '12%', size: 3, delay: '0s', dur: '13s' },
  { left: '18%', top: '66%', size: 2, delay: '-4s', dur: '15s' },
  { left: '34%', top: '30%', size: 2, delay: '-7s', dur: '12s' },
  { left: '50%', top: '82%', size: 3, delay: '-2s', dur: '14s' },
  { left: '66%', top: '20%', size: 2, delay: '-9s', dur: '16s' },
  { left: '80%', top: '58%', size: 3, delay: '-5s', dur: '12s' },
  { left: '92%', top: '74%', size: 2, delay: '-1s', dur: '13s' },
]

export default function Journey() {
  const reduced = usePrefersReducedMotion()
  const sectionRef = useReveal({ rootMargin: '0px' })
  const timelineRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [inView, setInView] = useState(false)

  // Mobile breakpoint — reduces particles / 3D load
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const onChange = () => setIsMobile(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  // Pause the WebGL loop while the section is offscreen (performance)
  useEffect(() => {
    const section = sectionRef.current
    if (!section || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Progressive line drawing + sequential node activation + parallax
  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline) return undefined

    const nodes = Array.from(timeline.querySelectorAll('[data-node]'))

    if (reduced) {
      timeline.style.setProperty('--progress', '1')
      nodes.forEach((node) => node.classList.add('is-active'))
      return undefined
    }

    let thresholds = []
    const measure = () => {
      const total = timeline.offsetHeight || 1
      thresholds = nodes.map(
        (node) => (node.offsetTop + node.offsetHeight * 0.5) / total,
      )
    }
    measure()

    let ticking = false
    let lastProgress = -1
    let lastParallax = -1
    const activeState = nodes.map(() => false)

    const update = () => {
      ticking = false
      const rect = timeline.getBoundingClientRect()
      const anchor = window.innerHeight * 0.62
      const progress = Math.min(
        Math.max((anchor - rect.top) / (rect.height || 1), 0),
        1,
      )

      // Touch the DOM only when values actually change
      if (Math.abs(progress - lastProgress) > 0.0005) {
        lastProgress = progress
        timeline.style.setProperty('--progress', progress.toFixed(4))

        nodes.forEach((node, index) => {
          const threshold = thresholds[index] ?? index / nodes.length
          const active = progress >= threshold - 0.015
          if (active !== activeState[index]) {
            activeState[index] = active
            node.classList.toggle('is-active', active)
          }
        })

        // Subtle section parallax (lighting + 3D object drift)
        const section = sectionRef.current
        if (section) {
          const sectionRect = section.getBoundingClientRect()
          const value = Math.min(
            Math.max(
              (window.innerHeight - sectionRect.top) /
                (window.innerHeight + sectionRect.height),
              0,
            ),
            1,
          )
          if (Math.abs(value - lastParallax) > 0.002) {
            lastParallax = value
            section.style.setProperty('--sp', value.toFixed(4))
          }
        }
      }
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(update)
    }
    const onResize = () => {
      measure()
      update()
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [reduced])

  return (
    <section
      id="journey"
      ref={sectionRef}
      className={`section ${styles.journey}`}
      aria-labelledby="journey-title"
    >
      <div className={styles.gridLayer} aria-hidden="true" />
      <div className={styles.lighting} aria-hidden="true" />
      <div className={styles.particles} aria-hidden="true">
        {particles.map((particle, index) => (
          <span
            key={index}
            className={`${styles.particle} ${
              index % 2 ? styles.particleViolet : ''
            }`}
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              '--pdelay': particle.delay,
              '--pdur': particle.dur,
            }}
          />
        ))}
      </div>

      <div className="container">
        <header className={styles.header}>
          <p className="eyebrow" data-reveal style={{ '--reveal-delay': '0ms' }}>
            <span aria-hidden="true">//</span> education
          </p>

          <h2
            id="journey-title"
            className={styles.heading}
            data-reveal
            style={{ '--reveal-delay': '90ms' }}
          >
            My <span className="text-gradient">Journey</span>
          </h2>

          <p
            className={styles.subtitle}
            data-reveal
            style={{ '--reveal-delay': '180ms' }}
          >
            Learning, building and exploring technology step by step.
          </p>
        </header>

        <div className={styles.timelineWrap} ref={timelineRef}>
          {/* Futuristic 3D artifact floating behind the timeline */}
          <div className={styles.objectWrap} aria-hidden="true">
            <div className={styles.objectGlow} />
            <div className={styles.objectCanvas}>
            <ErrorBoundary>
              <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 6.2], fov: 42 }}
                gl={{
                  antialias: true,
                  alpha: true,
                  powerPreference: 'high-performance',
                }}
                frameloop="demand"
              >
                <JourneyObject animate={!reduced} />
                <ParticleField
                  count={isMobile ? 20 : 50}
                  radius={3.4}
                  size={0.045}
                  animate={!reduced}
                />
                <SceneRuntime
                  enabled={inView}
                  burst={reduced ? 0 : 2400}
                  interactive={!reduced}
                />
              </Canvas>
            </ErrorBoundary>
            </div>
          </div>

          {/* Progressively drawing timeline line */}
          <div className={styles.line} aria-hidden="true">
            <div className={styles.lineFill} />
            <div className={styles.lineTip} />
          </div>

          <ol className={styles.timeline}>
            {journeyItems.map((item, index) => (
              <TimelineItem
                key={item.id}
                item={item}
                index={index}
                side={index % 2 === 0 ? 'left' : 'right'}
                reduced={reduced}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
