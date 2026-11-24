import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
  const interval = window.setInterval(onChange, 30_000)
  document.addEventListener('visibilitychange', onChange)
  return () => {
    window.clearInterval(interval)
    document.removeEventListener('visibilitychange', onChange)
  }
}

/** The current time, to the minute, for screens that change as the day goes by. */
export function useNow(): Date {
  const minute = useSyncExternalStore(subscribe, () => Math.floor(Date.now() / 60_000))
  return new Date(minute * 60_000)
}
