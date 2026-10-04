import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import ErrorBoundary from '../common/ErrorBoundary.jsx'
import styles from './Layout.module.css'

/**
 * Global application shell: fixed background layers (3D + CSS),
 * primary navigation, main content region and footer.
 */
export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* Fixed deep-space backdrop: CSS starfield + glow layers */}
      <div className={styles.background} aria-hidden="true">
        <div className={styles.starfield} />
        <div className={styles.aurora} />
        <div className={styles.gridOverlay} />
        <div className={styles.vignette} />
      </div>

      <ErrorBoundary>
        <Navbar />
      </ErrorBoundary>

      <main id="main-content" className={styles.main}>
        {children}
      </main>

      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
    </div>
  )
}
