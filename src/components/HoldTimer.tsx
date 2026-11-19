import { useState } from 'react'
import { useCue } from '../lib/useCue'
import { useSequenceTimer } from '../lib/useSequenceTimer'
import type { HoldStep } from '../lib/holdSteps'
import styles from './timerLayout.module.css'
import { TimerControls } from './TimerControls'
import { TimerDisplay } from './TimerDisplay'

interface HoldTimerProps {
  steps: HoldStep[]
  tone: 'renfo' | 'recup'
  onDone: () => void
}

export function HoldTimer({ steps, tone, onDone }: HoldTimerProps) {
  const cue = useCue()
  const [markedStep, setMarkedStep] = useState(-1)
  const timer = useSequenceTimer(steps, {
    onPhaseStart: (index) => cue(steps[index].isHold ? 'work' : 'switch'),
    onMark: (index) => {
      setMarkedStep(index)
      cue('mark')
    },
    onDone: () => {
      cue('done')
      onDone()
    },
  })
  const { index, remainingMs } = timer.position
  const isLast = index === steps.length - 1

  return (
    <div className={styles.hold}>
      <TimerDisplay remainingMs={remainingMs} phase={steps[index].label} next={steps[index + 1]?.label} tone={tone} />
      <p className={styles.mark} aria-live="polite">
        {markedStep === index ? 'Tu as fait le minimum : continue si tu peux, ou arrête-toi.' : ''}
      </p>
      <TimerControls timer={timer} skipLabel={isLast ? 'Terminer' : 'Passer'} />
    </div>
  )
}
