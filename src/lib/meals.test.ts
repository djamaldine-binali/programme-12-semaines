import { describe, expect, it } from 'vitest'
import { meals } from '../data/meals'
import { formatCheckedOn, formatEuros, forServings, listTotalCents, weeklyList, weeklyTotalCents } from './meals'

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

  it('picks the weekly list for the chosen number of people', () => {
    expect(weeklyList(1)).toBe(meals.shopping.one)
    expect(weeklyList(2)).toBe(meals.shopping.two)
  })

  it('adds up the weekly list across aisles', () => {
    const list = {
      sections: [
        { title: 'Crèmerie', items: [{ product: 'Lait', pack: 'brique de 1 L', quantity: 1, price_cents: 101 }] },
        { title: 'Épicerie', items: [{ product: 'Riz', pack: '1 kg', quantity: 2, price_cents: 180 }] },
      ],
      leftovers: [],
    }
    expect(weeklyTotalCents(list)).toBe(461)
  })

  it('writes the price date in words', () => {
    expect(formatCheckedOn('2026-11-23')).toBe('23 novembre 2026')
  })
})
