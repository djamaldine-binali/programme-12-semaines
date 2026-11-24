import { ChevronRight } from 'lucide-react'
import { OtterMark } from '../components/OtterMark'
import { program } from '../data/program'
import type { Tip } from '../data/types'
import { formatNumber } from '../lib/format'
import styles from './Tips.module.css'

function TipList({ tips }: { tips: Tip[] }) {
  return (
    <ul className={styles.tips}>
      {tips.map((tip) => (
        <li key={tip.title}>
          <h3>{tip.title}</h3>
          <p>{tip.text}</p>
        </li>
      ))}
    </ul>
  )
}

export function Tips() {
  const { goals } = program.meta
  const steps = program.rules.steps_per_day_by_month

  return (
    <div className={styles.page}>
      <h1>Conseils</h1>

      <a href="#/repas" className={styles.mealsLink}>
        <OtterMark size={52} />
        <span>
          <strong>Repas de la semaine</strong>
          <span>Les menus du jour, les recettes et la liste de courses.</span>
        </span>
        <ChevronRight size={22} aria-hidden="true" />
      </a>

      <section aria-labelledby="goals-title" className={styles.goals}>
        <h2 id="goals-title" className="visually-hidden">
          Tes objectifs
        </h2>
        <div className={`${styles.goal} ${styles.affiner}`}>
          <h3>Affiner</h3>
          <p>{goals.affiner}</p>
        </div>
        <div className={`${styles.goal} ${styles.muscler}`}>
          <h3>Muscler</h3>
          <p>{goals.muscler}</p>
        </div>
      </section>

      <section aria-labelledby="body-title" className={styles.body}>
        <h2 id="body-title">Écouter son corps</h2>
        <p>{program.rules.listen_to_body}</p>
      </section>

      <section aria-labelledby="daily-title" className="card">
        <h2 id="daily-title">Au quotidien</h2>
        <TipList tips={program.daily_life} />
        <p className={styles.steps}>
          Pas par jour&nbsp;: {steps.map((count, index) => `${formatNumber(count)} au mois ${index + 1}`).join(', ')}.
        </p>
      </section>

      <section aria-labelledby="food-title" className="card">
        <h2 id="food-title">Bien manger, simplement</h2>
        <TipList tips={program.nutrition} />
      </section>

      <section aria-labelledby="run-title" className="card">
        <h2 id="run-title">En course</h2>
        <p>{program.running.pace_note}</p>
        <p>{program.rules.running_pain_rule}</p>
      </section>
    </div>
  )
}
