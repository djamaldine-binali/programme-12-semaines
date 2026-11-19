import { useEffect, useEffectEvent, useRef } from 'react'
import { navigate } from './router'

const GUARD_STATE = { sessionGuard: true }

function isGuard(state: unknown): boolean {
  return typeof state === 'object' && state !== null && 'sessionGuard' in state
}

/**
 * While `active`, the system back gesture asks before leaving instead of dropping the session.
 * An extra history entry on the same URL catches the first "back"; the guard is then put back.
 * Returns the function to call once leaving is confirmed.
 */
export function useLeaveGuard(active: boolean, onLeaveAttempt: () => void): () => void {
  const leaving = useRef(false)
  const attempt = useEffectEvent(onLeaveAttempt)

  useEffect(() => {
    if (!active) return
    window.history.pushState(GUARD_STATE, '')

    const onPopState = (event: PopStateEvent) => {
      // Landing on a guard entry is not an exit (it happens when the guard is removed and set again).
      if (leaving.current || isGuard(event.state)) return
      window.history.pushState(GUARD_STATE, '')
      attempt()
    }

    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      if (!leaving.current && isGuard(window.history.state)) window.history.back()
    }
  }, [active])

  return () => {
    leaving.current = true
    // Two entries back: the guard, then the session itself. Opened directly, there is nothing to go back to.
    if (window.history.length > 2) window.history.go(-2)
    else navigate('/', { replace: true })
  }
}
