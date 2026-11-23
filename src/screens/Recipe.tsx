import { ChevronLeft } from 'lucide-react'
import { meals } from '../data/meals'
import { forServings } from '../lib/meals'
import { goBack } from '../lib/router'
import { useAppState } from '../state/appStateContext'
import styles from './Meals.module.css'
import { ServingsChoice } from './ServingsChoice'

export function Recipe({ id }: { id: string }) {
  const { state } = useAppState()
  const servings = state.settings.servings

  if (!Object.hasOwn(meals.recipes, id)) {
    return (
      <div className={styles.page}>
        <h1>Recette introuvable</h1>
        <a href="#/repas">Voir les repas de la semaine</a>
      </div>
    )
  }

  const recipe = meals.recipes[id]
  const details = [`${recipe.minutes} min`, recipe.equipment].filter(Boolean).join(', ')

  return (
    <article className={styles.page}>
      <button type="button" className={styles.back} onClick={() => goBack('/repas')}>
        <ChevronLeft size={20} aria-hidden="true" />
        Retour
      </button>
      <div>
        <h1>{recipe.title}</h1>
        <p className={styles.muted}>{details}</p>
      </div>

      <ServingsChoice />

      <section aria-labelledby="ingredients-title" className="card">
        <h2 id="ingredients-title">Ingrédients</h2>
        {recipe.yield && <p className={styles.muted}>{forServings(recipe.yield, servings)}</p>}
        <ul className={styles.ingredients}>
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient.one}>{forServings(ingredient, servings)}</li>
          ))}
        </ul>
      </section>

      {recipe.steps.length > 0 && (
        <section aria-labelledby="steps-title" className="card">
          <h2 id="steps-title">Étapes</h2>
          <ol className={styles.steps}>
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {recipe.note && <p className={styles.note}>{recipe.note}</p>}
    </article>
  )
}
