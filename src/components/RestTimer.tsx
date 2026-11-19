import { useCue } from '../lib/useCue'
import { useSequenceTimer } from '../lib/useSequenceTimer'
import styles from './timerLayout.module.css'
import { TimerControls } from './TimerControls'
import { TimerDisplay } from './TimerDisplay'

interface RestTimerProps {
  seconds: number
  next: string
  onDone: () => void
}

export function RestTimer({ seconds, next, onDone }: RestTimerProps) {
  const cue = useCue()
  const timer = useSequenceTimer([{ durationMs: seconds * 1000 }], {
    onDone: () => {
      cue('work')
      onDone()
    },
  })

  return (
    <div className={styles.hold}>
      <TimerDisplay remainingMs={timer.position.remainingMs} phase="Repos" next={next} tone="recup" />
      <TimerControls timer={timer} skipLabel="Passer le repos" />
    </div>
  )
}
