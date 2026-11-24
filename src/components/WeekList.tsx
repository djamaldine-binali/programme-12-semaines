import { Check, ChevronRight } from 'lucide-react'
import { program } from '../data/program'
import { activityInfo } from '../lib/activities'
import { plannedDaysDone } from '../lib/progress'
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
  const days = weekPlan(week).map((activity) => activityInfo(activity, week, state.runShift))
  const done = plannedDaysDone(
    startDate,
    week,
    days.map((info) => info.kind),
    state.log,
  )

  return (
    <section aria-labelledby="week-title">
      <h2 id="week-title" className={styles.title}>
        Ta semaine
      </h2>
      <p className={styles.hint}>Touche un jour pour faire sa séance, même si ce n'est pas le bon jour.</p>
      <ol className={styles.list}>
        {days.map((info, weekday) => {
          const day = addDays(monday, weekday)
          const isToday = day === today
          return (
            <li key={day}>
              <a href={`#${info.path}`} className={styles.row} aria-current={isToday ? 'date' : undefined}>
                <span className={styles.day}>
                  <abbr title={program.week_template[weekday].day}>{shortDays[weekday]}</abbr>
                </span>
                <span className={`${styles.chip} ${styles[info.tone]}`} aria-hidden="true" />
                <span className={styles.label}>{info.title}</span>
                {done[weekday] ? (
                  <span className={styles.done}>
                    <Check size={20} aria-hidden="true" />
                    Fait
                  </span>
                ) : (
                  <ChevronRight size={18} aria-hidden="true" className={styles.chevron} />
                )}
              </a>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
