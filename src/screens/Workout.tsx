import { useState } from 'react'
import { FinishPanel } from '../components/FinishPanel'
import { HoldTimer } from '../components/HoldTimer'
import { RestTimer } from '../components/RestTimer'
import { SessionHeader } from '../components/SessionHeader'
import { program } from '../data/program'
import { holdSteps } from '../lib/holdSteps'
import { parseTarget, setsFor } from '../lib/dose'
import { sessionContext } from '../lib/schedule'
import { unlockAudio } from '../lib/sound'
import { withLogEntry } from '../lib/storage'
import { useToday } from '../lib/useToday'
import { useWakeLock } from '../lib/useWakeLock'
import { useAppState } from '../state/appStateContext'
import { ExerciseStep } from './ExerciseStep'
import styles from './Workout.module.css'

type Stage = 'ready' | 'holding' | 'resting' | 'finished'

export function Workout({ sessionId }: { sessionId: 'A' | 'B' }) {
  const { state, update } = useAppState()
  const today = useToday()
  const [context] = useState(() => sessionContext(state.startDate, today))
  const session = program.sessions[sessionId]
  const steps = session.items.map((item) => item.months[context.month - 1])

  const [index, setIndex] = useState(0)
  const [setsDone, setSetsDone] = useState(() => steps.map(() => 0))
  const [stage, setStage] = useState<Stage>('ready')
  const [finishedAt, setFinishedAt] = useState<string | null>(null)
  useWakeLock(stage !== 'finished')

  const step = steps[index]
  const exercise = program.exercises[step.exercise]
  const totalSets = setsFor(step.dose, context.deload)
  const doneSets = setsDone[index]
  const holdTarget = step.dose.unit === 'seconds' ? parseTarget(step.dose.target) : null

  function finish() {
    const time = new Date().toISOString()
    update((previous) => withLogEntry(previous, { day: today, kind: `renfo_${sessionId}`, finishedAt: time }))
    setFinishedAt(time)
    setStage('finished')
  }

  function goTo(nextIndex: number) {
    if (nextIndex >= steps.length) {
      finish()
      return
    }
    setIndex(nextIndex)
    setStage('ready')
  }

  function completeSet() {
    unlockAudio()
    const done = doneSets + 1
    setSetsDone((previous) => previous.with(index, done))
    setStage(done < totalSets ? 'resting' : 'ready')
  }

  if (stage === 'finished' && finishedAt) {
    return (
      <div className={styles.screen}>
        <FinishPanel title={`${session.title} terminée`} finishedAt={finishedAt} offerStretch />
      </div>
    )
  }

  return (
    <div className={styles.screen}>
      <SessionHeader
        title={session.title}
        progress={`Exercice ${index + 1} sur ${steps.length}`}
        confirmQuit={index > 0 || doneSets > 0}
      />

      {stage === 'holding' && holdTarget && (
        <HoldTimer
          steps={holdSteps(holdTarget.min, holdTarget.max, step.dose.per_side)}
          tone="renfo"
          onDone={completeSet}
        />
      )}

      {stage === 'resting' && (
        <RestTimer
          seconds={state.settings.restSeconds}
          next={`série ${doneSets + 1} sur ${totalSets}, ${exercise.name}`}
          onDone={() => setStage('ready')}
        />
      )}

      {stage === 'ready' && (
        <ExerciseStep
          key={index}
          exercise={exercise}
          dose={step.dose}
          deload={context.deload}
          doneSets={doneSets}
          totalSets={totalSets}
          isFirst={index === 0}
          isLast={index === steps.length - 1}
          onSetDone={completeSet}
          onStartHold={() => {
            unlockAudio()
            setStage('holding')
          }}
          onPrevious={() => goTo(index - 1)}
          onNext={() => goTo(index + 1)}
        />
      )}
    </div>
  )
}
