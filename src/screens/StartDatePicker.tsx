import { useState } from 'react'
import buttons from '../components/buttons.module.css'
import { StartDateField } from '../components/StartDateField'
import { program } from '../data/program'
import { isDayKey, mondayOf, type DayKey } from '../lib/schedule'
import { useAppState } from '../state/appStateContext'
import styles from './Today.module.css'

export function StartDatePicker({ today }: { today: DayKey }) {
  const { update } = useAppState()
  const [startDate, setStartDate] = useState(today)

  return (
    <div className={styles.stack}>
      <h1 className={styles.welcomeTitle}>Ton programme de 12 semaines</h1>
      <p className={styles.lead}>
        Chaque semaine va du lundi au dimanche : renfo, course, fractionné et posture. Tu peux commencer n'importe quel
        jour&nbsp;: l'app te dira chaque jour quoi faire, et tu pourras rattraper une séance quand tu veux.
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
        className={`${buttons.button} ${buttons.sunrise} ${buttons.block}`}
        disabled={!isDayKey(startDate)}
        onClick={() => update((state) => ({ ...state, startDate: mondayOf(startDate) }))}
      >
        Commencer le programme
      </button>
    </div>
  )
}
