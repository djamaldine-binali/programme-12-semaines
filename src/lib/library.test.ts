import { describe, expect, it } from 'vitest'
import { appearancesOf, describeMonths, exercisesByGroup } from './library'

describe('appearancesOf', () => {
  it('lists the months and doses of a session exercise', () => {
    expect(appearancesOf('squat_chaise')).toEqual([
      { place: 'Séance A', months: [1, 2], doses: ['Mois 1\u00a0: 2 × 10', 'Mois 2\u00a0: 3 × 12'] },
    ])
  })

  it('knows the routines and the month 1 intervals', () => {
    expect(appearancesOf('menton')).toEqual([{ place: 'Posture', months: [1, 2, 3], doses: ['10 × 5 s'] }])
    expect(appearancesOf('mountain')[0]).toMatchObject({ place: 'Fractionné', months: [1] })
  })
})

describe('exercisesByGroup', () => {
  it('puts each of the 34 exercises in exactly one group', () => {
    const all = exercisesByGroup().flatMap((group) => group.ids)
    expect(all).toHaveLength(34)
    expect(new Set(all).size).toBe(34)
  })

  it('keeps the harder versions that left the sessions in a last group', () => {
    const later = exercisesByGroup().find((group) => group.group === 'Pour plus tard')
    expect(later?.ids).toEqual(['pont_1j', 'bulgares', 'pompes', 'planche_touches', 'dips_tendues'])
  })
})

describe('describeMonths', () => {
  it('reads naturally', () => {
    expect(describeMonths([1, 2, 3])).toBe('tous les mois')
    expect(describeMonths([3])).toBe('mois 3')
    expect(describeMonths([1, 2])).toBe('mois 1 et 2')
  })
})
