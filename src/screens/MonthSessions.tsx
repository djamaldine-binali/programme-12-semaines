import { program } from '../data/program'
import styles from './Program.module.css'

export function MonthSessions({ month }: { month: number }) {
  return (
    <>
      {(['A', 'B'] as const).map((id) => {
        const session = program.sessions[id]
        return (
          <div key={id} className="card">
            <h3>{session.title}</h3>
            <p className={styles.muted}>{session.focus}</p>
            <ul className={styles.rows}>
              {session.items.map((item) => {
                const version = item.months[month - 1]
                const previous = month > 1 ? item.months[month - 2] : null
                const exercise = program.exercises[version.exercise]
                const isNewExercise = previous !== null && previous.exercise !== version.exercise
                const isNewDose = previous !== null && !isNewExercise && previous.dose.text !== version.dose.text
                return (
                  <li key={version.exercise + version.month}>
                    <a href={`#/bibliotheque/${exercise.id}`} className={styles.exerciseLink}>
                      {exercise.name}
                      {isNewExercise && <span className={styles.change}>Nouvelle version</span>}
                    </a>
                    <span className={styles.dose}>
                      {version.dose.text}
                      {isNewDose && (
                        <span className={styles.detail}>
                          Mois {month - 1}&nbsp;: {previous.dose.text}
                        </span>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </>
  )
}
