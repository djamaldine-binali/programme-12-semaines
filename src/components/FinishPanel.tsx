import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { program } from '../data/program'
import { navigate } from '../lib/router'
import { withFeeling, type Feeling } from '../lib/storage'
import { useAppState } from '../state/appStateContext'
import buttons from './buttons.module.css'
import styles from './FinishPanel.module.css'

const feelings: { value: Feeling; label: string }[] = [
  { value: 'facile', label: 'Facile' },
  { value: 'ok', label: 'Ok' },
  { value: 'dur', label: 'Dur' },
]

interface FinishPanelProps {
  title: string
  finishedAt: string
  offerStretch: boolean
  children?: ReactNode
}

export function FinishPanel({ title, finishedAt, offerStretch, children }: FinishPanelProps) {
  const { state, update } = useAppState()
  const feeling = state.log.find((entry) => entry.finishedAt === finishedAt)?.feeling

  return (
    <div className={styles.panel}>
      <div className={styles.heading}>
        <Check size={40} strokeWidth={2.6} aria-hidden="true" />
        <h1>{title}</h1>
        <p>C'est noté dans ton suivi.</p>
      </div>

      <fieldset className={styles.feelings}>
        <legend>Comment tu l'as vécue&nbsp;?</legend>
        <div className={styles.choices}>
          {feelings.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={feeling === option.value}
              onClick={() => update((previous) => withFeeling(previous, finishedAt, option.value))}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      {children}

      <p className={styles.note}>
        <strong>Écoute ton corps.</strong> {program.rules.listen_to_body}
      </p>

      <div className={styles.actions}>
        {offerStretch && (
          <>
            <p>{program.rules.stretch_after}</p>
            <button
              type="button"
              className={`${buttons.button} ${buttons.recup} ${buttons.block}`}
              onClick={() => navigate('/routine/etirements', { replace: true })}
            >
              Enchaîner les étirements
            </button>
          </>
        )}
        <button
          type="button"
          className={`${buttons.button} ${buttons.secondary} ${buttons.block}`}
          onClick={() => navigate('/', { replace: true })}
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  )
}
