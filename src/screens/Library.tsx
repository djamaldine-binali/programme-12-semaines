import { ChevronLeft } from 'lucide-react'
import { Diagram } from '../components/Diagram'
import { program } from '../data/program'
import { appearancesOf, describeMonths, exercisesByGroup } from '../lib/library'
import styles from './Library.module.css'

export function Library() {
  return (
    <div className={styles.page}>
      <a href="#/programme" className={styles.back}>
        <ChevronLeft size={20} aria-hidden="true" />
        Programme
      </a>
      <h1>Les fiches</h1>
      <p className={styles.muted}>En gris la position de départ, en noir l'arrivée.</p>

      {exercisesByGroup().map(({ group, ids }) => (
        <section key={group} aria-labelledby={`group-${group}`}>
          <h2 id={`group-${group}`}>{group}</h2>
          <ul className={styles.grid}>
            {ids.map((id) => {
              const exercise = program.exercises[id]
              return (
                <li key={id}>
                  <a href={`#/bibliotheque/${id}`} className={styles.card}>
                    <Diagram exercise={exercise} />
                    <span className={styles.name}>{exercise.name}</span>
                    <span className={styles.muted}>
                      {appearancesOf(id)
                        .map((appearance) => `${appearance.place}, ${describeMonths(appearance.months)}`)
                        .join(' · ')}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
