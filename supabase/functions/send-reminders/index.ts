import * as webpush from 'jsr:@negrel/webpush@0.5.0'
import { db } from '../_shared/db.ts'

// Called every hour by pg_cron with a shared secret; the phone words the reminder itself.
const vapidKeys = await webpush.importVapidKeys(JSON.parse(Deno.env.get('VAPID_KEYS')!))
const server = await webpush.ApplicationServer.new({
  contactInformation: Deno.env.get('VAPID_CONTACT')!,
  vapidKeys,
})

function sameSecret(given: string | null, expected: string | undefined): boolean {
  if (!given || !expected) return false
  const a = new TextEncoder().encode(given)
  const b = new TextEncoder().encode(expected)
  if (a.length !== b.length) return false
  let difference = 0
  for (let index = 0; index < a.length; index++) difference |= a[index] ^ b[index]
  return difference === 0
}

// The push library has no timeout of its own: a stuck push service must not hold the whole run.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([promise, new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))])
}

function localHour(timezone: string, now: Date): number {
  const hour = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, hour: '2-digit', hourCycle: 'h23' }).format(now)
  return Number(hour)
}

Deno.serve(async (request) => {
  if (!sameSecret(request.headers.get('x-cron-secret'), Deno.env.get('CRON_SECRET'))) {
    return new Response('Forbidden', { status: 403 })
  }

  const { data, error } = await db.from('push_subscriptions').select('endpoint, p256dh, auth, timezone, hours')
  if (error) return Response.json({ error: error.message }, { status: 500 })

  const now = new Date()
  const due = data.filter((row) => row.hours.includes(localHour(row.timezone, now)))
  const results = await Promise.allSettled(
    due.map((row) =>
      withTimeout(
        server
          .subscribe({ endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } })
          .pushTextMessage('water', { ttl: 3600, urgency: webpush.Urgency.Normal, topic: 'water' }),
        10_000,
      ),
    ),
  )
  // A subscription the push service rejects for good (gone, unknown or malformed) is removed.
  const rejected = due.filter((row, index) => {
    const result = results[index]
    if (result.status === 'fulfilled' || !(result.reason instanceof webpush.PushMessageError)) return false
    return result.reason.isGone() || [400, 403, 404].includes(result.reason.response.status)
  })
  for (const row of rejected) await db.from('push_subscriptions').delete().eq('endpoint', row.endpoint)
  const sent = results.filter((result) => result.status === 'fulfilled').length
  return Response.json({ due: due.length, sent })
})
