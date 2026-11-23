import { describe, expect, it } from 'vitest'
import { program } from './program'

const exerciseIds = new Set(Object.keys(program.exercises))

describe('program.json matches the types', () => {
  it('has 34 exercises keyed by their own id', () => {
    expect(exerciseIds.size).toBe(34)
    for (const [key, exercise] of Object.entries(program.exercises)) {
      expect(exercise.id).toBe(key)
      expect(exercise.diagram_svg.startsWith('<svg')).toBe(true)
    }
  })

  it('has one known activity per weekday', () => {
    const activities = [
      'renfo_A',
      'renfo_B',
      'renfo_A_ou_B',
      'course',
      'marche_posture',
      'fractionne',
      'posture_ou_repos',
    ]
    expect(program.week_template).toHaveLength(7)
    for (const day of program.week_template) expect(activities).toContain(day.activity)
  })

  it('gives every session item three months of known exercises and units', () => {
    for (const session of [program.sessions.A, program.sessions.B]) {
      for (const item of session.items) {
        expect(item.months.map((version) => version.month)).toEqual([1, 2, 3])
        for (const { exercise, dose } of item.months) {
          expect(exerciseIds).toContain(exercise)
          expect(['reps', 'seconds', 'taps']).toContain(dose.unit)
          expect(dose.target).toMatch(/^(\d+(–\d+)?|max)$/)
        }
      }
    }
  })

  it('only references known exercises in routines and intervals', () => {
    const routineItems = [...program.posture_routine.items, ...program.stretch_routine.items]
    for (const item of routineItems) expect(exerciseIds).toContain(item.exercise)
    const homeIntervals = program.running.saturday_intervals[0]
    expect(homeIntervals.mode).toBe('maison')
    if (homeIntervals.mode === 'maison') expect(exerciseIds).toContain(homeIntervals.demo_exercise)
  })

  it('has a Tuesday run for each of the 12 weeks and intervals for each month', () => {
    expect(program.running.tuesday_runs.map((run) => run.week)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    expect(program.running.saturday_intervals.map((intervals) => intervals.month)).toEqual([1, 2, 3])
  })
})
