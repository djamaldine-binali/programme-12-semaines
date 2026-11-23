import mealsJson from './meals.json'
import type { DayName } from './types'

export interface ForServings {
  one: string
  two: string
}

export interface Recipe {
  title: string
  minutes: number
  equipment: string | null
  yield: ForServings | null
  ingredients: ForServings[]
  steps: string[]
  note: string | null
}

export type MealSlot = 'Petit-déjeuner' | 'Déjeuner' | 'Collation' | 'Dîner'

export interface Meal {
  slot: MealSlot
  recipe: string
  note: string | null
}

export interface MealDay {
  day: DayName
  why: string
  meals: Meal[]
  /** Something to cook ahead that day, like the cookies for the week. */
  prep: string | null
}

export interface ShoppingItem {
  product: string
  pack: string
  quantity: number
  price_cents: number
}

export interface ShoppingSection {
  /** Aisle of the store: "Fruits et légumes", "Crèmerie"… */
  title: string
  items: ShoppingItem[]
}

export interface ShoppingList {
  sections: ShoppingSection[]
  /** What stays in the cupboard or the freezer for the next week. */
  leftovers: string[]
}

export interface WeeklyShopping {
  one: ShoppingList
  two: ShoppingList
  tips: string[]
}

export interface PantryItem {
  product: string
  pack: string
  price_cents: number
}

export interface Meals {
  source: { store: string; checked_on: string }
  recipes: Record<string, Recipe>
  days: MealDay[]
  shopping: WeeklyShopping
  pantry: PantryItem[]
}

// Same cast as program.ts; meals.test.ts checks the values it assumes.
export const meals = mealsJson as Meals
