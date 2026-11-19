import { useEffect, useRef } from 'react'

/**
 * Moves focus to the element when it appears, so keyboard and screen reader users
 * land on the new step instead of the top of the page. The element needs tabIndex={-1}.
 */
export function useFocusOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => ref.current?.focus(), [])
  return ref
}
