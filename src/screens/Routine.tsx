import { useState } from 'react'
import buttons from '../components/buttons.module.css'
import { FinishPanel } from '../components/FinishPanel'
import guided from '../components/GuidedSession.module.css'
import { HoldTimer } from '../components/HoldTimer'
import { SessionHeader } from '../components/SessionHeader'
import layout from '../components/sessionLayout.module.css'
import { program } from '../data/program'
import { routineHoldSteps } from '../lib/holdSteps'
import { parseRoutineHold } from '../lib/routineDose'
import { unlockAudio } from '../lib/sound'
import { withLogEntry } from '../lib/storage'
import { useToday } from '../lib/useToday'
import { useWakeLock } from '../lib/useWakeLock'
import { useAppState } from '../state/appStateContext'
import { RoutineStep } from './RoutineStep'

type Stage = 'intro' | 'step' | 'holding' | 'finished'

const routines = {
  posture: {
    title: 'Posture',
    routine: program.posture_routine,
    durationText: `${program.posture_routine.duration_min} min`,
  },
  etirements: {
    title: 'Étirements',
    routine: program.stretch_routine,
    durationText: `${program.stretch_routine.duration_min.join(' à ')} min`,
  },
}

export function Routine({ kind }: { kind: 'posture' | 'etirements' }) {
  const { update } = useAppState()
  const today = useToday()
  const { title, routine, durationText } = routines[kind]
  const holdNote = 'hold_note' in routine ? routine.hold_note : undefined
  const [index, setIndex] = useState(0)
  const [stage, setStage] = useState<Stage>('intro')
  const [finishedAt, setFinishedAt] = useState<string | null>(null)
  useWakeLock(stage === 'step' || stage === 'holding')

  const item = routine.items[index]
  const hold = parseRoutineHold(item.dose)

  function goTo(nextIndex: number) {
    if (nextIndex < routine.items.length) {
      setIndex(nextIndex)
      setStage('step')
      return
    }
    const time = new Date().toISOString()
    update((previous) => withLogEntry(previous, { day: today, kind, finishedAt: time }))
    setFinishedAt(time)
    setStage('finished')
  }

  if (stage === 'finished' && finishedAt) {
    return (
      <div className={layout.screen}>
        <FinishPanel title={`${title}\u00a0: c'est fait`} finishedAt={finishedAt} offerStretch={false} />
      </div>
    )
  }

  if (stage === 'intro') {
    return (
      <div className={layout.screen}>
        <SessionHeader title={title} confirmQuit={false} />
        <div className={guided.intro}>
          <div>
            <h1>{title}</h1>
            <p className={guided.muted}>
              {durationText}, {routine.when}.
            </p>
          </div>
          {holdNote && <p>{holdNote}</p>}
          <ol className={guided.steps}>
            {routine.items.map((routineItem) => (
              <li key={routineItem.exercise}>
                <span>{program.exercises[routineItem.exercise].name}</span>
                <span className={guided.muted}>{routineItem.dose}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className={layout.actions}>
          <button
            type="button"
            className={`${buttons.button} ${buttons.recup} ${buttons.block}`}
            onClick={() => {
              unlockAudio()
              setStage('step')
            }}
          >
            Démarrer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={layout.screen}>
      <SessionHeader
        title={title}
        progress={`${index + 1} sur ${routine.items.length}`}
        confirmQuit={index > 0 || stage === 'holding'}
      />
      {stage === 'holding' && hold ? (
        <HoldTimer steps={routineHoldSteps(hold)} tone="recup" onDone={() => goTo(index + 1)} />
      ) : (
        <RoutineStep
          key={index}
          exercise={program.exercises[item.exercise]}
          dose={item.dose}
          note={holdNote}
          timed={hold !== null}
          isFirst={index === 0}
          isLast={index === routine.items.length - 1}
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
