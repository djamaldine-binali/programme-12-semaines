import styles from './SetCounter.module.css'

export function SetCounter({ done, total }: { done: number; total: number }) {
  const current = Math.min(done + 1, total)
  return (
    <div className={styles.counter}>
      <p className={styles.label}>{done >= total ? `${total} séries faites` : `Série ${current} sur ${total}`}</p>
      <ol className={styles.dots} aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <li key={index} className={index < done ? styles.filled : undefined} />
        ))}
      </ol>
    </div>
  )
}
