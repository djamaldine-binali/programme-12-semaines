import { programDay } from '../lib/schedule'
import { useToday } from '../lib/useToday'
import { useAppState } from '../state/appStateContext'
import { FinishedScreen } from './FinishedScreen'
import { StartDatePicker } from './StartDatePicker'
import { TodayPlan } from './TodayPlan'
import { WaitingScreen } from './WaitingScreen'

export function Today() {
  const { state } = useAppState()
  const today = useToday()

  if (!state.startDate) return <StartDatePicker today={today} />

  const day = programDay(state.startDate, today)
  if (day.phase === 'before') return <WaitingScreen startDate={state.startDate} daysUntilStart={day.daysUntilStart} />
  if (day.phase === 'after') return <FinishedScreen startDate={state.startDate} today={today} />
  return <TodayPlan startDate={state.startDate} day={day} today={today} />
}
