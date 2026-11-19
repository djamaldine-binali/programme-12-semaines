import { createContext, use } from 'react'
import type { SavedState } from '../lib/storage'

interface AppStateValue {
  state: SavedState
  update: (change: (previous: SavedState) => SavedState) => void
}

export const AppStateContext = createContext<AppStateValue | null>(null)

export function useAppState(): AppStateValue {
  const value = use(AppStateContext)
  if (!value) throw new Error('useAppState must be used inside AppStateProvider')
  return value
}
