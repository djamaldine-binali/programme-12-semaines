import { ChevronLeft, SkipForward } from 'lucide-react'
import buttons from '../components/buttons.module.css'
import { Diagram } from '../components/Diagram'
import { SetCounter } from '../components/SetCounter'
import { VideoFacade } from '../components/VideoFacade'
import type { Dose, Exercise } from '../data/types'
import { doseText, setGoal, sideLabel } from '../lib/dose'
import { useFocusOnMount } from '../lib/useFocusOnMount'
import layout from '../components/sessionLayout.module.css'
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
  const headingRef = useFocusOnMount<HTMLHeadingElement>()

  return (
    <>
      <div className={styles.content}>
        <Diagram exercise={exercise} size="large" />
        <div>
          <h1 ref={headingRef} tabIndex={-1} className={styles.name}>
            {exercise.name}
          </h1>
          <p className={styles.dose}>
            {doseText(dose, deload)}
            {deload && <span className={styles.muted}> · semaine allégée</span>}
          </p>
        </div>
        <p className={styles.cue}>{exercise.cue}</p>
        <VideoFacade exercise={exercise} />
      </div>

      <div className={layout.actions}>
        <SetCounter done={doneSets} total={totalSets} />
        {allSetsDone ? (
          <button
            type="button"
            className={`${buttons.button} ${buttons.renfo} ${buttons.block}`}
            onClick={props.onNext}
          >
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
        <div className={styles.nav}>
          <button type="button" className={styles.navButton} onClick={props.onPrevious} disabled={isFirst}>
            <ChevronLeft size={20} aria-hidden="true" />
            Précédent
          </button>
          {!allSetsDone && (
            <button type="button" className={styles.navButton} onClick={props.onNext}>
              Passer
              <SkipForward size={20} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </>
  )
}
