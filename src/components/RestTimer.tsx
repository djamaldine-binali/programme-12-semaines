import { useCue } from '../lib/useCue'
import { useSequenceTimer } from '../lib/useSequenceTimer'
import buttons from './buttons.module.css'
import styles from './timerLayout.module.css'
import { TimerDisplay } from './TimerDisplay'

interface RestTimerProps {
  seconds: number
  next: string
  onDone: () => void
}

export function RestTimer({ seconds, next, onDone }: RestTimerProps) {
  const cue = useCue()
  const timer = useSequenceTimer([{ durationMs: seconds * 1000 }], {
    autoStart: true,
    onDone: () => {
      cue('work')
      onDone()
    },
  })

  return (
    <div className={styles.hold}>
      <TimerDisplay remainingMs={timer.position.remainingMs} phase="Repos" next={next} tone="recup" />
      <div className={styles.controls}>
        <button
          type="button"
          className={`${buttons.button} ${buttons.secondary}`}
          onClick={timer.running ? timer.pause : timer.start}
        >
          {timer.running ? 'Pause' : 'Reprendre'}
        </button>
        <button type="button" className={`${buttons.button} ${buttons.recup}`} onClick={timer.skipPhase}>
          Passer le repos
        </button>
      </div>
    </div>
  )
}
