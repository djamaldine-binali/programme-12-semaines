import { useState } from 'react'
import buttons from '../components/buttons.module.css'
import { StartDateField } from '../components/StartDateField'
import { program } from '../data/program'
import { isValidStartDate, upcomingMonday, type DayKey } from '../lib/schedule'
import { useAppState } from '../state/appStateContext'
import styles from './Today.module.css'

export function StartDatePicker({ today }: { today: DayKey }) {
  const { update } = useAppState()
  const [startDate, setStartDate] = useState(() => upcomingMonday(today))
  const isMonday = isValidStartDate(startDate)

  return (
    <div className={styles.stack}>
      <h1 className={styles.welcomeTitle}>{program.meta.title}</h1>
      <p className={styles.lead}>
        Chaque semaine va du lundi au dimanche : renfo, course, fractionné et posture. Choisis le lundi où tu commences,
        l'app te dira chaque jour quoi faire.
      </p>

      <StartDateField value={startDate} onChange={setStartDate} />

      <div>
        <h2 className={styles.smallTitle}>Ce qu'il te faut</h2>
        <ul className={styles.plainList}>
          {program.meta.equipment.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className={`${buttons.button} ${buttons.renfo} ${buttons.block}`}
        disabled={!isMonday}
        onClick={() => update((state) => ({ ...state, startDate }))}
      >
        Commencer le programme
      </button>
    </div>
  )
}
