import { useCallback, useEffect, useState } from 'react'
import type { DayKey } from './schedule'
import {
  addIntake,
  intakesOf,
  readGoalMl,
  removeIntake,
  saveGoalMl,
  WATER_CHANNEL,
  type WaterIntake,
} from './waterStore'

export interface WaterDay {
  intakes: WaterIntake[]
  totalMl: number
  goalMl: number
  ready: boolean
  drink: (ml: number) => void
  undoLast: () => void
  setGoal: (ml: number) => void
}

export function useWater(day: DayKey): WaterDay {
  const [intakes, setIntakes] = useState<WaterIntake[]>([])
  const [goalMl, setGoalMl] = useState<number | null>(null)

  const reload = useCallback(() => {
    void Promise.all([intakesOf(day), readGoalMl()]).then(([dayIntakes, goal]) => {
      setIntakes(dayIntakes)
      setGoalMl(goal)
    })
  }, [day])

  // A glass logged from a notification, or in another tab, shows up here right away.
  useEffect(() => {
    reload()
    const channel = new BroadcastChannel(WATER_CHANNEL)
    channel.onmessage = reload
    document.addEventListener('visibilitychange', reload)
    return () => {
      channel.close()
      document.removeEventListener('visibilitychange', reload)
    }
  }, [reload])

  return {
    intakes,
    totalMl: intakes.reduce((total, intake) => total + intake.ml, 0),
    goalMl: goalMl ?? 0,
    ready: goalMl !== null,
    drink: (ml) => void addIntake(day, ml),
    undoLast: () => {
      const last = intakes.at(-1)
      if (last?.id !== undefined) void removeIntake(last.id)
    },
    setGoal: (ml) => void saveGoalMl(ml),
  }
}
