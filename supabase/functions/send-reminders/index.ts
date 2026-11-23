import * as webpush from 'jsr:@negrel/webpush@0.5.0'
import { db } from '../_shared/db.ts'

// Called every hour by pg_cron with a shared secret; the phone words the reminder itself.
const vapidKeys = await webpush.importVapidKeys(JSON.parse(Deno.env.get('VAPID_KEYS')!))
const server = await webpush.ApplicationServer.new({
  contactInformation: Deno.env.get('VAPID_CONTACT')!,
  vapidKeys,
})

function localHour(timezone: string, now: Date): number {
  const hour = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, hour: '2-digit', hourCycle: 'h23' }).format(now)
  return Number(hour)
}

Deno.serve(async (request) => {
  if (request.headers.get('x-cron-secret') !== Deno.env.get('CRON_SECRET')) {
    return new Response('Forbidden', { status: 403 })
  }

  const { data, error } = await db.from('push_subscriptions').select('endpoint, p256dh, auth, timezone, hours')
  if (error) return Response.json({ error: error.message }, { status: 500 })

  const now = new Date()
  const due = data.filter((row) => row.hours.includes(localHour(row.timezone, now)))
  let sent = 0
  for (const row of due) {
    try {
      await server
        .subscribe({ endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } })
        .pushTextMessage('water', { ttl: 3600, urgency: webpush.Urgency.Normal, topic: 'water' })
      sent += 1
    } catch (caught) {
      if (caught instanceof webpush.PushMessageError && caught.isGone()) {
        await db.from('push_subscriptions').delete().eq('endpoint', row.endpoint)
      }
    }
  }
  return Response.json({ due: due.length, sent })
})
