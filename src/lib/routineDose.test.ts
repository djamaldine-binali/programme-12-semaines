import { describe, expect, it } from 'vitest'
import { program } from '../data/program'
import { routineHoldSteps } from './holdSteps'
import { parseRoutineHold } from './routineDose'

describe('parseRoutineHold', () => {
  it('times the held positions', () => {
    expect(parseRoutineHold('30 s / côté')).toEqual({ seconds: 30, sets: 1, perSide: true })
    expect(parseRoutineHold('2 × 30 s / côté')).toEqual({ seconds: 30, sets: 2, perSide: true })
    expect(parseRoutineHold('1 min')).toEqual({ seconds: 60, sets: 1, perSide: false })
  })

  it('leaves counted doses to a "done" button', () => {
    expect(parseRoutineHold('10 lents')).toBeNull()
    expect(parseRoutineHold('10 × 5 s')).toBeNull()
    expect(parseRoutineHold('2 × 10 / côté')).toBeNull()
  })

  it('times every stretch of the program', () => {
    for (const item of program.stretch_routine.items) expect(parseRoutineHold(item.dose)).not.toBeNull()
  })
})

describe('routineHoldSteps', () => {
  it('alternates sides set after set', () => {
    const steps = routineHoldSteps({ seconds: 30, sets: 2, perSide: true })
    expect(steps.map((step) => step.label)).toEqual([
      'En place',
      'Premier côté',
      'Change de côté',
      'Deuxième côté',
      'Change de côté',
      'Premier côté',
      'Change de côté',
      'Deuxième côté',
    ])
    expect(steps.filter((step) => step.isHold).every((step) => step.durationMs === 30_000)).toBe(true)
  })
})
