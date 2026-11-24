import { Check } from 'lucide-react'
import buttons from '../components/buttons.module.css'
import { SettingsLink } from '../components/SettingsLink'
import { WeekList } from '../components/WeekList'
import { meals } from '../data/meals'
import { program } from '../data/program'
import { activityInfo } from '../lib/activities'
import { formatLongDate, formatNumber } from '../lib/format'
import { stepsGoal, weekdayOf, type DayKey, type ProgramDay } from '../lib/schedule'
import { useAppState } from '../state/appStateContext'
import { OtherSessions } from './OtherSessions'
import styles from './Today.module.css'

type DuringDay = Extract<ProgramDay, { phase: 'during' }>

interface TodayPlanProps {
  startDate: DayKey
  day: DuringDay
  today: DayKey
}

export function TodayPlan({ startDate, day, today }: TodayPlanProps) {
  const { state } = useAppState()
  const info = activityInfo(day.activity, day.week, state.runShift)
  const doneToday = state.log.some((entry) => entry.day === today && entry.kind === info.kind)
  const isPostureOrRest = day.activity === 'posture_ou_repos'
  const todayMeals = meals.days[weekdayOf(today)].meals

  return (
    <div className={styles.stack}>
      <header className={styles.header}>
        <p className={styles.dateLine}>
          <span className={styles.capitalize}>{formatLongDate(today)}</span>
          <br />
          Semaine {day.week} sur 12, mois {day.month}
        </p>
        <SettingsLink />
      </header>

      <section className={`${styles.panel} ${styles[info.tone]}`} aria-labelledby="today-activity">
        <h1 id="today-activity" className={styles.activityTitle}>
          {info.title}
        </h1>
        <p className={styles.summary}>{info.summary}</p>
        {doneToday ? (
          <p className={styles.done}>
            <Check size={22} aria-hidden="true" /> C'est fait pour aujourd'hui.
          </p>
        ) : (
          <a href={`#${info.path}`} className={`${buttons.button} ${buttons[info.tone]} ${buttons.block}`}>
            {isPostureOrRest ? 'Faire la routine posture' : 'Démarrer'}
          </a>
        )}
      </section>

      {day.deload && (
        <p className={styles.note}>
          <strong>Semaine allégée.</strong> {program.rules.deload_rule}
        </p>
      )}

      <p className={styles.note}>
        <strong>Pas du mois {day.month}&nbsp;:</strong> {formatNumber(stepsGoal(day.month))} par jour.
      </p>

      <section aria-labelledby="menu-title" className={styles.menu}>
        <h2 id="menu-title">Au menu aujourd'hui</h2>
        <ul>
          {todayMeals.map((meal) => (
            <li key={meal.slot}>
              <span className={styles.menuSlot}>{meal.slot}</span> {meals.recipes[meal.recipe].title}
            </li>
          ))}
        </ul>
        <a href="#/repas">Recettes et courses</a>
      </section>

      <WeekList startDate={startDate} week={day.week} today={today} />

      <OtherSessions week={day.week} />

      <p className={styles.note}>
        <strong>Écoute ton corps.</strong> {program.rules.listen_to_body}
      </p>
    </div>
  )
}
