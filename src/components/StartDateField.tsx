import { useId } from 'react'
import { formatLongDate } from '../lib/format'
import { isValidStartDate, type DayKey } from '../lib/schedule'
import styles from './StartDateField.module.css'

export function StartDateField({ value, onChange }: { value: DayKey; onChange: (value: DayKey) => void }) {
  const inputId = useId()
  const messageId = useId()
  const valid = isValidStartDate(value)

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
          Tu commences le {formatLongDate(value)}.
        </p>
      ) : (
        <p id={messageId} className={styles.error}>
          Choisis un lundi&nbsp;: le programme suit la semaine du lundi au dimanche.
        </p>
      )}
    </div>
  )
}
