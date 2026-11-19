import { useEffect } from 'react'

/** Keeps the screen on while `active` is true, when the browser supports it. */
export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return
    const held: { sentinel: WakeLockSentinel | null; cancelled: boolean } = { sentinel: null, cancelled: false }

    const request = async () => {
      if (document.visibilityState !== 'visible') return
      try {
        const lock = await navigator.wakeLock.request('screen')
        if (held.cancelled) void lock.release()
        else held.sentinel = lock
      } catch {
        // Refused (battery saver, unsupported context): the timer still works, the screen may just dim.
      }
    }

    // The lock is dropped whenever the page is hidden, so it has to be requested again on return.
    const onVisibilityChange = () => void request()

    void request()
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      held.cancelled = true
      document.removeEventListener('visibilitychange', onVisibilityChange)
      void held.sentinel?.release()
    }
  }, [active])
}
