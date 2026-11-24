import { ChevronLeft } from 'lucide-react'
import { Diagram } from '../components/Diagram'
import { VideoFacade } from '../components/VideoFacade'
import { program } from '../data/program'
import { appearancesOf, describeMonths } from '../lib/library'
import styles from './Library.module.css'

export function ExerciseSheet({ id }: { id: string }) {
  if (!Object.hasOwn(program.exercises, id)) {
    return (
      <div className={styles.page}>
        <h1>Fiche introuvable</h1>
        <a href="#/bibliotheque">Voir toutes les fiches</a>
      </div>
    )
  }

  const exercise = program.exercises[id]
  const appearances = appearancesOf(id)
  return (
    <article className={styles.page}>
      <a href="#/bibliotheque" className={styles.back}>
        <ChevronLeft size={20} aria-hidden="true" />
        Toutes les fiches
      </a>
      <Diagram exercise={exercise} size="large" />
      <h1>{exercise.name}</h1>
      <p className={styles.cue}>{exercise.cue}</p>
      <VideoFacade exercise={exercise} />

      <section aria-labelledby="where-title">
        <h2 id="where-title">Dans le programme</h2>
        {appearances.length === 0 ? (
          <p className={styles.cue}>
            Pas pour l'instant. C'est une version plus dure, pour quand les autres deviennent faciles.
          </p>
        ) : (
          <ul className={styles.where}>
            {appearances.map((appearance) => (
              <li key={appearance.place}>
                <strong>
                  {appearance.place}, {describeMonths(appearance.months)}
                </strong>
                {appearance.doses.map((dose) => (
                  <span key={dose}>{dose}</span>
                ))}
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  )
}
