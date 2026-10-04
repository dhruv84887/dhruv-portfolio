import { useEffect, useState } from 'react'

import { usePrefersReducedMotion, useReveal } from '../../animations/index.js'
import { projects } from '../../data/portfolio.js'
import ProjectCard from './ProjectCard.jsx'
import ProjectModal from './ProjectModal.jsx'
import styles from './Projects.module.css'

/** Decorative background particles (hand-tuned positions). */
const particles = [
  { left: '5%', top: '12%', size: 3, delay: '0s', dur: '12s' },
  { left: '22%', top: '70%', size: 2, delay: '-3s', dur: '14s' },
  { left: '42%', top: '30%', size: 2, delay: '-6s', dur: '11s' },
  { left: '60%', top: '82%', size: 3, delay: '-2s', dur: '15s' },
  { left: '76%', top: '22%', size: 2, delay: '-8s', dur: '13s' },
  { left: '88%', top: '62%', size: 3, delay: '-4s', dur: '12s' },
  { left: '94%', top: '40%', size: 2, delay: '-1.5s', dur: '14s' },
]

function isModalHash(hash) {
  return typeof hash === 'string' && hash.startsWith('#project-')
}

export default function Projects() {
  const reduced = usePrefersReducedMotion()
  const sectionRef = useReveal({ rootMargin: '0px' })
  const [activeId, setActiveId] = useState(null)

  const activeProject =
    projects.find((project) => project.id === activeId) ?? null

  // Keep the modal in sync with the URL hash (deep links + back button)
  useEffect(() => {
    const syncFromLocation = () => {
      const hash = window.location.hash
      const match = isModalHash(hash)
        ? projects.find((project) => `#project-${project.id}` === hash)
        : null
      setActiveId(match ? match.id : null)
    }

    syncFromLocation()
    window.addEventListener('popstate', syncFromLocation)
    window.addEventListener('hashchange', syncFromLocation)
    return () => {
      window.removeEventListener('popstate', syncFromLocation)
      window.removeEventListener('hashchange', syncFromLocation)
    }
  }, [])

  const openProject = (project) => {
    const target = `#project-${project.id}`
    if (window.location.hash !== target) {
      window.history.pushState({ projectModal: project.id }, '', target)
    }
    setActiveId(project.id)
  }

  const closeProject = () => {
    // If we pushed this modal onto the history, go back so the
    // browser back/forward buttons keep working naturally.
    if (
      window.history.state &&
      window.history.state.projectModal === activeId
    ) {
      window.history.back()
      return
    }
    // Deep-linked directly: clear the hash without adding history
    window.history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search,
    )
    setActiveId(null)
  }

  return (
    <section
      id="work"
      ref={sectionRef}
      className={`section ${styles.projects}`}
      aria-labelledby="projects-title"
    >
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
            <span aria-hidden="true">//</span> selected work
          </p>

          <h2
            id="projects-title"
            className={styles.heading}
            data-reveal
            style={{ '--reveal-delay': '90ms' }}
          >
            Featured <span className="text-gradient">Projects</span>
          </h2>

          <p
            className={styles.subtitle}
            data-reveal
            style={{ '--reveal-delay': '180ms' }}
          >
            Some of the things I&rsquo;ve built, explored and experimented with.
          </p>
        </header>

        <ul className={styles.grid}>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              reduced={reduced}
              onOpen={openProject}
            />
          ))}
        </ul>
      </div>

      {activeProject && (
        <ProjectModal
          key={activeProject.id}
          project={activeProject}
          onClose={closeProject}
          reduced={reduced}
        />
      )}
    </section>
  )
}
