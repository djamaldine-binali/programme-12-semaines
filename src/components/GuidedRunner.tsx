import { useState, type ReactNode } from 'react'
import { formatDuration } from '../lib/format'
import { totalDurationMs, type GuidedPhase } from '../lib/guidedPhases'
import { useCue } from '../lib/useCue'
import { useSequenceTimer } from '../lib/useSequenceTimer'
import buttons from './buttons.module.css'
import { TimerDisplay } from './TimerDisplay'
import styles from './timerLayout.module.css'

interface GuidedRunnerProps {
  phases: GuidedPhase[]
  markMessage?: string
  onDone: () => void
  children?: ReactNode
}

export function GuidedRunner({ phases, markMessage, onDone, children }: GuidedRunnerProps) {
  const cue = useCue()
  const [markReached, setMarkReached] = useState(false)
  const timer = useSequenceTimer(phases, {
    onPhaseStart: (index) => cue(phases[index].cue),
    onMark: () => {
      setMarkReached(true)
      cue('mark')
    },
    onDone: () => {
      cue('done')
      onDone()
    },
  })
  const { index, remainingMs } = timer.position
  const phase = phases[index]
  const next = phases[index + 1]
  const afterCurrentMs = totalDurationMs(phases.slice(index + 1))
  const totalLeftS = Math.ceil((remainingMs + afterCurrentMs) / 60_000) * 60
  const isLast = index === phases.length - 1
  const showMark = markReached && markMessage !== undefined

  return (
    <div className={styles.hold}>
      <TimerDisplay
        remainingMs={remainingMs}
        phase={phase.label}
        detail={phase.detail}
        next={next?.label}
        tone={phase.tone}
      />
      <p className={styles.mark}>
        <span aria-live="polite">{showMark && markMessage}</span>
        {!showMark && `Fin dans ${formatDuration(totalLeftS)} environ`}
      </p>
      {children}
      <div className={styles.controls}>
        <button
          type="button"
          className={`${buttons.button} ${buttons.secondary}`}
          onClick={timer.running ? timer.pause : timer.resume}
        >
          {timer.running ? 'Pause' : 'Reprendre'}
        </button>
        <button type="button" className={`${buttons.button} ${buttons.recup}`} onClick={timer.skipPhase}>
          {isLast ? 'Terminer' : 'Phase suivante'}
        </button>
      </div>
    </div>
  )
}
