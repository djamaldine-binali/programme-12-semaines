import { describe, expect, it } from 'vitest'
import { addDays } from './schedule'
import { plannedDaysDone, startedWeeks, weekProgress } from './progress'
import type { LogEntry, SessionKind } from './storage'

const START = '2027-01-04'

function entry(dayOffset: number, kind: SessionKind): LogEntry {
  return { day: addDays(START, dayOffset), kind, finishedAt: `${addDays(START, dayOffset)}T18:00:00.000Z` }
}

const fullWeek = [
  entry(0, 'renfo_A'),
  entry(1, 'course'),
  entry(2, 'renfo_B'),
  entry(3, 'posture'),
  entry(4, 'renfo_A'),
  entry(5, 'fractionne'),
]

describe('weekProgress', () => {
  it('counts a week complete with three strength sessions, the run and the Saturday session', () => {
    expect(weekProgress(START, 1, fullWeek)).toMatchObject({ mainSessionsDone: 5, complete: true })
  })

  it('does not count posture, stretching or extra sessions towards the five', () => {
    const log = [
      ...fullWeek.slice(0, 2),
      entry(2, 'renfo_A'),
      entry(3, 'renfo_B'),
      entry(4, 'renfo_A'),
      entry(6, 'etirements'),
    ]
    expect(weekProgress(START, 1, log)).toMatchObject({ mainSessionsDone: 4, complete: false })
  })

  it('accepts the long walk on deload weeks', () => {
    const log = [...fullWeek.slice(0, 5), entry(5, 'marche_longue')]
    expect(weekProgress(START, 1, log).complete).toBe(true)
  })

  it('only looks at the days of that week', () => {
    expect(weekProgress(START, 2, fullWeek).mainSessionsDone).toBe(0)
  })
})

describe('startedWeeks', () => {
  it('lists started weeks, most recent first', () => {
    expect(startedWeeks(START, addDays(START, 9), []).map((week) => week.week)).toEqual([2, 1])
    expect(startedWeeks(START, '2026-12-30', [])).toEqual([])
  })

  it('stops at week 12', () => {
    expect(startedWeeks(START, addDays(START, 200), [])).toHaveLength(12)
  })
})

describe('plannedDaysDone', () => {
  const week1: SessionKind[] = ['renfo_A', 'course', 'renfo_B', 'posture', 'renfo_A', 'fractionne', 'posture']

  it("ticks Saturday when Saturday's session was done on Monday", () => {
    const done = plannedDaysDone(START, 1, week1, [entry(0, 'fractionne')])
    expect(done).toEqual([false, false, false, false, false, true, false])
  })

  it('gives a repeated session to the first planned day first', () => {
    const done = plannedDaysDone(START, 1, week1, [entry(3, 'renfo_A')])
    expect(done).toEqual([true, false, false, false, false, false, false])
  })

  it('ignores sessions from another week', () => {
    expect(plannedDaysDone(START, 1, week1, [entry(7, 'course')]).some(Boolean)).toBe(false)
  })
})
