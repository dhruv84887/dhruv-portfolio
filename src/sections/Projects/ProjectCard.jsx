import { useTilt } from '../../animations/index.js'
import {
  hasValidUrl,
  projectGithubUrl,
  projectLiveUrl,
} from '../../data/portfolio.js'
import ProjectVisual from './ProjectVisual.jsx'
import styles from './Projects.module.css'

/**
 * Large premium project card: 3D tilt, independent image parallax,
 * cursor-following glow, staggered badge animation and a cinematic
 * visual hover (zoom + overlay + quick "View Project" reveal).
 */
export default function ProjectCard({ project, index, reduced, onOpen }) {
  const tiltRef = useTilt({ max: 8, scale: 1, disabled: reduced })
  // Buttons appear only for real URLs — never broken links.
  const githubUrl = projectGithubUrl(project)
  const liveUrl = projectLiveUrl(project)
  const hasGithub = hasValidUrl(githubUrl)
  const hasLive = hasValidUrl(liveUrl)

  const open = () => onOpen(project)

  return (
    <li
      className={styles.item}
      data-reveal
      style={{ '--reveal-delay': `${260 + index * 120}ms` }}
    >
      <article className={styles.card}>
        <div className={styles.cardInner} ref={tiltRef}>
          <div className={styles.cardGlow} aria-hidden="true" />

          {/* Large visual preview */}
          <div className={styles.visual}>
            <div className={styles.visualInner}>
              <ProjectVisual project={project} />
            </div>
            <div className={styles.visualOverlay} aria-hidden="true" />
            <span className={styles.visualIndex} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <button
              type="button"
              className={styles.quickView}
              onClick={open}
              tabIndex={-1}
              aria-hidden="true"
            >
              View Project
              <span className="btn-arrow">→</span>
            </button>
          </div>

          {/* Content */}
          <div className={styles.body}>
            <p className={styles.category}>{project.category}</p>
            <h3 className={styles.cardTitle}>{project.title}</h3>
            <p className={styles.desc}>{project.description}</p>

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

            <div className={styles.actions}>
              <button type="button" className="btn btn--primary" onClick={open}>
                View Project
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </button>
              {hasLive && (
                <a
                  className="btn"
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Demo
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
          </div>
        </div>
      </article>
    </li>
  )
}
