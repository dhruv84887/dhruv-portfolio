import { Suspense, lazy, useEffect } from 'react'

import Layout from './components/layout/Layout.jsx'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import Hero from './sections/Hero/Hero.jsx'
import styles from './App.module.css'

// Non-hero sections stream in as separate chunks after first paint.
const Skills = lazy(() => import('./sections/Skills/Skills.jsx'))
const About = lazy(() => import('./sections/About/About.jsx'))
const Journey = lazy(() => import('./sections/Journey/Journey.jsx'))
const Projects = lazy(() => import('./sections/Projects/Projects.jsx'))
const Contact = lazy(() => import('./sections/Contact/Contact.jsx'))

/**
 * App shell — the main UI renders immediately (no loading screen).
 * Hero UI ships in the entry bundle; its three.js scene and the other
 * sections load as dynamic chunks without blocking first paint.
 */
export default function App() {
  // Honor a deep-link hash after lazy sections mount
  // (e.g. refreshing the page while on #skills)
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash || hash.startsWith('project-')) return undefined

    let frame = 0
    let attempts = 0
    const scrollToTarget = () => {
      const target = document.getElementById(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'instant', block: 'start' })
        return
      }
      if (attempts < 120) {
        attempts += 1
        frame = window.requestAnimationFrame(scrollToTarget)
      }
    }
    frame = window.requestAnimationFrame(scrollToTarget)

    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <div className={styles.app}>
      <Layout>
        <ErrorBoundary>
          <Hero />
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Skills />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <About />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Journey />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Projects />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Contact />
          </Suspense>
        </ErrorBoundary>
      </Layout>
    </div>
  )
}
