import { useAppState } from '../state/appStateContext'
import { playCue, type Cue } from './sound'

export function useCue(): (cue: Cue) => void {
  const { settings } = useAppState().state
  return (cue) => playCue(cue, settings)
}
