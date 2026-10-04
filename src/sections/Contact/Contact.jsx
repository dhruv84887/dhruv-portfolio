import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'

import { usePrefersReducedMotion, useReveal } from '../../animations/index.js'
import { visibleContactLinks } from '../../data/portfolio.js'
import ErrorBoundary from '../../components/common/ErrorBoundary.jsx'
import ContactObject from '../../components/three/ContactObject.jsx'
import ParticleField from '../../components/three/ParticleField.jsx'
import SceneRuntime from '../../components/three/SceneRuntime.jsx'
import ContactForm from './ContactForm.jsx'
import styles from './Contact.module.css'

/** Decorative floating particles (hand-tuned positions). */
const particles = [
  { left: '6%', top: '14%', size: 3, delay: '0s', dur: '13s' },
  { left: '24%', top: '70%', size: 2, delay: '-4s', dur: '15s' },
  { left: '44%', top: '32%', size: 2, delay: '-7s', dur: '12s' },
  { left: '64%', top: '84%', size: 3, delay: '-2s', dur: '14s' },
  { left: '80%', top: '24%', size: 2, delay: '-9s', dur: '16s' },
  { left: '92%', top: '62%', size: 3, delay: '-5s', dur: '12s' },
]

export default function Contact() {
  const reduced = usePrefersReducedMotion()
  const sectionRef = useReveal({ rootMargin: '0px' })
  const visualRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [inView, setInView] = useState(false)

  // Mobile breakpoint — reduces heavy 3D effects
  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)')
    const onChange = () => setIsMobile(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  // Pause the WebGL loop while the visual is offscreen (performance)
  useEffect(() => {
    const visual = visualRef.current
    if (!visual || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(visual)
    return () => observer.disconnect()
  }, [])

  // Cursor-following spotlight inside this section
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
      id="contact"
      ref={sectionRef}
      className={`section ${styles.contact}`}
      aria-labelledby="contact-title"
    >
      <div className={styles.gridLayer} aria-hidden="true" />
      <div className={styles.lighting} aria-hidden="true" />
      <div className={styles.spotlight} aria-hidden="true" />
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
            <span aria-hidden="true">//</span> get in touch
          </p>

          <h2
            id="contact-title"
            className={styles.heading}
            data-reveal
            style={{ '--reveal-delay': '90ms' }}
          >
            Let&rsquo;s Build{' '}
            <span className="text-gradient">Something Amazing</span>
          </h2>

          <p
            className={styles.subtitle}
            data-reveal
            style={{ '--reveal-delay': '180ms' }}
          >
            Have an idea, project or collaboration in mind? Let&rsquo;s connect.
          </p>
        </header>

        <div className={styles.grid}>
          {/* Left: 3D communication visual + contact links */}
          <div className={styles.visualCol}>
            <div
              className={styles.visual}
              ref={visualRef}
              data-reveal
              aria-hidden="true"
              style={{ '--reveal-delay': '150ms' }}
            >
              <div className={styles.visualGlow} aria-hidden="true" />
              <div className={styles.canvasWrap}>
                <ErrorBoundary>
                  <Canvas
                    dpr={[1, 1.5]}
                    camera={{ position: [0, 0, 6.4], fov: 45 }}
                    gl={{
                      antialias: true,
                      alpha: true,
                      powerPreference: 'high-performance',
                    }}
                    frameloop="demand"
                  >
                    <ContactObject animate={!reduced} />
                    <ParticleField
                      count={isMobile ? 20 : 60}
                      radius={3.6}
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

            <ul
              className={styles.links}
              aria-label="Contact links"
              data-reveal
              style={{ '--reveal-delay': '300ms' }}
            >
              {/* Only links with a real URL render — placeholders stay hidden */}
              {visibleContactLinks.map((link) => {
                const isExternal = link.href.startsWith('http')
                return (
                  <li key={link.id}>
                    <a
                      className={styles.link}
                      href={link.href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noreferrer' : undefined}
                    >
                      <span className={styles.linkGlyph} aria-hidden="true">
                        {link.glyph}
                      </span>
                      {link.label}
                      <span className={styles.linkArrow} aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Right: premium contact form */}
          <div
            className={styles.formCol}
            data-reveal
            style={{ '--reveal-delay': '260ms' }}
          >
            <div className={styles.formPanel}>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
