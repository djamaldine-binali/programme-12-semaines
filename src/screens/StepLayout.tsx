import { ChevronLeft, SkipForward } from 'lucide-react'
import type { ReactNode } from 'react'
import { Diagram } from '../components/Diagram'
import layout from '../components/sessionLayout.module.css'
import { VideoFacade } from '../components/VideoFacade'
import type { Exercise } from '../data/types'
import { useFocusOnMount } from '../lib/useFocusOnMount'
import styles from './Workout.module.css'

interface StepLayoutProps {
  exercise: Exercise
  /** The dose paragraph shown under the exercise name. */
  dose: ReactNode
  note?: string
  isFirst: boolean
  onPrevious: () => void
  /** Without it, there is no "Passer" button. */
  onSkip?: () => void
  /** Main actions, above the previous and skip buttons. */
  children: ReactNode
}

export function StepLayout({ exercise, dose, note, isFirst, onPrevious, onSkip, children }: StepLayoutProps) {
  const headingRef = useFocusOnMount<HTMLHeadingElement>()

  return (
    <>
      <div className={styles.content}>
        <Diagram exercise={exercise} size="large" />
        <div>
          <h1 ref={headingRef} tabIndex={-1} className={styles.name}>
            {exercise.name}
          </h1>
          {dose}
        </div>
        <p className={styles.cue}>{exercise.cue}</p>
        {note && <p className={styles.muted}>{note}</p>}
        <VideoFacade exercise={exercise} />
      </div>

      <div className={layout.actions}>
        {children}
        <div className={styles.nav}>
          <button type="button" className={styles.navButton} onClick={onPrevious} disabled={isFirst}>
            <ChevronLeft size={20} aria-hidden="true" />
            Précédent
          </button>
          {onSkip && (
            <button type="button" className={styles.navButton} onClick={onSkip}>
              Passer
              <SkipForward size={20} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </>
  )
}
