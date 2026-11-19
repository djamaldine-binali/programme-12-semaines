import type { DayKey } from './schedule'

const longDate = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
const numbers = new Intl.NumberFormat('fr-FR')

/** "lundi 4 janvier" */
export function formatLongDate(key: DayKey): string {
  return longDate.format(new Date(`${key}T00:00:00Z`))
}

export function formatNumber(value: number): string {
  return numbers.format(value)
}

/** 30 → "30 s", 60 → "1 min", 90 → "1 min 30", 1500 → "25 min" */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (minutes === 0) return `${seconds}\u00a0s`
  if (seconds === 0) return `${minutes}\u00a0min`
  return `${minutes}\u00a0min\u00a0${String(seconds).padStart(2, '0')}`
}

/** Clock display for timers: 75 → "1:15" */
export function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
