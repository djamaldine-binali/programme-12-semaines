import { program } from '../data/program'
import type { TemplateActivity } from '../data/types'

/** A calendar day in local time, written YYYY-MM-DD. */
export type DayKey = string

/** The Friday session is resolved to A or B, and deload weeks swap the intervals for a long walk. */
export type Activity = Exclude<TemplateActivity, 'renfo_A_ou_B'> | 'marche_longue'

export const TOTAL_WEEKS = 12

export type ProgramDay =
  | { phase: 'before'; daysUntilStart: number }
  | { phase: 'after' }
  | { phase: 'during'; week: number; month: number; weekday: number; activity: Activity; deload: boolean }

export function toDayKey(date: Date): DayKey {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

// Day keys are compared as UTC dates so that a daylight saving change never adds or removes a day.
function toUtc(key: DayKey): number {
  const [year, month, day] = key.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}

const DAY_MS = 86_400_000

export function daysBetween(from: DayKey, to: DayKey): number {
  return Math.round((toUtc(to) - toUtc(from)) / DAY_MS)
}

export function addDays(key: DayKey, days: number): DayKey {
  return new Date(toUtc(key) + days * DAY_MS).toISOString().slice(0, 10)
}

/** 0 for Monday, 6 for Sunday. */
export function weekdayOf(key: DayKey): number {
  return (new Date(toUtc(key)).getUTCDay() + 6) % 7
}

/** Today if it is a Monday, otherwise the next Monday. */
export function upcomingMonday(today: DayKey): DayKey {
  return addDays(today, (7 - weekdayOf(today)) % 7)
}

export function monthOfWeek(week: number): number {
  return Math.ceil(week / 4)
}

export function isDeloadWeek(week: number): boolean {
  return program.rules.deload_weeks.includes(week)
}

export function activityFor(week: number, weekday: number): Activity {
  const planned = program.week_template[weekday].activity
  if (planned === 'renfo_A_ou_B') return week % 2 === 1 ? 'renfo_A' : 'renfo_B'
  if (planned === 'fractionne' && isDeloadWeek(week)) return 'marche_longue'
  return planned
}

export function weekPlan(week: number): Activity[] {
  return program.week_template.map((_, weekday) => activityFor(week, weekday))
}

export function stepsGoal(month: number): number {
  return program.rules.steps_per_day_by_month[month - 1]
}

/** Week number since the start, without the 12-week cap (runs can continue after the program). */
export function elapsedWeek(startDate: DayKey, today: DayKey): number {
  return Math.floor(daysBetween(startDate, today) / 7) + 1
}

export function programDay(startDate: DayKey, today: DayKey): ProgramDay {
  const elapsed = daysBetween(startDate, today)
  if (elapsed < 0) return { phase: 'before', daysUntilStart: -elapsed }

  const week = elapsedWeek(startDate, today)
  if (week > TOTAL_WEEKS) return { phase: 'after' }

  const weekday = weekdayOf(today)
  return {
    phase: 'during',
    week,
    month: monthOfWeek(week),
    weekday,
    activity: activityFor(week, weekday),
    deload: isDeloadWeek(week),
  }
}

export interface SessionContext {
  week: number
  month: number
  deload: boolean
}

/** Week used to pick doses: week 1 before the start, week 12 after the end. */
export function sessionContext(startDate: DayKey | null, today: DayKey): SessionContext {
  const week = startDate ? Math.min(TOTAL_WEEKS, Math.max(1, elapsedWeek(startDate, today))) : 1
  return { week, month: monthOfWeek(week), deload: isDeloadWeek(week) }
}

/** The Tuesday run step for a week, once repeated or stepped-back weeks are taken into account. */
export function runStepFor(week: number, runShift: number): number {
  return Math.min(TOTAL_WEEKS, Math.max(1, week - runShift))
}

/** Run step to do today; it keeps progressing after week 12 when steps were repeated. */
export function currentRunStep(startDate: DayKey | null, today: DayKey, runShift: number): number {
  return startDate ? runStepFor(Math.max(1, elapsedWeek(startDate, today)), runShift) : 1
}

/** First day (Monday) of a given program week. */
export function weekStart(startDate: DayKey, week: number): DayKey {
  return addDays(startDate, (week - 1) * 7)
}
