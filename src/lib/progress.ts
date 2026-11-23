import { addDays, daysBetween, TOTAL_WEEKS, weekStart, type DayKey } from './schedule'
import type { LogEntry, SessionKind } from './storage'

/** The five sessions that make a full week: three strength sessions, the run and the Saturday session. */
const weeklyTargets: { kinds: SessionKind[]; count: number }[] = [
  { kinds: ['renfo_A', 'renfo_B'], count: 3 },
  { kinds: ['course'], count: 1 },
  { kinds: ['fractionne', 'marche_longue'], count: 1 },
]

export const SESSIONS_PER_WEEK = weeklyTargets.reduce((total, target) => total + target.count, 0)

export interface WeekProgress {
  week: number
  days: { day: DayKey; entries: LogEntry[] }[]
  mainSessionsDone: number
  complete: boolean
}

export function weekProgress(startDate: DayKey, week: number, log: LogEntry[]): WeekProgress {
  const monday = weekStart(startDate, week)
  const days = Array.from({ length: 7 }, (_, offset) => {
    const day = addDays(monday, offset)
    return { day, entries: log.filter((entry) => entry.day === day) }
  })
  const weekEntries = days.flatMap((day) => day.entries)
  const mainSessionsDone = weeklyTargets.reduce((total, target) => {
    const done = weekEntries.filter((entry) => target.kinds.includes(entry.kind)).length
    return total + Math.min(done, target.count)
  }, 0)
  return { week, days, mainSessionsDone, complete: mainSessionsDone === SESSIONS_PER_WEEK }
}

/**
 * Which planned days of a week are done. A session counts for the first planned day of the same kind,
 * whatever day it was done: Saturday's session done on Monday ticks Saturday.
 */
export function plannedDaysDone(
  startDate: DayKey,
  week: number,
  plannedKinds: SessionKind[],
  log: LogEntry[],
): boolean[] {
  const monday = weekStart(startDate, week)
  const sunday = addDays(monday, 6)
  const remaining = log.filter((entry) => entry.day >= monday && entry.day <= sunday).map((entry) => entry.kind)
  return plannedKinds.map((kind) => {
    const index = remaining.indexOf(kind)
    if (index === -1) return false
    remaining.splice(index, 1)
    return true
  })
}

/** Weeks already started, most recent first. */
export function startedWeeks(startDate: DayKey, today: DayKey, log: LogEntry[]): WeekProgress[] {
  const elapsed = daysBetween(startDate, today)
  if (elapsed < 0) return []
  const currentWeek = Math.min(TOTAL_WEEKS, Math.floor(elapsed / 7) + 1)
  return Array.from({ length: currentWeek }, (_, index) => weekProgress(startDate, currentWeek - index, log))
}
