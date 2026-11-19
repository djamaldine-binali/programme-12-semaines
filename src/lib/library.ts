import { program } from '../data/program'

export interface Appearance {
  /** "Séance A", "Posture", "Étirements", "Fractionné" */
  place: string
  months: number[]
  doses: string[]
}

export const libraryGroups = ['Séance A', 'Séance B', 'Posture', 'Étirements', 'Fractionné'] as const

function sessionAppearances(): Map<string, Appearance[]> {
  const byExercise = new Map<string, Appearance[]>()
  for (const id of ['A', 'B'] as const) {
    const session = program.sessions[id]
    for (const item of session.items) {
      for (const version of item.months) {
        const list = byExercise.get(version.exercise) ?? []
        let appearance = list.find((entry) => entry.place === session.title)
        if (!appearance) {
          appearance = { place: session.title, months: [], doses: [] }
          list.push(appearance)
        }
        appearance.months.push(version.month)
        appearance.doses.push(`Mois ${version.month}\u00a0: ${version.dose.text}`)
        byExercise.set(version.exercise, list)
      }
    }
  }
  return byExercise
}

export function appearancesOf(exerciseId: string): Appearance[] {
  const appearances = [...(sessionAppearances().get(exerciseId) ?? [])]
  const posture = program.posture_routine.items.find((item) => item.exercise === exerciseId)
  if (posture) appearances.push({ place: 'Posture', months: [1, 2, 3], doses: [posture.dose] })
  const stretch = program.stretch_routine.items.find((item) => item.exercise === exerciseId)
  if (stretch) appearances.push({ place: 'Étirements', months: [1, 2, 3], doses: [stretch.dose] })
  for (const intervals of program.running.saturday_intervals) {
    if (intervals.mode === 'maison' && intervals.demo_exercise === exerciseId) {
      appearances.push({
        place: 'Fractionné',
        months: [intervals.month],
        doses: [`Mois ${intervals.month}\u00a0: ${intervals.work_s}\u00a0s à fond`],
      })
    }
  }
  return appearances
}

/** "mois 1 et 2", "mois 3", "tous les mois" */
export function describeMonths(months: number[]): string {
  if (months.length === 3) return 'tous les mois'
  if (months.length === 1) return `mois ${months[0]}`
  return `mois ${months.slice(0, -1).join(', ')} et ${months.at(-1)}`
}

/** Exercises grouped by the first place they appear, in program order. */
export function exercisesByGroup(): { group: (typeof libraryGroups)[number]; ids: string[] }[] {
  const ids = Object.keys(program.exercises)
  return libraryGroups.map((group) => ({
    group,
    ids: ids.filter((id) => appearancesOf(id)[0]?.place === group),
  }))
}
