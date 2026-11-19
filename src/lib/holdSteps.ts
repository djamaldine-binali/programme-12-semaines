import type { TimedPhase } from './timer'

const GET_READY_MS = 5_000
const SWITCH_SIDE_MS = 5_000

export interface HoldStep extends TimedPhase {
  label: string
  isHold: boolean
}

/** A hold of `min`–`max` seconds, on one or both sides, with a few seconds to get into position first. */
export function holdSteps(min: number, max: number, perSide: boolean): HoldStep[] {
  const hold = (label: string): HoldStep => ({
    label,
    isHold: true,
    durationMs: max * 1000,
    markMs: min < max ? min * 1000 : undefined,
  })
  const getReady: HoldStep = { label: 'En place', isHold: false, durationMs: GET_READY_MS }
  if (!perSide) return [getReady, hold('Tiens la position')]
  return [
    getReady,
    hold('Premier côté'),
    { label: 'Change de côté', isHold: false, durationMs: SWITCH_SIDE_MS },
    hold('Deuxième côté'),
  ]
}
