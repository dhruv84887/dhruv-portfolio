import { hasValidUrl } from '../../data/portfolio.js'
import styles from './Projects.module.css'

/**
 * Project preview: the real cover image when `image` is set in
 * src/data/portfolio.js, otherwise themed abstract art rendered
 * with pure CSS + inline SVG (no fake screenshots).
 */
export default function ProjectVisual({ project }) {
  const themeClass = {
    ai: styles.artAi,
    social: styles.artSocial,
    creative: styles.artCreative,
  }[project.visual]

  // Real cover image when provided; themed abstract art otherwise.
  if (hasValidUrl(project.image)) {
    return (
      <div
        className={`${styles.art} ${themeClass ?? styles.artAi}`}
        aria-hidden="true"
      >
        <img
          className={styles.artImage}
          src={project.image}
          alt=""
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div
      className={`${styles.art} ${themeClass ?? styles.artAi}`}
      aria-hidden="true"
    >
      {project.visual === 'ai' && (
        <svg className={styles.artSvg} viewBox="0 0 400 250" fill="none">
          {/* Viewfinder corners */}
          <path
            d="M24 62V36h26M350 36h26v26M376 188v26h-26M50 214H24v-26"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Detection boxes */}
          <rect
            x="70"
            y="88"
            width="86"
            height="64"
            rx="4"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.9"
          />
          <rect
            x="212"
            y="66"
            width="64"
            height="84"
            rx="4"
            stroke="#8b5cf6"
            strokeWidth="2"
            opacity="0.85"
          />
          <rect
            x="148"
            y="152"
            width="116"
            height="58"
            rx="4"
            stroke="#ff5ea8"
            strokeWidth="2"
            strokeDasharray="7 5"
          />
          <circle cx="264" cy="152" r="3.5" fill="#ff5ea8" />
          <text
            x="150"
            y="146"
            fill="#ff5ea8"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="1.5"
          >
            ANOMALY 98%
          </text>
          <text
            x="72"
            y="82"
            fill="currentColor"
            fontSize="9"
            fontFamily="monospace"
            opacity="0.8"
          >
            CAM_01 · TRACK
          </text>
        </svg>
      )}

      {project.visual === 'social' && (
        <svg className={styles.artSvg} viewBox="0 0 400 250" fill="none">
          {/* Connection graph */}
          <g stroke="currentColor" strokeWidth="1.5" opacity="0.55">
            <path d="M196 138 L112 88" />
            <path d="M196 138 L300 82" />
            <path d="M196 138 L282 192" />
            <path d="M196 138 L114 196" />
          </g>
          <circle
            cx="196"
            cy="138"
            r="27"
            fill="rgba(77,240,255,0.14)"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="112"
            cy="88"
            r="16"
            fill="rgba(139,92,246,0.18)"
            stroke="#8b5cf6"
            strokeWidth="2"
          />
          <circle
            cx="300"
            cy="82"
            r="14"
            fill="rgba(77,240,255,0.12)"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="282"
            cy="192"
            r="16"
            fill="rgba(255,94,168,0.14)"
            stroke="#ff5ea8"
            strokeWidth="2"
          />
          <circle
            cx="114"
            cy="196"
            r="13"
            fill="rgba(139,92,246,0.14)"
            stroke="#8b5cf6"
            strokeWidth="2"
          />
          {/* Chat bubble */}
          <path
            d="M252 34h74a12 12 0 0 1 12 12v24a12 12 0 0 1-12 12h-44l-14 13V71h-16a12 12 0 0 1-12-12V46a12 12 0 0 1 12-12z"
            fill="rgba(255,255,255,0.05)"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.9"
          />
          <circle cx="352" cy="40" r="6" fill="#ff5ea8" />
        </svg>
      )}

      {project.visual !== 'ai' && project.visual !== 'social' && (
        <svg className={styles.artSvg} viewBox="0 0 400 250" fill="none">
          {/* Orbit rings */}
          <ellipse
            cx="200"
            cy="130"
            rx="150"
            ry="58"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.6"
            transform="rotate(-14 200 130)"
          />
          <ellipse
            cx="200"
            cy="130"
            rx="150"
            ry="58"
            stroke="#8b5cf6"
            strokeWidth="1.5"
            opacity="0.5"
            transform="rotate(52 200 130)"
          />
          {/* Wireframe cube */}
          <g
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="rgba(77,240,255,0.06)"
          >
            <path d="M200 58 L268 97 L268 175 L200 214 L132 175 L132 97 Z" />
            <path
              d="M200 58 L200 136 M200 136 L268 175 M200 136 L132 175"
              fill="none"
              opacity="0.8"
            />
          </g>
          {/* Cursor */}
          <path
            d="M282 150 l46 20 -18 6 -6 18 z"
            fill="rgba(255,255,255,0.9)"
            stroke="#04121a"
            strokeWidth="1.5"
          />
          {/* Sparkles */}
          <path
            d="M84 60h14M91 53v14M320 200h12M326 194v12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      )}
    </div>
  )
}
