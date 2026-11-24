import type { Servings } from '../lib/storage'
import { useAppState } from '../state/appStateContext'
import { ChoiceGroup } from './ChoiceGroup'

const options: { value: Servings; label: string }[] = [
  { value: 1, label: '1 personne' },
  { value: 2, label: '2 personnes' },
]

export function ServingsChoice() {
  const { state, update } = useAppState()
  return (
    <ChoiceGroup
      legend="Quantités pour"
      options={options}
      value={state.settings.servings}
      onChange={(servings) => update((previous) => ({ ...previous, settings: { ...previous.settings, servings } }))}
    />
  )
}
