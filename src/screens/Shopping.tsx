import { ChevronLeft } from 'lucide-react'
import { meals, type ShoppingItem } from '../data/meals'
import {
  formatCheckedOn,
  formatEuros,
  itemTotalCents,
  pantryTotalCents,
  weeklyList,
  weeklyTotalCents,
} from '../lib/meals'
import { useAppState } from '../state/appStateContext'
import styles from './Meals.module.css'
import { ServingsChoice } from './ServingsChoice'

function BackToMeals() {
  return (
    <a href="#/repas" className={styles.back}>
      <ChevronLeft size={20} aria-hidden="true" />
      Repas de la semaine
    </a>
  )
}

function Source() {
  return (
    <p className={styles.muted}>
      Prix relevés le {formatCheckedOn(meals.source.checked_on)} sur le site de l'{meals.source.store}. Les produits en
      vrac sont comptés à la pièce, au prix d'une pièce moyenne.
    </p>
  )
}

function Items({ items }: { items: ShoppingItem[] }) {
  return (
    <ul className={styles.items}>
      {items.map((item) => (
        <li key={`${item.product}-${item.pack}`}>
          <span>
            <strong>{item.product}</strong>
            <span className={styles.muted}>
              {item.pack}
              {item.quantity > 1 && ` × ${item.quantity}`}
            </span>
          </span>
          <span className={styles.price}>{formatEuros(itemTotalCents(item))}</span>
        </li>
      ))}
    </ul>
  )
}

export function Pantry() {
  return (
    <div className={styles.page}>
      <BackToMeals />
      <h1>Le placard</h1>
      <p className={styles.lead}>
        À acheter une fois&nbsp;: ça sert pour plusieurs recettes et ça dure plusieurs semaines. Le sel et le poivre ne
        sont pas comptés.
      </p>
      <Items items={meals.pantry.map((item) => ({ ...item, quantity: 1 }))} />
      <p className={styles.total}>
        <span>Total</span>
        <span>{formatEuros(pantryTotalCents())}</span>
      </p>
      <Source />
    </div>
  )
}

export function Shopping() {
  const { state } = useAppState()
  const list = weeklyList(state.settings.servings)

  return (
    <div className={styles.page}>
      <BackToMeals />
      <h1>Courses de la semaine</h1>
      <ServingsChoice />
      {list.sections.map((section, index) => (
        <section key={section.title} aria-labelledby={`aisle-${index}`}>
          <h2 id={`aisle-${index}`}>{section.title}</h2>
          <Items items={section.items} />
        </section>
      ))}
      <p className={styles.total}>
        <span>Total</span>
        <span>{formatEuros(weeklyTotalCents(list))}</span>
      </p>
      <section aria-labelledby="tips-title">
        <h2 id="tips-title">Pour que tout tienne la semaine</h2>
        <ul className={styles.ingredients}>
          {meals.shopping.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>
      {list.leftovers.length > 0 && (
        <section aria-labelledby="leftovers-title">
          <h2 id="leftovers-title">Ce qui te restera pour la semaine d'après</h2>
          <ul className={styles.ingredients}>
            {list.leftovers.map((leftover) => (
              <li key={leftover}>{leftover}</li>
            ))}
          </ul>
        </section>
      )}
      <p className={styles.muted}>Les épices, l'huile, le riz et les spaghetti sont dans la liste du placard.</p>
      <Source />
    </div>
  )
}
