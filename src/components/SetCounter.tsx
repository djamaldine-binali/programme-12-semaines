import styles from './SetCounter.module.css'

export function SetCounter({ done, total }: { done: number; total: number }) {
  return (
    <div className={styles.counter}>
      <p className={styles.label}>{done >= total ? `${total} séries faites` : `Série ${done + 1} sur ${total}`}</p>
      <ol className={styles.dots} aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <li key={index} className={index < done ? styles.filled : undefined} />
        ))}
      </ol>
    </div>
  )
}
