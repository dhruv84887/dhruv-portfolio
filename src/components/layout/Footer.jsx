import { useReveal } from '../../animations/index.js'
import {
  monogram,
  navigation,
  siteConfig,
  visibleContactLinks,
} from '../../data/portfolio.js'
import styles from './Footer.module.css'

const year = new Date().getFullYear()

const footerParticles = [
  { left: '8%', top: '30%', size: 3, delay: '0s' },
  { left: '34%', top: '68%', size: 2, delay: '-2s' },
  { left: '70%', top: '44%', size: 2, delay: '-4s' },
  { left: '90%', top: '72%', size: 3, delay: '-1s' },
]

/**
 * Premium minimal footer: brand, navigation, social links,
 * back-to-top, animated top border and subtle particles.
 */
export default function Footer() {
  const footerRef = useReveal({ rootMargin: '0px' })

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.particles} aria-hidden="true">
        {footerParticles.map((particle, index) => (
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
            }}
          />
        ))}
      </div>

      <div className={`container ${styles.inner}`}>
        {/* Brand */}
        <div className={styles.brandCol} data-reveal>
          <a href="#home" className={styles.brand}>
            <span className={styles.mark}>{monogram}</span>
            <span className={styles.brandText}>
              <span className={styles.name}>{siteConfig.name}</span>
              <span className={styles.role}>{siteConfig.role}</span>
            </span>
          </a>
        </div>

        {/* Navigation */}
        <nav className={styles.navCol} aria-label="Footer" data-reveal>
          <p className={styles.colLabel}>Explore</p>
          <ul className={styles.navLinks}>
            {navigation.map((item) => (
              <li key={item.id}>
                <a href={item.href} className={styles.navLink}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Socials + back to top */}
        <div className={styles.socialCol} data-reveal>
          <p className={styles.colLabel}>Connect</p>
          {/* Only links with a real URL render — placeholders stay hidden */}
          <ul className={styles.socials}>
            {visibleContactLinks.map((link) => {
              const isExternal = link.href.startsWith('http')
              return (
                <li key={link.id}>
                  <a
                    className={styles.social}
                    href={link.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noreferrer' : undefined}
                  >
                    <span className={styles.socialGlyph} aria-hidden="true">
                      {link.glyph}
                    </span>
                    <span className={styles.socialLabel}>{link.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>

          <a href="#home" className={styles.backTop}>
            <span className={styles.backTopIcon} aria-hidden="true">
              ↑
            </span>
            Back to top
          </a>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p className={styles.copyright}>
          © {year} {siteConfig.name}. All rights reserved.
        </p>
        <p className={styles.built}>Built with React · Vite · three.js</p>
      </div>
    </footer>
  )
}
