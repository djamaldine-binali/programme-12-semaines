import { describe, expect, it } from 'vitest'
import { defaultState, parseState } from './storage'

describe('parseState', () => {
  it('reads back a saved state', () => {
    const state = {
      ...defaultState,
      startDate: '2027-01-04',
      log: [{ day: '2027-01-05', kind: 'course', feeling: 'dur', finishedAt: '2027-01-05T18:40:00.000Z' }],
      runShift: 1,
    }
    expect(parseState(JSON.stringify(state))).toEqual(state)
  })

  it('rejects files that are not a progress file', () => {
    expect(parseState('not json')).toBeNull()
    expect(parseState('{"version":2}')).toBeNull()
    expect(parseState('[]')).toBeNull()
  })

  it('drops invalid entries and falls back to default settings', () => {
    const parsed = parseState(
      JSON.stringify({
        version: 1,
        startDate: 'lundi',
        settings: { restSeconds: 45, sound: false },
        log: [{ day: '2027-01-05', kind: 'yoga', finishedAt: '' }],
        runShift: -2,
      }),
    )
    expect(parsed).toEqual({ ...defaultState, settings: { ...defaultState.settings, sound: false } })
  })
})
