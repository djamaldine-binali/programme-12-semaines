import { adviceFor } from '../lib/checkIn'
import type { CheckIn } from '../lib/storage'
import styles from './CheckInCard.module.css'

const titles = {
  good: 'Tout va bien',
  wait: 'Semaine plus difficile',
  adjust: 'Un petit ajustement',
  doctor: 'Prends soin de toi',
}

export function CheckInCard({ checkIns, week }: { checkIns: CheckIn[]; week: number }) {
  const advice = adviceFor(checkIns, week)

  return (
    <section aria-labelledby="check-in-title" className="card">
      <h2 id="check-in-title" className={styles.title}>
        {advice ? titles[advice.tone] : `Bilan de la semaine ${week}`}
      </h2>
      {advice ? (
        <ul className={styles.messages}>
          {advice.messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      ) : (
        <p className={styles.muted}>Énergie, faim, sommeil, séances et récup : une minute pour faire le point.</p>
      )}
      <a href="#/bilan" className={styles.link}>
        {advice ? 'Modifier mon bilan' : 'Faire mon bilan'}
      </a>
    </section>
  )
}
