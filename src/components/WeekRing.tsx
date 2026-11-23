import styles from './WeekRing.module.css'

const RADIUS = 34
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function WeekRing({ week, total = 12 }: { week: number; total?: number }) {
  const progress = Math.min(week / total, 1)
  return (
    <div className={styles.ring}>
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <circle cx="40" cy="40" r={RADIUS} className={styles.track} />
        <circle
          cx="40"
          cy="40"
          r={RADIUS}
          className={styles.progress}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
        />
      </svg>
      <span className={styles.label} aria-hidden="true">
        {week}
        <small>/{total}</small>
      </span>
    </div>
  )
}
