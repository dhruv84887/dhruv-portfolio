import { useEffect, useRef, useState } from 'react'

import { monogram, navigation, siteConfig } from '../../data/portfolio.js'
import { useScrollPosition } from '../../animations/index.js'
import styles from './Navbar.module.css'

/**
 * Floating futuristic navbar: glass pill, "DH" logo, scroll-spy
 * active indicator, and a full-screen staggered mobile menu.
 * Uses plain hash anchors — browser back/forward stay natural.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [activeTarget, setActiveTarget] = useState('home')
  const scrolled = useScrollPosition(24)
  const visibleRef = useRef(new Set())

  // Scroll spy (read-only observation — never touches history).
  // Sections may mount later (lazy chunks), so re-scan on DOM changes.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined

    const observed = new Set()
    let scanQueued = false

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visibleRef.current.add(entry.target.id)
          else visibleRef.current.delete(entry.target.id)
        }
        const active = navigation.find((item) =>
          visibleRef.current.has(item.href.slice(1)),
        )
        if (active) setActiveTarget(active.href.slice(1))
      },
      { rootMargin: '-38% 0px -55% 0px', threshold: 0 },
    )

    const ensureObserving = () => {
      scanQueued = false
      for (const item of navigation) {
        const id = item.href.slice(1)
        if (observed.has(id)) continue
        const section = document.getElementById(id)
        if (!section) continue
        observed.add(id)
        observer.observe(section)
      }
    }

    ensureObserving()

    const root = document.getElementById('root')
    const mutationObserver = new MutationObserver(() => {
      if (scanQueued) return
      scanQueued = true
      window.requestAnimationFrame(ensureObserving)
    })
    if (root) {
      mutationObserver.observe(root, { childList: true, subtree: true })
    }

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  // Keep the indicator in sync with the URL hash (incl. back/forward)
  useEffect(() => {
    const syncFromHash = () => {
      const id = window.location.hash.slice(1)
      if (id && navigation.some((item) => item.href.slice(1) === id)) {
        setActiveTarget(id)
      }
    }
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  // Lock background scroll while the mobile menu is open
  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  // Escape closes the menu
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Close the menu if the viewport becomes desktop-wide
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      if (media.matches) setOpen(false)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const closeMenu = () => setOpen(false)

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.bar}>
        <a
          href="#home"
          className={styles.brand}
          aria-label={`${siteConfig.name} — back to top`}
        >
          <span className={styles.mark}>{monogram}</span>
        </a>

        <nav className={styles.desktopNav} aria-label="Primary">
          {navigation.map((item) => {
            const isActive = activeTarget === item.href.slice(1)
            return (
              <a
                key={item.id}
                href={item.href}
                className={`${styles.link} ${
                  isActive ? styles.linkActive : ''
                }`}
                aria-current={isActive ? 'location' : undefined}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <a
          href={`mailto:${siteConfig.email}`}
          className={`btn btn--primary ${styles.cta}`}
        >
          Let’s talk
        </a>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.toggleBars} aria-hidden="true">
            <span className={styles.bar1} />
            <span className={styles.bar2} />
            <span className={styles.bar3} />
          </span>
        </button>
      </div>

      {/* Full-screen glass menu (below 1024px) */}
      <div
        id="mobile-menu"
        className={`${styles.mobile} ${open ? styles.mobileOpen : ''}`}
        aria-hidden={!open}
      >
        <nav className={styles.mobileNav} aria-label="Mobile">
          {navigation.map((item, index) => {
            const isActive = activeTarget === item.href.slice(1)
            return (
              <a
                key={item.id}
                href={item.href}
                className={`${styles.mobileLink} ${
                  isActive ? styles.mobileLinkActive : ''
                }`}
                style={{ '--i': index }}
                onClick={closeMenu}
              >
                <span className={styles.mobileIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className={styles.mobileActions}>
          <a
            href={`mailto:${siteConfig.email}`}
            className="btn btn--primary"
            onClick={closeMenu}
          >
            Let’s talk
          </a>
          <p className={styles.mobileNote}>{siteConfig.role}</p>
        </div>
      </div>
    </header>
  )
}
