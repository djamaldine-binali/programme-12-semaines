import type { SessionKind } from '../lib/storage'
import { withLogEntry } from '../lib/storage'
import { useToday } from '../lib/useToday'
import { useAppState } from './appStateContext'

/** Records a finished session for today and returns its timestamp, which identifies the entry. */
export function useLogSession(): (kind: SessionKind) => string {
  const { update } = useAppState()
  const today = useToday()
  return (kind) => {
    const finishedAt = new Date().toISOString()
    update((previous) => withLogEntry(previous, { day: today, kind, finishedAt }))
    return finishedAt
  }
}
