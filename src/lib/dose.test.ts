import { describe, expect, it } from 'vitest'
import { program } from '../data/program'
import { doseText, parseTarget, setGoal, setsFor, sideLabel } from './dose'

const doses = [...program.sessions.A.items, ...program.sessions.B.items].flatMap((item) =>
  item.months.map((version) => version.dose),
)

describe('deload weeks', () => {
  it('drop every renfo dose to 2 sets and say so in the text', () => {
    for (const dose of doses) {
      expect(setsFor(dose, true)).toBe(2)
      expect(doseText(dose, true)).toMatch(/^2\D/)
      expect(doseText(dose, true).slice(1)).toBe(dose.text.slice(String(dose.sets).length))
    }
  })

  it('leave normal weeks untouched', () => {
    for (const dose of doses) {
      expect(setsFor(dose, false)).toBe(dose.sets)
      expect(doseText(dose, false)).toBe(dose.text)
    }
  })
})

describe('parseTarget', () => {
  it('reads single values, ranges and max', () => {
    expect(parseTarget('15')).toEqual({ min: 15, max: 15 })
    expect(parseTarget('30–45')).toEqual({ min: 30, max: 45 })
    expect(parseTarget('max')).toBeNull()
  })

  it('understands every seconds target in the program', () => {
    for (const dose of doses.filter((dose) => dose.unit === 'seconds')) {
      expect(parseTarget(dose.target)).not.toBeNull()
    }
  })
})

describe('labels', () => {
  it('describe the goal of one set', () => {
    const squat = program.sessions.A.items[0].months[0].dose
    expect(setGoal(squat)).toBe('12–15 répétitions')
    const pushUps = program.sessions.A.items[4].months[2].dose
    expect(setGoal(pushUps)).toBe('Le maximum, propre')
  })

  it('say leg or side for per-side doses', () => {
    expect(sideLabel(program.sessions.A.items[2].months[0].dose)).toBe('par jambe')
    expect(sideLabel(program.sessions.A.items[3].months[0].dose)).toBe('par côté')
    expect(sideLabel(program.sessions.A.items[0].months[0].dose)).toBeNull()
  })
})
