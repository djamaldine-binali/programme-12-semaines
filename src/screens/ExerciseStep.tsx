import buttons from '../components/buttons.module.css'
import { SetCounter } from '../components/SetCounter'
import type { Dose, Exercise } from '../data/types'
import { doseText, setGoal, sideLabel } from '../lib/dose'
import { StepLayout } from './StepLayout'
import styles from './Workout.module.css'

interface ExerciseStepProps {
  exercise: Exercise
  dose: Dose
  deload: boolean
  doneSets: number
  totalSets: number
  isFirst: boolean
  isLast: boolean
  onSetDone: () => void
  onStartHold: () => void
  onPrevious: () => void
  onNext: () => void
}

export function ExerciseStep(props: ExerciseStepProps) {
  const { exercise, dose, deload, doneSets, totalSets, isFirst, isLast } = props
  const allSetsDone = doneSets >= totalSets
  const side = sideLabel(dose)

  return (
    <StepLayout
      exercise={exercise}
      dose={
        <p className={styles.dose}>
          {doseText(dose, deload)}
          {deload && <span className={styles.muted}> · semaine allégée</span>}
        </p>
      }
      isFirst={isFirst}
      onPrevious={props.onPrevious}
      onSkip={allSetsDone ? undefined : props.onNext}
    >
      <SetCounter done={doneSets} total={totalSets} />
      {allSetsDone ? (
        <button type="button" className={`${buttons.button} ${buttons.renfo} ${buttons.block}`} onClick={props.onNext}>
          {isLast ? 'Terminer la séance' : 'Exercice suivant'}
        </button>
      ) : (
        <>
          <p className={styles.goal}>
            {setGoal(dose)}
            {side && ` ${side}`}
          </p>
          {dose.unit === 'seconds' ? (
            <button
              type="button"
              className={`${buttons.button} ${buttons.renfo} ${buttons.block}`}
              onClick={props.onStartHold}
            >
              Lancer la série
            </button>
          ) : (
            <button
              type="button"
              className={`${buttons.button} ${buttons.renfo} ${buttons.block}`}
              onClick={props.onSetDone}
            >
              Série faite
            </button>
          )}
        </>
      )}
    </StepLayout>
  )
}
