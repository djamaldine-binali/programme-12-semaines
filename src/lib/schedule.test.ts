import { describe, expect, it } from 'vitest'
import {
  activityFor,
  addDays,
  elapsedWeek,
  programDay,
  runStepFor,
  sessionContext,
  toDayKey,
  upcomingMonday,
  weekPlan,
} from './schedule'

// 2027-01-04 is a Monday.
const START = '2027-01-04'

function dayOf(week: number, weekday: number) {
  return programDay(START, addDays(START, (week - 1) * 7 + weekday))
}

describe('programDay', () => {
  it('starts on week 1, month 1, Monday, session A', () => {
    expect(programDay(START, START)).toEqual({
      phase: 'during',
      week: 1,
      month: 1,
      weekday: 0,
      activity: 'renfo_A',
      deload: false,
    })
  })

  it('moves to the next week on Monday and keeps Sunday in the same week', () => {
    expect(dayOf(1, 6)).toMatchObject({ week: 1, weekday: 6 })
    expect(dayOf(2, 0)).toMatchObject({ week: 2, weekday: 0 })
  })

  it('maps weeks 1–4, 5–8 and 9–12 to months 1, 2 and 3', () => {
    const months = Array.from({ length: 12 }, (_, index) => {
      const day = dayOf(index + 1, 0)
      return day.phase === 'during' ? day.month : null
    })
    expect(months).toEqual([1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3])
  })

  it('counts days before the start', () => {
    expect(programDay(START, '2027-01-01')).toEqual({ phase: 'before', daysUntilStart: 3 })
  })

  it('ends after the last Sunday of week 12', () => {
    expect(dayOf(12, 6)).toMatchObject({ phase: 'during', week: 12 })
    expect(programDay(START, addDays(START, 84))).toEqual({ phase: 'after' })
  })
})

describe('deload weeks', () => {
  it('only flags weeks 4 and 8', () => {
    const deloads = Array.from({ length: 12 }, (_, index) => {
      const day = dayOf(index + 1, 0)
      return day.phase === 'during' && day.deload
    })
    expect(deloads.flatMap((deload, index) => (deload ? [index + 1] : []))).toEqual([4, 8])
  })

  it('replaces Saturday intervals with a long walk', () => {
    expect(activityFor(3, 5)).toBe('fractionne')
    expect(activityFor(4, 5)).toBe('marche_longue')
    expect(activityFor(8, 5)).toBe('marche_longue')
    expect(activityFor(9, 5)).toBe('fractionne')
  })
})

describe('Friday session', () => {
  it('is A on odd weeks and B on even weeks', () => {
    const fridays = Array.from({ length: 12 }, (_, index) => activityFor(index + 1, 4))
    expect(fridays).toEqual([
      'renfo_A',
      'renfo_B',
      'renfo_A',
      'renfo_B',
      'renfo_A',
      'renfo_B',
      'renfo_A',
      'renfo_B',
      'renfo_A',
      'renfo_B',
      'renfo_A',
      'renfo_B',
    ])
  })

  it('appears in the full week plan', () => {
    expect(weekPlan(2)).toEqual([
      'renfo_A',
      'course',
      'renfo_B',
      'marche_posture',
      'renfo_B',
      'fractionne',
      'posture_ou_repos',
    ])
  })
})

describe('daylight saving time (Europe/Paris)', () => {
  it('keeps Monday right after the spring change', () => {
    // Clocks go forward on Sunday 2027-03-28: the elapsed time is 7 days minus one hour.
    const start = '2027-03-22'
    const justAfterMidnight = new Date(2027, 2, 29, 0, 30)
    expect(programDay(start, toDayKey(justAfterMidnight))).toMatchObject({ week: 2, weekday: 0 })
  })

  it('keeps Sunday late at night right after the autumn change', () => {
    // Clocks go back on Sunday 2027-10-31: the elapsed time is 7 days plus one hour.
    const start = '2027-10-25'
    const lateSunday = new Date(2027, 9, 31, 23, 30)
    expect(programDay(start, toDayKey(lateSunday))).toMatchObject({ week: 1, weekday: 6 })
  })
})

describe('upcomingMonday', () => {
  it('returns the same day on a Monday and the next Monday otherwise', () => {
    expect(upcomingMonday('2027-01-04')).toBe('2027-01-04')
    expect(upcomingMonday('2027-01-05')).toBe('2027-01-11')
    expect(upcomingMonday('2027-01-10')).toBe('2027-01-11')
  })
})

describe('runStepFor', () => {
  it('follows the week until a step is repeated, then lags behind', () => {
    expect(runStepFor(5, 0)).toBe(5)
    expect(runStepFor(5, 1)).toBe(4)
    expect(runStepFor(1, 2)).toBe(1)
  })

  it('lets a lagging run plan continue after week 12', () => {
    expect(runStepFor(elapsedWeek(START, addDays(START, 7 * 13)), 2)).toBe(12)
    expect(runStepFor(elapsedWeek(START, addDays(START, 7 * 12)), 2)).toBe(11)
  })
})

describe('sessionContext', () => {
  it('uses the current week during the program', () => {
    expect(sessionContext(START, addDays(START, 7 * 7 + 2))).toEqual({ week: 8, month: 2, deload: true })
  })

  it('falls back to week 1 before the start or without a start date, and week 12 after', () => {
    expect(sessionContext(START, '2026-12-01')).toEqual({ week: 1, month: 1, deload: false })
    expect(sessionContext(null, '2027-06-01')).toEqual({ week: 1, month: 1, deload: false })
    expect(sessionContext(START, addDays(START, 7 * 20))).toEqual({ week: 12, month: 3, deload: false })
  })
})
