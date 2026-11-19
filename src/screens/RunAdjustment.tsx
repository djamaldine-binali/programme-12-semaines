import { useState } from 'react'
import buttons from '../components/buttons.module.css'
import styles from '../components/GuidedSession.module.css'
import { useAppState } from '../state/appStateContext'

type Choice = 'repeat' | 'step-back'

const confirmations: Record<Choice, string> = {
  repeat: "C'est noté : la semaine prochaine, tu refais cette étape.",
  'step-back': "C'est noté : la semaine prochaine, tu reviens à l'étape d'avant. Ralentis l'allure.",
}

/** Nothing changes on its own: she decides after a hard run or a pain signal. */
export function RunAdjustment({ finishedAt }: { finishedAt: string }) {
  const { state, update } = useAppState()
  const [choice, setChoice] = useState<Choice | null>(null)
  const feeling = state.log.find((entry) => entry.finishedAt === finishedAt)?.feeling

  function choose(next: Choice) {
    // Repeating holds next week on this step; stepping back goes one further.
    const extraShift = next === 'repeat' ? 1 : 2
    update((previous) => ({ ...previous, runShift: previous.runShift + extraShift }))
    setChoice(next)
  }

  if (choice) return <p className={styles.safety}>{confirmations[choice]}</p>

  return (
    <div className={styles.intro}>
      {feeling === 'dur' && (
        <div className={styles.choice}>
          <p>Cette étape t'a paru dure. Tu veux la refaire la semaine prochaine avant d'avancer&nbsp;?</p>
          <button
            type="button"
            className={`${buttons.button} ${buttons.course} ${buttons.block}`}
            onClick={() => choose('repeat')}
          >
            Refaire cette étape
          </button>
        </div>
      )}
      <div className={styles.choice}>
        <p className={styles.muted}>Douleur aux tibias ou aux genoux&nbsp;?</p>
        <button
          type="button"
          className={`${buttons.button} ${buttons.secondary} ${buttons.block}`}
          onClick={() => choose('step-back')}
        >
          Revenir à l'étape d'avant
        </button>
      </div>
    </div>
  )
}
