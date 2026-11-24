import { Apple, Check, ChevronRight, Coffee, Footprints, Salad, UtensilsCrossed, type LucideIcon } from 'lucide-react'
import { ActivityIcon } from '../components/ActivityIcon'
import { CheckInCard } from '../components/CheckInCard'
import buttons from '../components/buttons.module.css'
import { WeekList } from '../components/WeekList'
import { OtterMark } from '../components/OtterMark'
import { WaterTracker } from '../components/WaterTracker'
import { useNow } from '../lib/useNow'
import { useWater } from '../lib/useWater'
import { meals, type MealSlot } from '../data/meals'
import { program } from '../data/program'
import { activityInfo } from '../lib/activities'
import { formatLongDate, formatNumber } from '../lib/format'
import { stepsGoal, weekdayOf, type DayKey, type ProgramDay } from '../lib/schedule'
import { useAppState } from '../state/appStateContext'
import { OtherSessions } from './OtherSessions'
import styles from './Today.module.css'

type DuringDay = Extract<ProgramDay, { phase: 'during' }>

function weekState(week: number, current: number): 'done' | 'current' | undefined {
  if (week < current) return 'done'
  if (week === current) return 'current'
  return undefined
}

const mealIcons: Record<MealSlot, LucideIcon> = {
  'Petit-déjeuner': Coffee,
  Déjeuner: Salad,
  Collation: Apple,
  Dîner: UtensilsCrossed,
}

function greeting(hour: number): string {
  if (hour < 12) return 'Bonjour Amélia'
  if (hour < 18) return 'Bon après-midi Amélia'
  return 'Bonsoir Amélia'
}

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
  const now = useNow()
  const water = useWater(today)

  return (
    <div className={styles.stack}>
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.greeting}>{greeting(now.getHours())}</p>
          <p className={styles.capitalize}>{formatLongDate(today)}</p>
          <p className={styles.weekText}>
            Semaine {day.week} sur 12, mois {day.month}
            {day.deload && ', semaine allégée'}
          </p>
          <ol className={styles.weekBar} aria-hidden="true">
            {Array.from({ length: 12 }, (_, index) => (
              <li key={index} data-state={weekState(index + 1, day.week)} />
            ))}
          </ol>
        </div>
        <div className={styles.heroOtter}>
          <OtterMark size={108} />
        </div>
      </header>

      <section className={`card ${styles.session}`} aria-labelledby="today-activity">
        <div className={styles.sessionHead}>
          <span className={`${styles.badge} ${styles[info.tone]}`}>
            <ActivityIcon kind={info.kind} />
          </span>
          <p className={styles.eyebrow}>Ta séance du jour</p>
        </div>
        <h1 id="today-activity" className={styles.activityTitle}>
          {info.title}
        </h1>
        <p className={styles.summary}>{info.summary}</p>
        {doneToday ? (
          <p className={styles.done}>
            <Check size={22} aria-hidden="true" /> C'est fait pour aujourd'hui, bravo.
          </p>
        ) : (
          <a href={`#${info.path}`} className={`${buttons.button} ${buttons.primary} ${buttons.block}`}>
            {isPostureOrRest ? 'Faire la routine posture' : 'Démarrer'}
          </a>
        )}
      </section>

      <section aria-labelledby="water-title" className="card">
        <div className={styles.cardHead}>
          <h2 id="water-title">Eau</h2>
          <a href="#/eau">Rappels</a>
        </div>
        {water.ready && <WaterTracker water={water} now={now} />}
      </section>

      {day.weekday >= 5 && !state.checkIns.some((checkIn) => checkIn.week === day.week) && (
        <CheckInCard checkIns={state.checkIns} week={day.week} />
      )}

      <p className={styles.steps}>
        <Footprints size={20} aria-hidden="true" />
        <span>
          <strong>{formatNumber(stepsGoal(day.month))} pas</strong> par jour ce mois-ci
        </span>
      </p>

      {day.deload && (
        <p className={styles.note}>
          <strong>Semaine allégée.</strong> {program.rules.deload_rule}
        </p>
      )}

      <section aria-labelledby="menu-title" className="card">
        <div className={styles.cardHead}>
          <h2 id="menu-title">Au menu</h2>
          <a href="#/repas">Recettes et courses</a>
        </div>
        <ul className={styles.menuList}>
          {todayMeals.map((meal) => {
            const Icon = mealIcons[meal.slot]
            return (
              <li key={meal.slot}>
                <a href={`#/repas/recette/${meal.recipe}`}>
                  <span className={styles.menuIcon}>
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span>
                    <span className={styles.menuSlot}>{meal.slot}</span>
                    <span className={styles.menuTitle}>{meals.recipes[meal.recipe].title}</span>
                  </span>
                  <ChevronRight size={18} aria-hidden="true" className={styles.chevron} />
                </a>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="card">
        <WeekList startDate={startDate} week={day.week} today={today} />
      </div>

      <div className="card">
        <OtherSessions week={day.week} />
      </div>

      <p className={styles.note}>
        <strong>Écoute ton corps.</strong> {program.rules.listen_to_body}
      </p>
    </div>
  )
}
