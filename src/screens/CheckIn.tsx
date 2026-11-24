import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import buttons from '../components/buttons.module.css'
import { checkInQuestions, type CheckInField } from '../lib/checkIn'
import { navigate } from '../lib/router'
import { sessionContext } from '../lib/schedule'
import { withCheckIn, type CheckInLevel } from '../lib/storage'
import { useToday } from '../lib/useToday'
import { useAppState } from '../state/appStateContext'
import { ChoiceGroup } from './ChoiceGroup'
import styles from './CheckIn.module.css'

export function CheckIn() {
  const { state, update } = useAppState()
  const today = useToday()
  const { week } = sessionContext(state.startDate, today)
  const previous = state.checkIns.find((checkIn) => checkIn.week === week)
  const [answers, setAnswers] = useState<Partial<Record<CheckInField, CheckInLevel>>>(previous ?? {})
  const complete = checkInQuestions.every((question) => answers[question.field] !== undefined)

  function save() {
    const { energy, hunger, sleep, sessions, recovery } = answers
    if (!energy || !hunger || !sleep || !sessions || !recovery) return
    update((current) => withCheckIn(current, { week, day: today, energy, hunger, sleep, sessions, recovery }))
    navigate('/suivi', { replace: true })
  }

  return (
    <div className={styles.page}>
      <a href="#/suivi" className={styles.back}>
        <ChevronLeft size={20} aria-hidden="true" />
        Suivi
      </a>
      <h1>Bilan de la semaine {week}</h1>
      <p className={styles.muted}>
        Une minute pour dire comment tu te sens. Une semaine difficile ne change rien&nbsp;: l'app te propose un
        ajustement seulement si ça dure.
      </p>
      <div className="card">
        {checkInQuestions.map((question) => (
          <ChoiceGroup
            key={question.field}
            legend={question.question}
            options={question.answers.map((label, index) => ({ value: (index + 1) as CheckInLevel, label }))}
            value={answers[question.field] ?? 0}
            stacked
            onChange={(level) => setAnswers((current) => ({ ...current, [question.field]: level }))}
          />
        ))}
      </div>
      <button
        type="button"
        className={`${buttons.button} ${buttons.primary} ${buttons.block}`}
        disabled={!complete}
        onClick={save}
      >
        Enregistrer mon bilan
      </button>
    </div>
  )
}
