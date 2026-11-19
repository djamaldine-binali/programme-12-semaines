import { ChevronLeft, SkipForward } from 'lucide-react'
import buttons from '../components/buttons.module.css'
import { Diagram } from '../components/Diagram'
import layout from '../components/sessionLayout.module.css'
import { VideoFacade } from '../components/VideoFacade'
import type { Exercise } from '../data/types'
import styles from './Workout.module.css'

interface RoutineStepProps {
  exercise: Exercise
  dose: string
  note?: string
  timed: boolean
  isFirst: boolean
  isLast: boolean
  onStartHold: () => void
  onPrevious: () => void
  onNext: () => void
}

export function RoutineStep({ exercise, dose, note, timed, isFirst, isLast, ...actions }: RoutineStepProps) {
  return (
    <>
      <div className={styles.content}>
        <Diagram exercise={exercise} size="large" />
        <div>
          <h1 className={styles.name}>{exercise.name}</h1>
          <p className={`${styles.dose} ${styles.doseRecup}`}>{dose}</p>
        </div>
        <p className={styles.cue}>{exercise.cue}</p>
        {note && <p className={styles.muted}>{note}</p>}
        <VideoFacade exercise={exercise} />
      </div>

      <div className={layout.actions}>
        {timed ? (
          <button
            type="button"
            className={`${buttons.button} ${buttons.recup} ${buttons.block}`}
            onClick={actions.onStartHold}
          >
            Lancer le minuteur
          </button>
        ) : (
          <button
            type="button"
            className={`${buttons.button} ${buttons.recup} ${buttons.block}`}
            onClick={actions.onNext}
          >
            {isLast ? 'Fait, terminer' : 'Fait, suivant'}
          </button>
        )}
        <div className={styles.nav}>
          <button type="button" className={styles.navButton} onClick={actions.onPrevious} disabled={isFirst}>
            <ChevronLeft size={20} aria-hidden="true" />
            Précédent
          </button>
          <button type="button" className={styles.navButton} onClick={actions.onNext}>
            Passer
            <SkipForward size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  )
}
