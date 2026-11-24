// Water reminders are sent by a small Supabase function; these two public values point the app at it.
const FUNCTIONS_URL = import.meta.env.VITE_PUSH_FUNCTIONS_URL as string | undefined
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined

export const REMINDER_HOURS = [10, 12, 14, 16, 18, 20]

export type PushSupport = 'ready' | 'needs-install' | 'unsupported' | 'unconfigured'

export function pushSupport(): PushSupport {
  if (!FUNCTIONS_URL || !VAPID_PUBLIC_KEY) return 'unconfigured'
  if (!('serviceWorker' in navigator) || !('Notification' in window)) return 'unsupported'
  // On iPhone, notifications only exist for an app added to the home screen.
  if (!('PushManager' in window)) {
    return /iPhone|iPad/.test(navigator.userAgent) ? 'needs-install' : 'unsupported'
  }
  return 'ready'
}

function keyBytes(base64url: string): Uint8Array<ArrayBuffer> {
  const base64 = (base64url + '='.repeat((4 - (base64url.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/')
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))
}

async function post(path: string, body: unknown): Promise<void> {
  const response = await fetch(`${FUNCTIONS_URL}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`Le serveur de rappels a répondu ${response.status}.`)
}

export async function currentSubscription(): Promise<PushSubscription | null> {
  if (pushSupport() !== 'ready') return null
  const registration = await navigator.serviceWorker.ready
  return registration.pushManager.getSubscription()
}

/** Asks for permission, subscribes the phone and tells the server when to remind. */
export async function enableReminders(): Promise<void> {
  const permission = await Notification.requestPermission()
  if (permission !== 'granted')
    throw new Error('Les notifications sont refusées : autorise-les dans les réglages du téléphone.')
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: keyBytes(VAPID_PUBLIC_KEY!),
  })
  await post('subscribe', {
    subscription: subscription.toJSON(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hours: REMINDER_HOURS,
  })
}

export async function disableReminders(): Promise<void> {
  const subscription = await currentSubscription()
  if (!subscription) return
  await post('unsubscribe', { endpoint: subscription.endpoint })
  await subscription.unsubscribe()
}
