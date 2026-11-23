import { meals, type ForServings, type ShoppingBlock, type ShoppingItem, type ShoppingList } from '../data/meals'
import type { Servings } from './storage'

const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

/** 1234 → "12,34 €" */
export function formatEuros(cents: number): string {
  return euros.format(cents / 100)
}

export function forServings(text: ForServings, servings: Servings): string {
  return servings === 2 ? text.two : text.one
}

export function itemTotalCents(item: ShoppingItem): number {
  return item.quantity * item.price_cents
}

export function listTotalCents(items: ShoppingItem[]): number {
  return items.reduce((total, item) => total + itemTotalCents(item), 0)
}

export function pantryTotalCents(): number {
  return meals.pantry.reduce((total, item) => total + item.price_cents, 0)
}

export function listFor(block: ShoppingBlock, servings: Servings): ShoppingList {
  return servings === 2 ? block.two : block.one
}

export function shoppingList(blockId: string, servings: Servings): { block: ShoppingBlock; list: ShoppingList } | null {
  const block = meals.shopping.find((candidate) => candidate.id === blockId)
  if (!block) return null
  return { block, list: listFor(block, servings) }
}

const longDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/** "2026-11-23" → "23 novembre 2026" */
export function formatCheckedOn(key: string): string {
  return longDate.format(new Date(`${key}T00:00:00Z`))
}
