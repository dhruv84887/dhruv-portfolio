import { memo } from 'react'

import { useTilt } from '../../animations/index.js'
import styles from './Journey.module.css'

/**
 * One timeline entry: glowing 3D node + glass card with tilt,
 * animated gradient border and cursor-following glow.
 */
function TimelineItem({ item, index, side, reduced }) {
  const cardRef = useTilt({ max: 7, scale: 1.02, disabled: reduced })

  return (
    <li
      className={`${styles.item} ${
        side === 'left' ? styles.itemLeft : styles.itemRight
      }`}
      data-node
      data-reveal
      style={{ '--reveal-delay': `${160 + index * 140}ms` }}
    >
      <div className={styles.spineCell} aria-hidden="true">
        <span className={styles.node}>
          <span className={styles.nodeOrbit} />
          <span className={styles.nodePing} />
          <span className={styles.nodeCore} />
        </span>
      </div>

      <div className={styles.cardCell}>
        <div className={styles.card} ref={cardRef}>
          <div className={styles.cardGlow} aria-hidden="true" />
          <p className={styles.year}>{item.year}</p>
          <h3 className={styles.itemTitle}>{item.title}</h3>
          <p className={styles.itemDesc}>{item.description}</p>
        </div>
      </div>
    </li>
  )
}

export default memo(TimelineItem)
