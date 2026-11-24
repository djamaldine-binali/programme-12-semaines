import { isDayKey, isValidStartDate, type DayKey } from './schedule'

export type SessionKind = 'renfo_A' | 'renfo_B' | 'course' | 'fractionne' | 'marche_longue' | 'posture' | 'etirements'

export type Feeling = 'facile' | 'ok' | 'dur'

export interface LogEntry {
  day: DayKey
  kind: SessionKind
  feeling?: Feeling
  finishedAt: string
}

/** 1 good, 2 so-so, 3 bad. */
export type CheckInLevel = 1 | 2 | 3

export interface CheckIn {
  week: number
  day: DayKey
  energy: CheckInLevel
  hunger: CheckInLevel
  sleep: CheckInLevel
  sessions: CheckInLevel
  recovery: CheckInLevel
}

export type RestSeconds = 60 | 75 | 90
export type Theme = 'auto' | 'light' | 'dark'
export type Servings = 1 | 2

export interface Settings {
  restSeconds: RestSeconds
  sound: boolean
  vibration: boolean
  theme: Theme
  servings: Servings
}

export interface SavedState {
  version: 1
  startDate: DayKey | null
  settings: Settings
  log: LogEntry[]
  /** Weeks the Tuesday runs lag behind the calendar after repeating or going back a step. */
  runShift: number
  /** Weekly check-ins: how she feels, never weight or calories. */
  checkIns: CheckIn[]
}

const STORAGE_KEY = 'p12'

export const defaultState: SavedState = {
  version: 1,
  startDate: null,
  settings: { restSeconds: 75, sound: true, vibration: true, theme: 'auto', servings: 1 },
  log: [],
  runShift: 0,
  checkIns: [],
}

const sessionKinds: SessionKind[] = [
  'renfo_A',
  'renfo_B',
  'course',
  'fractionne',
  'marche_longue',
  'posture',
  'etirements',
]
const feelings: Feeling[] = ['facile', 'ok', 'dur']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

const checkInFields = ['energy', 'hunger', 'sleep', 'sessions', 'recovery'] as const

function isCheckIn(value: unknown): value is CheckIn {
  return (
    isRecord(value) &&
    Number.isInteger(value.week) &&
    typeof value.day === 'string' &&
    isDayKey(value.day) &&
    checkInFields.every((field) => [1, 2, 3].includes(value[field] as number))
  )
}

function isLogEntry(value: unknown): value is LogEntry {
  return (
    isRecord(value) &&
    typeof value.day === 'string' &&
    isDayKey(value.day) &&
    sessionKinds.includes(value.kind as SessionKind) &&
    (value.feeling === undefined || feelings.includes(value.feeling as Feeling)) &&
    typeof value.finishedAt === 'string'
  )
}

function parseSettings(value: unknown): Settings {
  const defaults = defaultState.settings
  if (!isRecord(value)) return defaults
  return {
    restSeconds: [60, 75, 90].includes(value.restSeconds as number)
      ? (value.restSeconds as RestSeconds)
      : defaults.restSeconds,
    sound: typeof value.sound === 'boolean' ? value.sound : defaults.sound,
    vibration: typeof value.vibration === 'boolean' ? value.vibration : defaults.vibration,
    theme: ['auto', 'light', 'dark'].includes(value.theme as string) ? (value.theme as Theme) : defaults.theme,
    servings: value.servings === 2 ? 2 : defaults.servings,
  }
}

/**
 * Reads a saved state from storage or from an imported file.
 * Returns null when the data is not a progress file at all.
 */
export function parseState(raw: string): SavedState | null {
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return null
  }
  if (!isRecord(data) || data.version !== 1) return null

  const startDate = typeof data.startDate === 'string' && isValidStartDate(data.startDate) ? data.startDate : null
  const log = Array.isArray(data.log) ? data.log.filter(isLogEntry) : []
  const runShift = Number.isInteger(data.runShift) && (data.runShift as number) >= 0 ? (data.runShift as number) : 0

  const checkIns = Array.isArray(data.checkIns) ? data.checkIns.filter(isCheckIn) : []

  return { version: 1, startDate, settings: parseSettings(data.settings), log, runShift, checkIns }
}

// Storage can throw (private browsing, quota, disabled site data): the app then simply forgets on reload.
export function loadState(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return (raw && parseState(raw)) || defaultState
  } catch {
    return defaultState
  }
}

export function saveState(state: SavedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Nothing useful to do: the state stays in memory for this visit.
  }
}

export function withLogEntry(state: SavedState, entry: LogEntry): SavedState {
  return { ...state, log: [...state.log, entry] }
}

/** One check-in per week: answering again replaces the week's answers. */
export function withCheckIn(state: SavedState, checkIn: CheckIn): SavedState {
  return { ...state, checkIns: [...state.checkIns.filter((entry) => entry.week !== checkIn.week), checkIn] }
}

export function withFeeling(state: SavedState, finishedAt: string, feeling: Feeling): SavedState {
  return {
    ...state,
    log: state.log.map((entry) => (entry.finishedAt === finishedAt ? { ...entry, feeling } : entry)),
  }
}
