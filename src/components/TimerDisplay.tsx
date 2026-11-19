import { formatClock } from '../lib/format'
import { displaySeconds } from '../lib/timer'
import { useFocusOnMount } from '../lib/useFocusOnMount'
import styles from './TimerDisplay.module.css'

interface TimerDisplayProps {
  remainingMs: number
  phase: string
  detail?: string
  next?: string
  tone: 'renfo' | 'course' | 'recup'
}

export function TimerDisplay({ remainingMs, phase, detail, next, tone }: TimerDisplayProps) {
  const phaseRef = useFocusOnMount<HTMLParagraphElement>()
  return (
    <div className={`${styles.display} ${styles[tone]}`}>
      <p ref={phaseRef} tabIndex={-1} className={styles.phase} aria-live="polite">
        {phase}
      </p>
      <p className={styles.digits} role="timer" aria-label={`${displaySeconds(remainingMs)} secondes restantes`}>
        {formatClock(displaySeconds(remainingMs))}
      </p>
      {detail && <p className={styles.detail}>{detail}</p>}
      {next && <p className={styles.next}>Ensuite&nbsp;: {next}</p>}
    </div>
  )
}
