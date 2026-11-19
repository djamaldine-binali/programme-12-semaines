export interface RoutineHold {
  seconds: number
  sets: number
  perSide: boolean
}

/**
 * Routine doses are plain text in program.json. Only the held positions get a timer:
 * "30 s / côté", "2 × 30 s / côté", "1 min". Counted doses ("10 lents", "10 × 5 s") return null.
 */
export function parseRoutineHold(dose: string): RoutineHold | null {
  const minutes = dose.match(/^(\d+) min$/)
  if (minutes) return { seconds: Number(minutes[1]) * 60, sets: 1, perSide: false }

  const held = dose.match(/^(?:(\d+) × )?(\d+) s \/ côté$/)
  if (held) return { seconds: Number(held[2]), sets: held[1] ? Number(held[1]) : 1, perSide: true }

  return null
}
