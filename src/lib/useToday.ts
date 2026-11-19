import { useSyncExternalStore } from 'react'
import { toDayKey, type DayKey } from './schedule'

// The app often stays open overnight on a phone: re-check the date when it comes back and every minute.
function subscribe(onChange: () => void) {
  const interval = window.setInterval(onChange, 60_000)
  document.addEventListener('visibilitychange', onChange)
  return () => {
    window.clearInterval(interval)
    document.removeEventListener('visibilitychange', onChange)
  }
}

export function useToday(): DayKey {
  return useSyncExternalStore(subscribe, () => toDayKey(new Date()))
}
