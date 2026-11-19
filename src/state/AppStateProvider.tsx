import { useEffect, useState, type ReactNode } from 'react'
import { loadState, saveState } from '../lib/storage'
import { AppStateContext } from './appStateContext'

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(loadState)

  useEffect(() => saveState(state), [state])

  useEffect(() => {
    const root = document.documentElement
    if (state.settings.theme === 'auto') delete root.dataset.theme
    else root.dataset.theme = state.settings.theme
  }, [state.settings.theme])

  return <AppStateContext value={{ state, update: setState }}>{children}</AppStateContext>
}
