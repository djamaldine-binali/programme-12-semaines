import { describe, expect, it } from 'vitest'
import { adviceFor, type CheckInField } from './checkIn'
import type { CheckIn, CheckInLevel } from './storage'

function checkIn(week: number, levels: Partial<Record<CheckInField, CheckInLevel>> = {}): CheckIn {
  return { week, day: '2027-01-10', energy: 1, hunger: 1, sleep: 1, sessions: 1, recovery: 1, ...levels }
}

describe('adviceFor', () => {
  it('has nothing to say before the week is checked in', () => {
    expect(adviceFor([checkIn(1)], 2)).toBeNull()
  })

  it('changes nothing after a single hard week', () => {
    expect(adviceFor([checkIn(1), checkIn(2, { hunger: 3 })], 2)?.tone).toBe('wait')
  })

  it('adjusts when a signal lasts two weeks in a row', () => {
    const advice = adviceFor([checkIn(1, { hunger: 2 }), checkIn(2, { hunger: 3 })], 2)
    expect(advice?.tone).toBe('adjust')
    expect(advice?.messages).toHaveLength(1)
    expect(advice?.messages[0]).toMatch(/faim/)
  })

  it('does not link weeks that are not consecutive', () => {
    expect(adviceFor([checkIn(1, { sleep: 3 }), checkIn(3, { sleep: 3 })], 3)?.tone).toBe('wait')
  })

  it('sends her to a doctor after three hard weeks', () => {
    const checkIns = [checkIn(2, { energy: 3 }), checkIn(3, { sleep: 3 }), checkIn(4, { recovery: 3 })]
    expect(adviceFor(checkIns, 4)?.tone).toBe('doctor')
  })

  it('never talks about weight or calories', () => {
    const checkIns = [checkIn(1, { energy: 3, hunger: 3, sleep: 3, sessions: 3, recovery: 3 })]
    const all = [...checkIns, checkIn(2, { energy: 3, hunger: 3, sleep: 3, sessions: 3, recovery: 3 })]
    expect(adviceFor(all, 2)?.messages.join(' ')).not.toMatch(/poids|calorie|kcal/i)
  })
})
