import type { RoutineHold } from './routineDose'
import type { TimedPhase } from './timer'

const GET_READY_MS = 5_000
const SWITCH_SIDE_MS = 5_000

export interface HoldStep extends TimedPhase {
  label: string
  isHold: boolean
}

const getReady: HoldStep = { label: 'En place', isHold: false, durationMs: GET_READY_MS }
const switchSide: HoldStep = { label: 'Change de côté', isHold: false, durationMs: SWITCH_SIDE_MS }

function hold(label: string, min: number, max: number): HoldStep {
  return { label, isHold: true, durationMs: max * 1000, markMs: min < max ? min * 1000 : undefined }
}

/** A hold of `min`–`max` seconds, on one or both sides, with a few seconds to get into position first. */
export function holdSteps(min: number, max: number, perSide: boolean): HoldStep[] {
  if (!perSide) return [getReady, hold('Tiens la position', min, max)]
  return [getReady, hold('Premier côté', min, max), switchSide, hold('Deuxième côté', min, max)]
}

/** Routine holds can have several sets: sides alternate from one set to the next. */
export function routineHoldSteps({ seconds, sets, perSide }: RoutineHold): HoldStep[] {
  const oneSet = perSide
    ? [hold('Premier côté', seconds, seconds), switchSide, hold('Deuxième côté', seconds, seconds)]
    : [hold('Tiens la position', seconds, seconds)]
  const allSets = Array.from({ length: sets }, (_, index) => (index === 0 ? oneSet : [switchSide, ...oneSet])).flat()
  return [getReady, ...allSets]
}
