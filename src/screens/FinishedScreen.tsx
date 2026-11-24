import buttons from '../components/buttons.module.css'
import { describeRun } from '../lib/activities'
import { elapsedWeek, TOTAL_WEEKS, type DayKey } from '../lib/schedule'
import { useAppState } from '../state/appStateContext'
import { OtherSessions } from './OtherSessions'
import styles from './Today.module.css'

export function FinishedScreen({ startDate, today }: { startDate: DayKey; today: DayKey }) {
  const { state } = useAppState()
  const sessionsDone = state.log.filter((entry) => entry.kind !== 'etirements').length
  // Repeated steps push the run plan past week 12: it goes on until step 12 is done.
  const runStep = elapsedWeek(startDate, today) - state.runShift

  return (
    <div className={styles.stack}>
      <header className={styles.header}>
        <p className={styles.dateLine}>Après la semaine 12</p>
      </header>

      <section className={`${styles.panel} ${styles.renfo}`}>
        <h1 className={styles.activityTitle}>Programme terminé</h1>
        <p className={styles.summary}>
          {sessionsDone > 0
            ? `Les 12 semaines sont bouclées, avec ${sessionsDone} séances faites.`
            : 'Les 12 semaines sont passées.'}
        </p>
      </section>

      {runStep <= TOTAL_WEEKS && (
        <div className={styles.note}>
          <h2 className={styles.smallTitle}>Ta course continue</h2>
          <p>
            Tu as refait certaines étapes de course. Cette semaine, ta course du mardi est celle de la semaine {runStep}
            &nbsp;: {describeRun(runStep)}.
          </p>
          <a href="#/course" className={`${buttons.button} ${buttons.course} ${buttons.block}`}>
            Faire la course
          </a>
        </div>
      )}

      <div className={styles.note}>
        <h2 className={styles.smallTitle}>Et maintenant</h2>
        <p>
          Garde les mêmes habitudes pendant 2 à 4 semaines&nbsp;: les séances du mois 3, la course du mardi, le
          fractionné et tes pas.
        </p>
      </div>

      <OtherSessions week={TOTAL_WEEKS} />
    </div>
  )
}
