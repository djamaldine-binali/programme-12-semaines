import { formatNumber } from './format'

export const GLASS_ML = 250
export const BOTTLE_ML = 500
export const DEFAULT_GOAL_ML = 2000
export const GOAL_OPTIONS_ML = [1500, 2000, 2500] as const

// The day's water is spread from 8 am to 9 pm; public/push-sw.js uses the same window.
const DAY_START_HOUR = 8
const DAY_END_HOUR = 21

/** How much she should have drunk by this time of day to reach the goal at 9 pm. */
export function expectedMl(goalMl: number, now: Date): number {
  const hours = now.getHours() + now.getMinutes() / 60
  const share = Math.min(1, Math.max(0, (hours - DAY_START_HOUR) / (DAY_END_HOUR - DAY_START_HOUR)))
  return Math.round((goalMl * share) / 50) * 50
}

/** What to drink now to catch up: at least a glass, at most a bottle, null when on track. */
export function suggestedSipMl(goalMl: number, totalMl: number, now: Date): number | null {
  const missing = expectedMl(goalMl, now) - totalMl
  if (missing <= 0) return null
  return Math.min(BOTTLE_ML, Math.max(GLASS_ML, Math.ceil(missing / 50) * 50))
}

/** 1250 → "1,25 L" */
export function formatLitres(ml: number): string {
  return `${formatNumber(Math.round(ml / 10) / 100)} L`
}

/** 250 → "25 cl" */
export function formatCentilitres(ml: number): string {
  return `${formatNumber(ml / 10)} cl`
}
