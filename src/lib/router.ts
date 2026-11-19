import { useSyncExternalStore } from 'react'

// Hash routing keeps the app working from any static host without server rewrites.
function currentPath(): string {
  return window.location.hash.slice(1) || '/'
}

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

export function useRoute(): string {
  return useSyncExternalStore(subscribe, currentPath)
}

/** `replace` swaps the current history entry, so Back skips a finished session screen. */
export function navigate(path: string, { replace = false } = {}): void {
  if (replace) window.location.replace(`#${path}`)
  else window.location.hash = path
}

export function goBack(fallback = '/'): void {
  if (window.history.length > 1) window.history.back()
  else navigate(fallback)
}
