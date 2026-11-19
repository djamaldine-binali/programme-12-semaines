import { describe, expect, it } from 'vitest'
import { program } from '../data/program'
import { intervalPhases, runPhases, totalDurationMs } from './guidedPhases'

const runs = program.running.tuesday_runs
const intervals = program.running.saturday_intervals

describe('runPhases', () => {
  it('wraps the run/walk repetitions in a 5 min warm-up and cool-down', () => {
    const phases = runPhases(runs[0])
    expect(phases).toHaveLength(1 + 8 * 2 + 1)
    expect(phases[0]).toMatchObject({ label: 'Échauffement', durationMs: 300_000 })
    expect(phases[1]).toMatchObject({ label: 'Course', durationMs: 60_000, detail: '1 sur 8' })
    expect(phases[2]).toMatchObject({ label: 'Marche', durationMs: 120_000 })
    expect(phases.at(-1)).toMatchObject({ label: 'Retour au calme', durationMs: 300_000 })
    expect(totalDurationMs(phases)).toBe((300 + 8 * 180 + 300) * 1000)
  })

  it('runs weeks 11 and 12 in one go, up to 30 min with a signal at 25 min', () => {
    const phases = runPhases(runs[10])
    expect(phases).toHaveLength(3)
    expect(phases[1]).toMatchObject({ label: 'Course', durationMs: 1_800_000, markMs: 1_500_000 })
  })
})

describe('intervalPhases', () => {
  it('rotates the four home moves in month 1, without warm-up', () => {
    const phases = intervalPhases(intervals[0])
    const moves = phases.filter((phase) => phase.tone === 'course').map((phase) => phase.label)
    expect(moves).toEqual([
      'montées de genoux',
      'jumping jacks',
      'squats rapides',
      'mountain climbers',
      'montées de genoux',
      'jumping jacks',
    ])
    expect(totalDurationMs(phases)).toBe(6 * (30 + 90) * 1000)
  })

  it('runs with walking recovery and a warm-up in months 2 and 3', () => {
    const month3 = intervalPhases(intervals[2])
    expect(month3).toHaveLength(1 + 10 * 2 + 1)
    expect(month3[1]).toMatchObject({ label: 'Vite', durationMs: 30_000 })
    expect(month3[2]).toMatchObject({ label: 'Marche', durationMs: 60_000 })
  })
})
