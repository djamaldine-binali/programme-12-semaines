import { useId } from 'react'
import { formatLongDate } from '../lib/format'
import { addDays, isDayKey, mondayOf, weekdayOf, type DayKey } from '../lib/schedule'
import styles from './StartDateField.module.css'

export function StartDateField({ value, onChange }: { value: DayKey; onChange: (value: DayKey) => void }) {
  const inputId = useId()
  const messageId = useId()
  const valid = isDayKey(value)

  return (
    <div className={styles.field}>
      <label htmlFor={inputId}>Date de début</label>
      <input
        id={inputId}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={!valid}
        aria-describedby={messageId}
      />
      {valid ? (
        <p id={messageId} className={styles.hint}>
          {weekdayOf(value) === 0
            ? `Ta semaine 1 commence le ${formatLongDate(value)}.`
            : `Ta semaine 1 va du ${formatLongDate(mondayOf(value))} au ${formatLongDate(addDays(mondayOf(value), 6))}. Les séances des jours passés restent disponibles.`}
        </p>
      ) : (
        <p id={messageId} className={styles.error}>
          Choisis une date dans le calendrier.
        </p>
      )}
    </div>
  )
}
