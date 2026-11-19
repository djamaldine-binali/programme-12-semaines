import { Check } from 'lucide-react'
import { sessionKindLabels, sessionKindTones } from '../lib/activities'
import { formatLongDate } from '../lib/format'
import { SESSIONS_PER_WEEK, startedWeeks } from '../lib/progress'
import { TOTAL_WEEKS } from '../lib/schedule'
import type { Feeling } from '../lib/storage'
import { useToday } from '../lib/useToday'
import { useAppState } from '../state/appStateContext'
import styles from './History.module.css'

const dayLetters = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const feelingLabels: Record<Feeling, string> = { facile: 'facile', ok: 'ok', dur: 'dur' }

export function History() {
  const { state } = useAppState()
  const today = useToday()
  const weeks = state.startDate ? startedWeeks(state.startDate, today, state.log) : []
  const completeWeeks = weeks.filter((week) => week.complete).length
  const entries = [...state.log].reverse()

  if (entries.length === 0) {
    return (
      <div className={styles.page}>
        <h1>Suivi</h1>
        <p>Rien pour l'instant. Chaque séance terminée apparaîtra ici, avec ton ressenti.</p>
        <a href="#/">Voir la séance du jour</a>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1>Suivi</h1>
      <p className={styles.summary}>
        {completeWeeks} {completeWeeks > 1 ? 'semaines complètes' : 'semaine complète'} sur {TOTAL_WEEKS}
      </p>
      <p className={styles.muted}>
        Une semaine est complète avec ses {SESSIONS_PER_WEEK} séances principales&nbsp;: 3 renfo, la course et le
        fractionné (ou la marche). La posture et les étirements sont en plus.
      </p>

      {weeks.length > 0 && (
        <section aria-labelledby="weeks-title">
          <h2 id="weeks-title">Semaine par semaine</h2>
          <ul className={styles.weeks}>
            {weeks.map((week) => (
              <li key={week.week} className={styles.week}>
                <div className={styles.weekHeader}>
                  <span className={styles.weekName}>Semaine {week.week}</span>
                  <span className={styles.muted}>
                    {week.complete ? (
                      <span className={styles.complete}>
                        <Check size={18} aria-hidden="true" /> complète
                      </span>
                    ) : (
                      `${week.mainSessionsDone} sur ${SESSIONS_PER_WEEK}`
                    )}
                  </span>
                </div>
                <ol className={styles.days}>
                  {week.days.map(({ day, entries: dayEntries }, index) => {
                    const main = dayEntries.find((entry) => entry.kind !== 'etirements')
                    return (
                      <li key={day} className={main ? styles[sessionKindTones[main.kind]] : undefined}>
                        <span aria-hidden="true">{dayLetters[index]}</span>
                        <span className="visually-hidden">
                          {formatLongDate(day)}
                          {main ? ` : ${sessionKindLabels[main.kind]}` : ''}
                        </span>
                      </li>
                    )
                  })}
                </ol>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="log-title">
        <h2 id="log-title">Séances faites</h2>
        <ul className={styles.log}>
          {entries.map((entry) => (
            <li key={entry.finishedAt}>
              <span className={styles.logName}>{sessionKindLabels[entry.kind]}</span>
              <span className={styles.muted}>
                {formatLongDate(entry.day)}
                {entry.feeling && `, ${feelingLabels[entry.feeling]}`}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
