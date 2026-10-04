import { Fragment, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'

import {
  useCountUp,
  usePrefersReducedMotion,
  useReveal,
  useTilt,
} from '../../animations/index.js'
import { about, hasValidUrl, profile } from '../../data/portfolio.js'
import ErrorBoundary from '../../components/common/ErrorBoundary.jsx'
import DeveloperScene from '../../components/three/DeveloperScene.jsx'
import ParticleField from '../../components/three/ParticleField.jsx'
import SceneRuntime from '../../components/three/SceneRuntime.jsx'
import styles from './About.module.css'

const highlights = about.highlights
const stats = about.stats

/** Decorative code glyphs floating inside the 3D visual panel. */
const codeSymbols = [
  { text: '{ }', pos: { top: '9%', left: '7%' }, depth: '14px', delay: '0s' },
  {
    text: '</>',
    pos: { top: '15%', right: '8%' },
    depth: '10px',
    delay: '-1.4s',
    tone: 'violet',
  },
  { text: '[]', pos: { bottom: '26%', left: '5%' }, depth: '17px', delay: '-2.8s' },
  {
    text: '=>',
    pos: { top: '47%', right: '4%' },
    depth: '9px',
    delay: '-0.7s',
    tone: 'violet',
  },
  { text: '#', pos: { bottom: '13%', right: '16%' }, depth: '15px', delay: '-2.1s' },
  {
    text: '();',
    pos: { top: '63%', left: '9%' },
    depth: '12px',
    delay: '-3.5s',
    tone: 'violet',
  },
]

function HighlightCard({ item, index, reduced }) {
  const cardRef = useTilt({ max: 7, scale: 1.04, disabled: reduced })

  return (
    <li
      className={styles.highlightItem}
      data-reveal
      style={{ '--reveal-delay': `${380 + index * 70}ms` }}
    >
      <div className={styles.highlight} ref={cardRef}>
        <span className={`text-gradient ${styles.highlightIndex}`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className={styles.highlightText}>{item}</span>
      </div>
    </li>
  )
}

function Stat({ target, label, reduced }) {
  const isCounter = target !== null
  const { ref, value } = useCountUp(isCounter ? target : 0, {
    enabled: isCounter && !reduced,
  })
  const display = isCounter ? `${String(value).padStart(2, '0')}+` : '∞'

  return (
    <li className={styles.stat} ref={ref}>
      <span className={styles.statValue}>{display}</span>
      <span className={styles.statLabel}>{label}</span>
    </li>
  )
}

export default function About() {
  const reduced = usePrefersReducedMotion()
  const sectionRef = useReveal({ rootMargin: '0px' })
  const visualRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [inView, setInView] = useState(false)

  // Responsive breakpoint — reduces particles / heavy 3D on mobile
  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)')
    const onChange = () => setIsMobile(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  // Pause the WebGL loop while the visual is offscreen (performance)
  useEffect(() => {
    const el = visualRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Cursor spotlight + shared pointer-parallax vars for this section
  useEffect(() => {
    if (reduced) return undefined
    const section = sectionRef.current
    if (!section) return undefined

    let frame = 0
    const onPointerMove = (event) => {
      if (event.pointerType !== 'mouse' || frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const rect = section.getBoundingClientRect()
        section.style.setProperty('--sx', `${event.clientX - rect.left}px`)
        section.style.setProperty('--sy', `${event.clientY - rect.top}px`)
        section.style.setProperty('--spot', '1')
        section.style.setProperty(
          '--px',
          ((event.clientX / window.innerWidth) * 2 - 1).toFixed(3),
        )
        section.style.setProperty(
          '--py',
          ((event.clientY / window.innerHeight) * 2 - 1).toFixed(3),
        )
      })
    }
    const onPointerLeave = () => section.style.setProperty('--spot', '0')

    section.addEventListener('pointermove', onPointerMove, { passive: true })
    section.addEventListener('pointerleave', onPointerLeave)
    return () => {
      section.removeEventListener('pointermove', onPointerMove)
      section.removeEventListener('pointerleave', onPointerLeave)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [reduced])

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`section ${styles.about}`}
      aria-labelledby="about-title"
    >
      <div className={styles.gridLayer} aria-hidden="true" />
      <div className={styles.lighting} aria-hidden="true" />
      <div className={styles.spotlight} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        {/* Left: futuristic 3D developer visual */}
        <div
          className={styles.visual}
          ref={visualRef}
          data-reveal
          style={{ '--reveal-delay': '150ms' }}
        >
          <div className={styles.perspectiveGrid} aria-hidden="true" />
          <div className={styles.visualGlow} aria-hidden="true" />

          <div className={styles.canvasWrap}>
            <ErrorBoundary>
              <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 6], fov: 45 }}
                gl={{
                  antialias: true,
                  alpha: true,
                  powerPreference: 'high-performance',
                }}
                frameloop="demand"
              >
                <DeveloperScene animate={!reduced} simplified={isMobile} />
                <ParticleField
                  count={isMobile ? 25 : 70}
                  radius={4}
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

          <div className={styles.symbols} aria-hidden="true">
            {codeSymbols.map((symbol) => (
              <span
                key={symbol.text}
                className={`${styles.symbol} ${
                  symbol.tone === 'violet' ? styles.violet : ''
                }`}
                style={{
                  ...symbol.pos,
                  '--depth': symbol.depth,
                  '--sdelay': symbol.delay,
                }}
              >
                <span className={styles.symbolGlyph}>{symbol.text}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right: about content */}
        <div className={styles.content}>
          <p
            className={styles.label}
            data-reveal
            style={{ '--reveal-delay': '0ms' }}
          >
            <span className={styles.labelLine} aria-hidden="true" />
            About Me
          </p>

          <h2
            id="about-title"
            className={styles.title}
            data-reveal
            style={{ '--reveal-delay': '100ms' }}
          >
            Turning Ideas Into{' '}
            <span className="text-gradient">Digital Experiences.</span>
          </h2>

          {about.paragraphs.map((paragraph, pIndex) => (
            <p
              key={pIndex}
              className={styles.paragraph}
              data-reveal
              style={{ '--reveal-delay': `${200 + pIndex * 90}ms` }}
            >
              {paragraph.segments.map((segment, sIndex) =>
                typeof segment === 'string' ? (
                  <Fragment key={sIndex}>{segment}</Fragment>
                ) : (
                  <span key={sIndex} className={styles.term}>
                    {segment.term}
                  </span>
                ),
              )}
            </p>
          ))}

          {hasValidUrl(profile.resumeUrl) && (
            <div
              className={styles.resume}
              data-reveal
              style={{ '--reveal-delay': '340ms' }}
            >
              <a
                className="btn btn--primary"
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
              >
                Download Resume
                <span className="btn-arrow" aria-hidden="true">
                  ↓
                </span>
              </a>
            </div>
          )}

          <ul className={styles.highlights}>
            {highlights.map((item, index) => (
              <HighlightCard
                key={item}
                item={item}
                index={index}
                reduced={reduced}
              />
            ))}
          </ul>

          <ul
            className={styles.stats}
            data-reveal
            style={{ '--reveal-delay': '760ms' }}
            aria-label="Quick stats"
          >
            {stats.map((stat) => (
              <Stat
                key={stat.label}
                target={stat.target}
                label={stat.label}
                reduced={reduced}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
