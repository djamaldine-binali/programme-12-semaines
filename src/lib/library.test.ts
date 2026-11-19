import { describe, expect, it } from 'vitest'
import { program } from '../data/program'
import { appearancesOf, describeMonths, exercisesByGroup } from './library'

describe('appearancesOf', () => {
  it('finds every exercise somewhere in the program', () => {
    for (const id of Object.keys(program.exercises)) expect(appearancesOf(id).length).toBeGreaterThan(0)
  })

  it('lists the months and doses of a session exercise', () => {
    expect(appearancesOf('squat')).toEqual([
      { place: 'Séance A', months: [2, 3], doses: ['Mois 2\u00a0: 4 × 15', 'Mois 3\u00a0: 4 × 12, descente sur 4 s'] },
    ])
  })

  it('knows the routines and the month 1 intervals', () => {
    expect(appearancesOf('menton')).toEqual([{ place: 'Posture', months: [1, 2, 3], doses: ['10 × 5 s'] }])
    expect(appearancesOf('mountain')[0]).toMatchObject({ place: 'Fractionné', months: [1] })
  })
})

describe('exercisesByGroup', () => {
  it('puts each of the 33 exercises in exactly one group', () => {
    const all = exercisesByGroup().flatMap((group) => group.ids)
    expect(all).toHaveLength(33)
    expect(new Set(all).size).toBe(33)
  })
})

describe('describeMonths', () => {
  it('reads naturally', () => {
    expect(describeMonths([1, 2, 3])).toBe('tous les mois')
    expect(describeMonths([3])).toBe('mois 3')
    expect(describeMonths([1, 2])).toBe('mois 1 et 2')
  })
})
