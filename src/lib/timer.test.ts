import { describe, expect, it } from 'vitest'
import { advanceClock, displaySeconds, elapsedMs, idleClock, locate, pauseClock, startClock } from './timer'

const phases = [{ durationMs: 60_000 }, { durationMs: 120_000 }, { durationMs: 60_000 }]

describe('clock', () => {
  it('measures elapsed time from timestamps, so a long gap between ticks is still exact', () => {
    const clock = startClock(idleClock, 1_000)
    expect(elapsedMs(clock, 1_000 + 95_000)).toBe(95_000)
  })

  it('freezes while paused and resumes where it stopped', () => {
    let clock = startClock(idleClock, 0)
    clock = pauseClock(clock, 10_000)
    expect(elapsedMs(clock, 50_000)).toBe(10_000)
    clock = startClock(clock, 50_000)
    expect(elapsedMs(clock, 55_000)).toBe(15_000)
  })

  it('keeps running when started twice', () => {
    const clock = startClock(idleClock, 0)
    expect(startClock(clock, 5_000)).toBe(clock)
  })

  it('can jump ahead to skip the rest of a phase', () => {
    const clock = advanceClock(startClock(idleClock, 0), 30_000)
    expect(elapsedMs(clock, 10_000)).toBe(40_000)
  })
})

describe('locate', () => {
  it('finds the phase and the time left in it', () => {
    expect(locate(phases, 0)).toEqual({ index: 0, phaseElapsedMs: 0, remainingMs: 60_000, done: false })
    expect(locate(phases, 61_000)).toEqual({ index: 1, phaseElapsedMs: 1_000, remainingMs: 119_000, done: false })
  })

  it('switches phase exactly at the boundary', () => {
    expect(locate(phases, 60_000).index).toBe(1)
  })

  it('lands on the right phase after the screen slept through several phases', () => {
    expect(locate(phases, 200_000)).toMatchObject({ index: 2, remainingMs: 40_000 })
  })

  it('reports the end of the sequence', () => {
    expect(locate(phases, 240_000)).toMatchObject({ index: 2, remainingMs: 0, done: true })
  })
})

describe('displaySeconds', () => {
  it('rounds up so the countdown shows 0 only when it is over', () => {
    expect(displaySeconds(4_200)).toBe(5)
    expect(displaySeconds(1)).toBe(1)
    expect(displaySeconds(0)).toBe(0)
  })
})
