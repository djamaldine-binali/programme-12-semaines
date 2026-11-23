import { ChevronLeft } from 'lucide-react'
import { meals, type ShoppingItem } from '../data/meals'
import {
  formatCheckedOn,
  formatEuros,
  itemTotalCents,
  listTotalCents,
  pantryTotalCents,
  shoppingList,
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

function Pantry() {
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

export function Shopping({ id }: { id: string }) {
  const { state } = useAppState()
  if (id === 'placard') return <Pantry />

  const found = shoppingList(id, state.settings.servings)
  if (!found) {
    return (
      <div className={styles.page}>
        <h1>Liste introuvable</h1>
        <a href="#/repas">Voir les repas de la semaine</a>
      </div>
    )
  }

  const { block, list } = found
  return (
    <div className={styles.page}>
      <BackToMeals />
      <h1>Courses&nbsp;: {block.title.toLowerCase()}</h1>
      <ServingsChoice />
      <Items items={list.items} />
      <p className={styles.total}>
        <span>Total</span>
        <span>{formatEuros(listTotalCents(list.items))}</span>
      </p>
      {list.already.length > 0 && (
        <section aria-labelledby="already-title">
          <h2 id="already-title">Il t'en reste des courses d'avant</h2>
          <p className={styles.muted}>{list.already.join(', ')}.</p>
        </section>
      )}
      <p className={styles.muted}>Les épices, l'huile, le riz et les pâtes sont dans la liste du placard.</p>
      <Source />
    </div>
  )
}
