import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import {
  hasValidUrl,
  projectGithubUrl,
  projectLiveUrl,
} from '../../data/portfolio.js'
import ProjectVisual from './ProjectVisual.jsx'
import styles from './Projects.module.css'

/**
 * Detailed project preview dialog with a smooth transition.
 * Backdrop click / ✕ / Escape close it; closing is driven by the
 * parent so browser-back navigation stays in sync with the hash.
 */
export default function ProjectModal({ project, onClose, reduced }) {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const timerRef = useRef(0)

  // Action buttons render only for real URLs — never broken links.
  const githubUrl = projectGithubUrl(project)
  const liveUrl = projectLiveUrl(project)
  const hasGithub = hasValidUrl(githubUrl)
  const hasLive = hasValidUrl(liveUrl)

  // Enter transition, scroll lock, initial focus
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setOpen(true))
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Remember what had focus so it can be restored on close.
    const previouslyFocused = document.activeElement
    closeRef.current?.focus()

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timerRef.current)
      document.body.style.overflow = previousOverflow
      // Return focus to the trigger instead of dropping it on <body>
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus()
      }
    }
  }, [])

  // Escape closes the dialog. Memoized so the listener is bound once
  // instead of being torn down and re-added on every render.
  const requestClose = useCallback(() => {
    if (closing) return
    if (reduced) {
      onClose()
      return
    }
    setClosing(true)
    setOpen(false)
    timerRef.current = window.setTimeout(() => onClose(), 320)
  }, [closing, reduced, onClose])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [requestClose])

  // Keep keyboard focus inside the dialog (Tab / Shift+Tab wrap)
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return
      const root = dialogRef.current
      if (!root) return

      const focusables = root.querySelectorAll(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables.length) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement

      if (!root.contains(active)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return createPortal(
    <div
      ref={dialogRef}
      className={`${styles.modal} ${open ? styles.modalOpen : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose()
      }}
    >
      <div className={styles.modalBackdrop} aria-hidden="true" />

      <div className={styles.modalPanel}>
        <header className={styles.modalHeader}>
          <span className={styles.modalEyebrow}>{project.category}</span>
          <button
            ref={closeRef}
            type="button"
            className={styles.modalClose}
            onClick={requestClose}
            aria-label="Close project preview"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </header>

        <div className={styles.modalHero}>
          <ProjectVisual project={project} />
        </div>

        <div className={styles.modalBody}>
          <h3 id="project-modal-title" className={styles.modalTitle}>
            {project.title}
          </h3>
          <p className={styles.modalDesc}>{project.description}</p>

          <p className={styles.modalLabel}>Technologies</p>
          <ul className={styles.badges}>
            {project.technologies.map((tech, techIndex) => (
              <li
                key={tech}
                className={styles.badge}
                style={{ '--b': techIndex }}
              >
                {tech}
              </li>
            ))}
          </ul>

          <p className={styles.modalLabel}>Screenshots</p>
          {project.screenshots && project.screenshots.length > 0 ? (
            <div className={styles.shots}>
              {project.screenshots.map((src, shotIndex) => (
                <figure key={src} className={styles.shot}>
                  <img
                    src={src}
                    alt={`${project.title} — screenshot ${shotIndex + 1}`}
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          ) : (
            <div className={styles.shots}>
              {[0, 1].map((shotIndex) => (
                <figure
                  key={shotIndex}
                  className={`${styles.shot} ${styles.shotPlaceholder}`}
                >
                  <span>
                    Screenshot placeholder
                    <br />
                    <code>src/data/portfolio.js</code>
                  </span>
                </figure>
              ))}
            </div>
          )}

          {(hasLive || hasGithub) && (
            <div className={styles.modalActions}>
              {hasLive && (
                <a
                  className="btn btn--primary"
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Demo
                  <span className="btn-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              )}
              {hasGithub && (
                <a
                  className="btn"
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
