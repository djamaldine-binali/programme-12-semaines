import { useState } from 'react'
import { GuidedSession } from '../components/GuidedSession'
import styles from '../components/GuidedSession.module.css'
import { program } from '../data/program'
import { describeRun } from '../lib/activities'
import { formatDuration } from '../lib/format'
import { runPhases, totalDurationMs } from '../lib/guidedPhases'
import { currentRunStep, elapsedWeek } from '../lib/schedule'
import { useToday } from '../lib/useToday'
import { useAppState } from '../state/appStateContext'
import { RunAdjustment } from './RunAdjustment'

export function Run() {
  const { state } = useAppState()
  const today = useToday()
  const [step] = useState(() => currentRunStep(state.startDate, today, state.runShift))
  const run = program.running.tuesday_runs[step - 1]
  const phases = runPhases(run)
  const isRepeat = state.startDate !== null && step < elapsedWeek(state.startDate, today)

  return (
    <GuidedSession
      title="Course"
      finishedTitle="Course terminée"
      kind="course"
      phases={phases}
      startTone="course"
      markMessage={
        run.run_s_max
          ? `${run.run_s / 60} min\u00a0: objectif atteint. Continue jusqu'à ${run.run_s_max / 60} si tu te sens bien.`
          : undefined
      }
      offerStretch
      finishExtras={(finishedAt) => <RunAdjustment finishedAt={finishedAt} />}
      intro={
        <>
          <div>
            <h1>Course de la semaine {step}</h1>
            {isRepeat && <p className={styles.muted}>Tu refais une étape, c'est prévu par le programme.</p>}
          </div>
          <p className={styles.plan}>{describeRun(step)}</p>
          <p>
            5 min de marche rapide avant et après, soit {formatDuration(totalDurationMs(phases) / 1000)} en tout.{' '}
            {program.running.pace_note}
          </p>
          <div className={styles.safety}>
            <strong>Trop dur ou douloureux</strong>
            {program.rules.running_pain_rule}
          </div>
        </>
      }
    />
  )
}
