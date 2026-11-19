import type { Dose } from '../data/types'

export const DELOAD_SETS = 2

export function setsFor(dose: Dose, deload: boolean): number {
  return deload ? Math.min(DELOAD_SETS, dose.sets) : dose.sets
}

/** The dose text from program.json, with the set count lowered on deload weeks. */
export function doseText(dose: Dose, deload: boolean): string {
  return deload ? dose.text.replace(/^\d+/, String(setsFor(dose, true))) : dose.text
}

/** "12–15" → { min: 12, max: 15 }, "15" → { min: 15, max: 15 }, "max" → null */
export function parseTarget(target: string): { min: number; max: number } | null {
  const match = target.match(/^(\d+)(?:–(\d+))?$/)
  if (!match) return null
  const min = Number(match[1])
  return { min, max: match[2] ? Number(match[2]) : min }
}

export function sideLabel(dose: Dose): string | null {
  if (!dose.per_side) return null
  return dose.text.includes('/ jambe') ? 'par jambe' : 'par côté'
}

const unitLabels: Record<Dose['unit'], string> = { reps: 'répétitions', seconds: 'secondes', taps: 'touches' }

/** What one set asks for: "12–15 répétitions", "Le maximum, propre", "30–45 secondes". */
export function setGoal(dose: Dose): string {
  if (dose.target === 'max') return 'Le maximum, propre'
  return `${dose.target} ${unitLabels[dose.unit]}`
}
