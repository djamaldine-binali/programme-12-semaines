import buttons from '../components/buttons.module.css'
import { program } from '../data/program'
import { formatLongDate } from '../lib/format'
import type { DayKey } from '../lib/schedule'
import styles from './Today.module.css'

interface WaitingScreenProps {
  startDate: DayKey
  daysUntilStart: number
}

export function WaitingScreen({ startDate, daysUntilStart }: WaitingScreenProps) {
  return (
    <div className={styles.stack}>
      <header className={styles.header}>
        <p className={styles.dateLine}>Bientôt</p>
      </header>

      <section className={`${styles.panel} ${styles.recup}`}>
        <h1 className={styles.activityTitle}>
          {daysUntilStart === 1 ? 'Demain, on commence' : `Encore ${daysUntilStart} jours`}
        </h1>
        <p className={styles.summary}>Ton programme démarre le {formatLongDate(startDate)} avec la séance A.</p>
      </section>

      <div>
        <h2 className={styles.smallTitle}>À préparer</h2>
        <ul className={styles.plainList}>
          {program.meta.equipment.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <a href="#/programme" className={`${buttons.button} ${buttons.secondary} ${buttons.block}`}>
        Voir le programme
      </a>
    </div>
  )
}
