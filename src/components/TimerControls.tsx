import type { SequenceTimer } from '../lib/useSequenceTimer'
import buttons from './buttons.module.css'
import styles from './timerLayout.module.css'

export function TimerControls({ timer, skipLabel }: { timer: SequenceTimer; skipLabel: string }) {
  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={`${buttons.button} ${buttons.secondary}`}
        onClick={timer.running ? timer.pause : timer.resume}
      >
        {timer.running ? 'Pause' : 'Reprendre'}
      </button>
      <button type="button" className={`${buttons.button} ${buttons.recup}`} onClick={timer.skipPhase}>
        {skipLabel}
      </button>
    </div>
  )
}
