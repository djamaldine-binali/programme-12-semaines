import buttons from '../components/buttons.module.css'
import type { Exercise } from '../data/types'
import { StepLayout } from './StepLayout'
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
  onDone: () => void
  onSkip: () => void
}

export function RoutineStep({ exercise, dose, note, timed, isFirst, isLast, ...actions }: RoutineStepProps) {
  return (
    <StepLayout
      exercise={exercise}
      dose={<p className={`${styles.dose} ${styles.doseRecup}`}>{dose}</p>}
      note={note}
      isFirst={isFirst}
      onPrevious={actions.onPrevious}
      onSkip={actions.onSkip}
    >
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
          onClick={actions.onDone}
        >
          {isLast ? 'Fait, terminer' : 'Fait, suivant'}
        </button>
      )}
    </StepLayout>
  )
}
