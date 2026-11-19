import { Check } from 'lucide-react'
import { program } from '../data/program'
import { activityInfo } from '../lib/activities'
import { addDays, weekPlan, weekStart, type DayKey } from '../lib/schedule'
import { useAppState } from '../state/appStateContext'
import styles from './WeekList.module.css'

const shortDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

interface WeekListProps {
  startDate: DayKey
  week: number
  today: DayKey
}

export function WeekList({ startDate, week, today }: WeekListProps) {
  const { state } = useAppState()
  const monday = weekStart(startDate, week)

  return (
    <section aria-labelledby="week-title">
      <h2 id="week-title" className={styles.title}>
        Ta semaine
      </h2>
      <ol className={styles.list}>
        {weekPlan(week).map((activity, weekday) => {
          const day = addDays(monday, weekday)
          const info = activityInfo(activity, week, state.runShift)
          const done = state.log.some((entry) => entry.day === day && entry.kind !== 'etirements')
          const isToday = day === today
          return (
            <li key={day} className={styles.row} aria-current={isToday ? 'date' : undefined}>
              <span className={styles.day}>
                <abbr title={program.week_template[weekday].day}>{shortDays[weekday]}</abbr>
              </span>
              <span className={`${styles.chip} ${styles[info.tone]}`} aria-hidden="true" />
              <span className={styles.label}>{info.title}</span>
              {done && (
                <span className={styles.done}>
                  <Check size={20} aria-hidden="true" />
                  Fait
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
