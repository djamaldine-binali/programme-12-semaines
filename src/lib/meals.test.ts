import { describe, expect, it } from 'vitest'
import { formatCheckedOn, formatEuros, forServings, listTotalCents, shoppingList } from './meals'

describe('meals helpers', () => {
  it('formats prices in euros', () => {
    expect(formatEuros(1234).replace(/\s/g, ' ')).toBe('12,34 €')
  })

  it('adds up packs times their price', () => {
    const items = [
      { product: 'Bananes', pack: 'lot de 5', quantity: 2, price_cents: 249 },
      { product: 'Lait', pack: 'brique de 1 L', quantity: 1, price_cents: 101 },
    ]
    expect(listTotalCents(items)).toBe(599)
  })

  it('picks the quantity for the chosen number of people', () => {
    const quantity = { one: '1 banane', two: '2 bananes' }
    expect(forServings(quantity, 1)).toBe('1 banane')
    expect(forServings(quantity, 2)).toBe('2 bananes')
  })

  it('finds a shopping list by id, for one or two people', () => {
    const found = shoppingList('lundi-mercredi', 2)
    expect(found?.list).toBe(found?.block.two)
    expect(shoppingList('inconnue', 1)).toBeNull()
  })

  it('writes the price date in words', () => {
    expect(formatCheckedOn('2026-11-23')).toBe('23 novembre 2026')
  })
})
