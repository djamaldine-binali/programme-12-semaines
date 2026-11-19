import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { program } from '../data/program'
import { describeIntervals, describeRun, LONG_WALK_S } from '../lib/activities'
import { formatNumber } from '../lib/format'
import { isDeloadWeek, monthOfWeek, sessionContext, stepsGoal, TOTAL_WEEKS } from '../lib/schedule'
import { useToday } from '../lib/useToday'
import { useAppState } from '../state/appStateContext'
import { MonthSessions } from './MonthSessions'
import styles from './Program.module.css'

const weekTemplateLabels: Record<string, string> = {
  renfo_A: 'Séance A',
  renfo_B: 'Séance B',
  renfo_A_ou_B: 'Séance A ou B',
  course: 'Course',
  marche_posture: 'Marche et posture',
  fractionne: 'Fractionné',
  posture_ou_repos: 'Posture ou repos',
}

const allWeeks = Array.from({ length: TOTAL_WEEKS }, (_, index) => index + 1)

export function Program() {
  const { state } = useAppState()
  const today = useToday()
  const current = state.startDate ? sessionContext(state.startDate, today) : null
  const [month, setMonth] = useState(current?.month ?? 1)
  const monthWeeks = allWeeks.filter((week) => monthOfWeek(week) === month)

  return (
    <div className={styles.page}>
      <h1>Programme</h1>

      <section aria-labelledby="weeks-title">
        <h2 id="weeks-title">12 semaines, 3 mois</h2>
        <div className={styles.grid}>
          {[1, 2, 3].map((gridMonth) => (
            <button
              key={gridMonth}
              type="button"
              className={styles.monthRow}
              aria-pressed={month === gridMonth}
              aria-label={`Mois ${gridMonth}, semaines ${gridMonth * 4 - 3} à ${gridMonth * 4}`}
              onClick={() => setMonth(gridMonth)}
            >
              <span className={styles.monthLabel}>Mois {gridMonth}</span>
              {allWeeks
                .filter((week) => monthOfWeek(week) === gridMonth)
                .map((week) => (
                  <span
                    key={week}
                    className={styles.week}
                    data-current={current?.week === week || undefined}
                    data-deload={isDeloadWeek(week) || undefined}
                  >
                    {week}
                  </span>
                ))}
            </button>
          ))}
        </div>
        <p className={styles.legend}>
          Les semaines 4 et 8, en pointillés, sont allégées.
          {current && ` Tu es en semaine ${current.week}, encadrée.`}
        </p>
      </section>

      <section aria-labelledby="month-title" className={styles.month}>
        <div>
          <h2 id="month-title">
            Mois {month}, semaines {monthWeeks[0]} à {monthWeeks.at(-1)}
          </h2>
          <p className={styles.muted}>Objectif&nbsp;: {formatNumber(stepsGoal(month))} pas par jour.</p>
        </div>

        <MonthSessions month={month} />

        <div>
          <h3>Course du mardi</h3>
          <ul className={styles.rows}>
            {monthWeeks.map((week) => (
              <li key={week}>
                <span className={styles.rowLabel}>Semaine {week}</span>
                <span className={styles.rowValue}>
                  {describeRun(week)}
                  {isDeloadWeek(week) && <span className={styles.muted}> (semaine allégée)</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Fractionné du samedi</h3>
          <p>{describeIntervals(month)}</p>
          {monthWeeks.some(isDeloadWeek) && (
            <p className={styles.muted}>
              Semaine {monthWeeks.find(isDeloadWeek)}&nbsp;: marche de {LONG_WALK_S / 60} min à la place.
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="template-title">
        <h2 id="template-title">La semaine type</h2>
        <ul className={styles.rows}>
          {program.week_template.map((day) => (
            <li key={day.day}>
              <span className={`${styles.rowLabel} ${styles.capitalize}`}>{day.day}</span>
              <span className={styles.rowValue}>
                {weekTemplateLabels[day.activity]}
                {day.detail && <span className={styles.detail}>{day.detail}</span>}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="rules-title" className={styles.rules}>
        <h2 id="rules-title">Les règles</h2>
        <p>{program.rules.progression_rule}</p>
        <p>{program.rules.deload_rule}</p>
        <p>{program.rules.stretch_after}</p>
        <p>Repos entre les séries&nbsp;: {program.rules.rest_between_sets_s.join(' à ')} s.</p>
      </section>

      <nav aria-label="Routines et fiches" className={styles.links}>
        <a href="#/routine/posture">
          Routine posture <ChevronRight size={20} aria-hidden="true" />
        </a>
        <a href="#/routine/etirements">
          Étirements <ChevronRight size={20} aria-hidden="true" />
        </a>
        <a href="#/bibliotheque">
          Les {Object.keys(program.exercises).length} fiches d'exercices <ChevronRight size={20} aria-hidden="true" />
        </a>
      </nav>
    </div>
  )
}
