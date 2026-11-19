import { useId, useState } from 'react'
import buttons from '../components/buttons.module.css'
import { program } from '../data/program'
import { formatLongDate } from '../lib/format'
import { upcomingMonday, weekdayOf, type DayKey } from '../lib/schedule'
import { useAppState } from '../state/appStateContext'
import styles from './Today.module.css'

export function StartDatePicker({ today }: { today: DayKey }) {
  const { update } = useAppState()
  const [startDate, setStartDate] = useState(() => upcomingMonday(today))
  const inputId = useId()
  const errorId = useId()
  const isMonday = startDate !== '' && weekdayOf(startDate) === 0

  return (
    <div className={styles.stack}>
      <h1 className={styles.welcomeTitle}>{program.meta.title}</h1>
      <p className={styles.lead}>
        Chaque semaine va du lundi au dimanche : renfo, course, fractionné et posture. Choisis le lundi où tu commences,
        l'app te dira chaque jour quoi faire.
      </p>

      <div className={styles.field}>
        <label htmlFor={inputId}>Date de début</label>
        <input
          id={inputId}
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          aria-invalid={!isMonday}
          aria-describedby={isMonday ? undefined : errorId}
        />
        {isMonday ? (
          <p className={styles.hint}>Tu commences le {formatLongDate(startDate)}.</p>
        ) : (
          <p id={errorId} className={styles.error}>
            Choisis un lundi : le programme suit la semaine du lundi au dimanche.
          </p>
        )}
      </div>

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
