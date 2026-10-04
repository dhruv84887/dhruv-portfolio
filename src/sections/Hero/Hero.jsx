import { Fragment, Suspense, lazy } from 'react'

import {
  useInView,
  usePrefersReducedMotion,
  useReveal,
} from '../../animations/index.js'
import { hasValidUrl, profile } from '../../data/portfolio.js'
import ErrorBoundary from '../../components/common/ErrorBoundary.jsx'
import styles from './Hero.module.css'

// The heavy three.js scene loads only after the hero UI has painted.
const HeroScene = lazy(() => import('./HeroScene.jsx'))

/** Words of the animated second line; the closing "Code & AI." glows. */
const SUBLINE_WORDS = profile.heroSubline.split(' ')
const SUBLINE_ACCENT_FROM = Math.max(0, SUBLINE_WORDS.length - 3)

/**
 * #home — full-screen cinematic intro.
 * Text reveals in a staggered sequence; the 3D centerpiece reacts
 * to the mouse; motion respects prefers-reduced-motion.
 * All motion here is CSS-driven — no extra runtime work.
 */
export default function Hero() {
  const sectionRef = useReveal({ rootMargin: '0px' })
  const reducedMotion = usePrefersReducedMotion()
  const inView = useInView(sectionRef, { rootMargin: '240px 0px' })
  // Resume CTA becomes a real download link once profile.resumeUrl is
  // set; until then it renders a muted "soon" state — never a dead link.
  const resumeReady = hasValidUrl(profile.resumeUrl)

  return (
    <section
      id="home"
      ref={sectionRef}
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div className={styles.inner}>
        <div className={styles.content}>
          <p
            className={styles.badge}
            data-reveal
            style={{ '--reveal-delay': '40ms' }}
          >
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeText}>{profile.badge}</span>
          </p>

          <h1
            id="hero-title"
            className={styles.title}
            data-reveal
            style={{ '--reveal-delay': '120ms' }}
          >
            Hi, I&rsquo;m{' '}
            <span className="text-gradient">{`${profile.name}.`}</span>
          </h1>

          <h2 className={styles.subline} aria-label={profile.heroSubline}>
            {SUBLINE_WORDS.map((word, index) => (
              <Fragment key={`${word}-${index}`}>
                {index > 0 ? ' ' : null}
                <span
                  className={
                    index >= SUBLINE_ACCENT_FROM
                      ? `${styles.sublineWord} ${styles.sublineAccent}`
                      : styles.sublineWord
                  }
                  data-reveal
                  aria-hidden="true"
                  style={{ '--reveal-delay': `${220 + index * 55}ms` }}
                >
                  {word}
                </span>
              </Fragment>
            ))}
          </h2>

          <p
            className={styles.lede}
            data-reveal
            style={{ '--reveal-delay': '600ms' }}
          >
            {profile.heroTagline}
          </p>

          <div
            className={styles.actions}
            data-reveal
            style={{ '--reveal-delay': '680ms' }}
          >
            <a href="#work" className="btn btn--primary">
              Explore My Work
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </a>
            {resumeReady ? (
              <a
                className="btn"
                href={profile.resumeUrl}
                download
                target="_blank"
                rel="noreferrer"
              >
                Download Resume
              </a>
            ) : (
              <button
                type="button"
                className={`btn ${styles.resumeSoon}`}
                disabled
                title="Resume will be available soon"
              >
                Download Resume
                <span className={styles.soonChip}>soon</span>
              </button>
            )}
          </div>

          <p
            className={styles.status}
            data-reveal
            style={{ '--reveal-delay': '760ms' }}
          >
            <span className={styles.statusDot} aria-hidden="true" />
            {profile.availability}
          </p>
        </div>

        <div
          className={styles.visual}
          data-reveal
          aria-hidden="true"
          style={{ '--reveal-delay': '300ms' }}
        >
          <div className={styles.glow} />
          <ErrorBoundary>
            <Suspense fallback={null}>
              <HeroScene inView={inView} reduced={reducedMotion} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      <a
        href="#work"
        className={styles.scroll}
        data-reveal
        style={{ '--reveal-delay': '880ms' }}
        aria-label="Scroll to my work"
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollTrack} aria-hidden="true">
          <span className={styles.scrollDot} />
        </span>
      </a>
    </section>
  )
}
