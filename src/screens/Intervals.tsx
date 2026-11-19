import { useState } from 'react'
import buttons from '../components/buttons.module.css'
import { Diagram } from '../components/Diagram'
import { GuidedSession } from '../components/GuidedSession'
import styles from '../components/GuidedSession.module.css'
import { VideoFacade } from '../components/VideoFacade'
import { program } from '../data/program'
import { describeIntervals, LONG_WALK_S } from '../lib/activities'
import { formatDuration } from '../lib/format'
import { intervalPhases } from '../lib/guidedPhases'
import { sessionContext } from '../lib/schedule'
import { useToday } from '../lib/useToday'
import { useAppState } from '../state/appStateContext'

export function Intervals() {
  const { state } = useAppState()
  const today = useToday()
  const [context] = useState(() => sessionContext(state.startDate, today))
  const intervals = program.running.saturday_intervals[context.month - 1]

  return (
    <GuidedSession
      title="Fractionné"
      finishedTitle="Fractionné terminé"
      kind="fractionne"
      phases={intervalPhases(intervals)}
      startTone="course"
      offerStretch
      duringRun={intervals.mode === 'maison' && <DemoExercise id={intervals.demo_exercise} />}
      intro={
        <>
          <h1>Fractionné du mois {context.month}</h1>
          {context.deload && (
            <div className={styles.safety}>
              <strong>Semaine allégée</strong>
              Cette semaine, une marche de {LONG_WALK_S / 60} min remplace le fractionné.
              <a href="#/marche" className={`${buttons.button} ${buttons.recup} ${buttons.block}`}>
                Faire la marche
              </a>
            </div>
          )}
          <p className={styles.plan}>{describeIntervals(context.month)}</p>
          {intervals.mode === 'maison' ? (
            <>
              <p>À chaque effort, un mouvement différent, dans cet ordre&nbsp;: {intervals.moves.join(', ')}.</p>
              <DemoExercise id={intervals.demo_exercise} />
            </>
          ) : (
            <>
              <p>{formatDuration(program.running.warmup_walk_s)} de marche avant et après.</p>
              <div className={styles.safety}>
                <strong>Trop dur ou douloureux</strong>
                {program.rules.running_pain_rule}
              </div>
            </>
          )}
        </>
      }
    />
  )
}

function DemoExercise({ id }: { id: string }) {
  const exercise = program.exercises[id]
  return (
    <details>
      <summary className={styles.plan}>Fiche {exercise.name.toLowerCase()}</summary>
      <div className={styles.intro}>
        <Diagram exercise={exercise} />
        <p>{exercise.cue}</p>
        <VideoFacade exercise={exercise} />
      </div>
    </details>
  )
}
