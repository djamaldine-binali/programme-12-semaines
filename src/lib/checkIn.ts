import type { CheckIn, CheckInLevel } from './storage'

export type CheckInField = 'energy' | 'hunger' | 'sleep' | 'sessions' | 'recovery'

export const checkInQuestions: { field: CheckInField; question: string; answers: [string, string, string] }[] = [
  { field: 'energy', question: 'Ton énergie cette semaine', answers: ['Bonne', 'Moyenne', 'Faible'] },
  { field: 'hunger', question: 'La faim', answers: ['Normale', 'Souvent faim', 'Tout le temps faim'] },
  { field: 'sleep', question: 'Tes nuits', answers: ['Bonnes', 'Moyennes', 'Mauvaises'] },
  { field: 'sessions', question: 'Tes séances', answers: ['Ça allait', 'Dures', 'Trop dures'] },
  {
    field: 'recovery',
    question: 'Ta récup',
    answers: ['Bien', 'Courbatures qui traînent', 'Fatigue ou douleur qui dure'],
  },
]

const persistentAdvice: Record<CheckInField, string> = {
  energy:
    'Ton énergie reste basse depuis deux semaines : ajoute une collation les jours de séance (un yaourt et un fruit, ou une tartine), et ne cherche pas à en faire plus.',
  hunger:
    "Tu as souvent faim depuis deux semaines : augmente un peu les féculents au déjeuner et au dîner, ou ajoute une collation. Avoir faim tout le temps n'aide pas à tenir.",
  sleep:
    'Tes nuits sont difficiles depuis deux semaines : garde des horaires réguliers, coupe les écrans un peu avant de dormir et évite les séances tard le soir.',
  sessions:
    "Les séances sont trop dures depuis deux semaines : reprends les doses du mois d'avant, et pour la course, refais l'étape de la semaine précédente.",
  recovery:
    "La récup traîne depuis deux semaines : remplace une séance de renfo par la routine posture cette semaine, et mange un peu plus les jours d'entraînement.",
}

export interface CheckInAdvice {
  tone: 'good' | 'wait' | 'adjust' | 'doctor'
  messages: string[]
}

function isPersistent(field: CheckInField, current: CheckIn, previous: CheckIn | undefined): boolean {
  if (!previous || previous.week !== current.week - 1) return false
  const levels: CheckInLevel[] = [previous[field], current[field]]
  return levels.every((level) => level >= 2) && levels.includes(3)
}

/**
 * What to do after this week's check-in. Nothing changes after a single hard week: an adjustment is
 * only proposed when a signal lasts two weeks in a row, and a third week sends her to a doctor.
 */
export function adviceFor(checkIns: CheckIn[], week: number): CheckInAdvice | null {
  const byWeek = new Map(checkIns.map((checkIn) => [checkIn.week, checkIn]))
  const current = byWeek.get(week)
  if (!current) return null

  const fields = checkInQuestions.map((question) => question.field)
  const lastThree = [byWeek.get(week - 2), byWeek.get(week - 1), current]
  const hardThreeWeeks = lastThree.every((checkIn) => checkIn && fields.some((field) => checkIn[field] === 3))
  if (hardThreeWeeks) {
    return {
      tone: 'doctor',
      messages: [
        "Ça fait trois semaines que quelque chose ne va pas. Lève le pied cette semaine et parles-en à un médecin ou à un diététicien : ce n'est pas normal de se sentir comme ça.",
      ],
    }
  }

  const persistent = fields.filter((field) => isPersistent(field, current, byWeek.get(week - 1)))
  if (persistent.length > 0) return { tone: 'adjust', messages: persistent.map((field) => persistentAdvice[field]) }

  if (fields.some((field) => current[field] === 3)) {
    return {
      tone: 'wait',
      messages: [
        "Rien à changer pour l'instant. Si ça se répète la semaine prochaine, le bilan te proposera un ajustement.",
      ],
    }
  }
  return { tone: 'good', messages: ['Tout va bien : continue comme ça.'] }
}
