import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { meals } from '../data/meals'
import { activityInfo } from '../lib/activities'
import { formatCheckedOn, formatEuros, pantryTotalCents, weeklyList, weeklyTotalCents } from '../lib/meals'
import { activityFor, sessionContext, weekdayOf } from '../lib/schedule'
import { useToday } from '../lib/useToday'
import { useAppState } from '../state/appStateContext'
import styles from './Meals.module.css'
import { ServingsChoice } from './ServingsChoice'

const shortNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export function Meals() {
  const { state } = useAppState()
  const today = useToday()
  const todayIndex = weekdayOf(today)
  const [selectedIndex, setSelectedIndex] = useState(todayIndex)
  const mealDay = meals.days[selectedIndex]
  const servings = state.settings.servings
  const { week } = sessionContext(state.startDate, today)

  return (
    <div className={styles.page}>
      <a href="#/conseils" className={styles.back}>
        <ChevronLeft size={20} aria-hidden="true" />
        Conseils
      </a>
      <h1>Repas de la semaine</h1>
      <p className={styles.lead}>
        Des plats que tu aimes, cuits au four ou à l'airfryer plutôt que frits, avec des légumes et des protéines à
        chaque repas. Rien n'est interdit&nbsp;: mange à ta faim, et si tu as encore faim, ajoute des légumes, un fruit
        ou un yaourt.
      </p>

      <ServingsChoice />

      <div className={styles.days} role="group" aria-label="Jour de la semaine">
        {meals.days.map((candidate, index) => (
          <button
            key={candidate.day}
            type="button"
            className={`${styles.dayButton} ${styles[activityInfo(activityFor(week, index), week, state.runShift).tone]}`}
            aria-pressed={index === selectedIndex}
            data-today={index === todayIndex || undefined}
            onClick={() => setSelectedIndex(index)}
          >
            <span aria-hidden="true">{shortNames[index]}</span>
            <span className="visually-hidden">
              {candidate.day}
              {index === todayIndex && ", aujourd'hui"}
            </span>
          </button>
        ))}
      </div>

      <section aria-labelledby="day-title" className={`card ${styles.day}`}>
        <h2 id="day-title" className={styles.dayTitle}>
          {mealDay.day}
          {selectedIndex === todayIndex && <span className={styles.todayTag}>aujourd'hui</span>}
        </h2>
        <p className={styles.muted}>{mealDay.why}</p>
        <ul className={styles.meals}>
          {mealDay.meals.map((meal) => (
            <li key={meal.slot}>
              <a href={`#/repas/recette/${meal.recipe}`} className={styles.mealLink}>
                <span className={styles.slot}>{meal.slot}</span>
                <span className={styles.mealTitle}>{meals.recipes[meal.recipe].title}</span>
                {meal.note && <span className={styles.muted}>{meal.note}</span>}
                <ChevronRight size={20} aria-hidden="true" className={styles.chevron} />
              </a>
            </li>
          ))}
          {mealDay.prep && (
            <li>
              <a href={`#/repas/recette/${mealDay.prep}`} className={styles.mealLink}>
                <span className={styles.slot}>À préparer aussi</span>
                <span className={styles.mealTitle}>{meals.recipes[mealDay.prep].title}</span>
                <ChevronRight size={20} aria-hidden="true" className={styles.chevron} />
              </a>
            </li>
          )}
        </ul>
      </section>

      <section aria-labelledby="shopping-title" className="card">
        <h2 id="shopping-title">Courses</h2>
        <p className={styles.muted}>
          Prix relevés le {formatCheckedOn(meals.source.checked_on)} sur le site de l'{meals.source.store}. Ils bougent
          avec les promos&nbsp;: prends les totaux comme un ordre d'idée.
        </p>
        <ul className={styles.meals}>
          <li>
            <a href="#/repas/courses" className={styles.mealLink}>
              <span className={styles.mealTitle}>Courses de la semaine</span>
              <span className={styles.muted}>Une seule liste, rangée par rayon.</span>
              <span className={styles.price}>{formatEuros(weeklyTotalCents(weeklyList(servings)))}</span>
              <ChevronRight size={20} aria-hidden="true" className={styles.chevron} />
            </a>
          </li>
          <li>
            <a href="#/repas/placard" className={styles.mealLink}>
              <span className={styles.mealTitle}>Le placard</span>
              <span className={styles.muted}>À acheter une fois, ça dure plusieurs semaines.</span>
              <span className={styles.price}>{formatEuros(pantryTotalCents())}</span>
              <ChevronRight size={20} aria-hidden="true" className={styles.chevron} />
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}
