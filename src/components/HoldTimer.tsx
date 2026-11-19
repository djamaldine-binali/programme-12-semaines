import { useState } from 'react'
import { useCue } from '../lib/useCue'
import { useSequenceTimer } from '../lib/useSequenceTimer'
import type { HoldStep } from '../lib/holdSteps'
import buttons from './buttons.module.css'
import styles from './timerLayout.module.css'
import { TimerDisplay } from './TimerDisplay'

interface HoldTimerProps {
  steps: HoldStep[]
  tone: 'renfo' | 'recup'
  onDone: () => void
}

export function HoldTimer({ steps, tone, onDone }: HoldTimerProps) {
  const cue = useCue()
  const [markReached, setMarkReached] = useState(-1)
  const timer = useSequenceTimer(steps, {
    onPhaseStart: (index) => cue(steps[index].isHold ? 'work' : 'switch'),
    onMark: (index) => {
      setMarkReached(index)
      cue('mark')
    },
    onDone: () => {
      cue('done')
      onDone()
    },
  })
  const step = steps[timer.position.index]
  const nextStep = steps[timer.position.index + 1]
  const isLast = timer.position.index === steps.length - 1

  return (
    <div className={styles.hold}>
      <TimerDisplay remainingMs={timer.position.remainingMs} phase={step.label} next={nextStep?.label} tone={tone} />
      <p className={styles.mark} aria-live="polite">
        {markReached === timer.position.index ? 'Tu as fait le minimum : continue si tu peux, ou arrête-toi.' : ''}
      </p>
      <div className={styles.controls}>
        <button
          type="button"
          className={`${buttons.button} ${buttons.secondary}`}
          onClick={timer.running ? timer.pause : timer.resume}
        >
          {timer.running ? 'Pause' : 'Reprendre'}
        </button>
        <button type="button" className={`${buttons.button} ${buttons.recup}`} onClick={timer.skipPhase}>
          {isLast ? 'Terminer' : 'Passer'}
        </button>
      </div>
    </div>
  )
}
