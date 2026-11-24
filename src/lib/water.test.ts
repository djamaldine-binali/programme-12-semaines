import { describe, expect, it } from 'vitest'
import { expectedMl, formatCentilitres, formatLitres, suggestedSipMl } from './water'

const at = (hours: number, minutes = 0) => new Date(2027, 0, 4, hours, minutes)

describe('expectedMl', () => {
  it('spreads the goal from 8 am to 9 pm', () => {
    expect(expectedMl(2000, at(7))).toBe(0)
    expect(expectedMl(2000, at(14, 30))).toBe(1000)
    expect(expectedMl(2000, at(21))).toBe(2000)
    expect(expectedMl(2000, at(23))).toBe(2000)
  })
})

describe('suggestedSipMl', () => {
  it('asks for at least a glass and at most a bottle', () => {
    expect(suggestedSipMl(2000, 950, at(14, 30))).toBe(250)
    expect(suggestedSipMl(2000, 0, at(14, 30))).toBe(500)
    expect(suggestedSipMl(2000, 700, at(14, 30))).toBe(300)
  })

  it('asks nothing when she is on track', () => {
    expect(suggestedSipMl(2000, 1000, at(14, 30))).toBeNull()
    expect(suggestedSipMl(2000, 0, at(7))).toBeNull()
  })
})

describe('formats', () => {
  it('writes litres and centilitres the French way', () => {
    expect(formatLitres(1250)).toBe('1,25 L')
    expect(formatLitres(2000)).toBe('2 L')
    expect(formatCentilitres(250)).toBe('25 cl')
  })
})
