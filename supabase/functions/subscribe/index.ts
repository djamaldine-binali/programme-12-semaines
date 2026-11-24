import { z } from 'npm:zod@4.6.7'
import { corsHeaders, db } from '../_shared/db.ts'

// Push services of Apple, Google, Mozilla and Microsoft: nothing else may be stored as an endpoint.
const pushHosts = ['web.push.apple.com', 'fcm.googleapis.com', 'updates.push.services.mozilla.com']

function isPushService(endpoint: string): boolean {
  const url = URL.parse(endpoint)
  if (!url || url.protocol !== 'https:') return false
  return pushHosts.includes(url.hostname) || url.hostname.endsWith('.notify.windows.com')
}

// One person uses the app: a handful of phones and browsers at most. The cap keeps a script from
// filling the table and slowing down the hourly send.
const MAX_SUBSCRIPTIONS = 5

const body = z.object({
  subscription: z.object({
    endpoint: z.string().max(1000).refine(isPushService),
    keys: z.object({ p256dh: z.string().max(200), auth: z.string().max(100) }),
  }),
  timezone: z
    .string()
    .max(64)
    .refine((zone) => Intl.supportedValuesOf('timeZone').includes(zone)),
  hours: z.array(z.number().int().min(0).max(23)).min(1).max(12),
})

Deno.serve(async (request) => {
  const headers = corsHeaders(request)
  if (request.method === 'OPTIONS') return new Response(null, { headers })
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers })

  const parsed = body.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'Abonnement invalide.' }, { status: 400, headers })

  const { subscription, timezone, hours } = parsed.data
  const { count } = await db.from('push_subscriptions').select('endpoint', { count: 'exact', head: true })
  const { data: existing } = await db
    .from('push_subscriptions')
    .select('endpoint')
    .eq('endpoint', subscription.endpoint)
  if ((count ?? 0) >= MAX_SUBSCRIPTIONS && !existing?.length) {
    return Response.json({ error: 'Trop de téléphones inscrits aux rappels.' }, { status: 429, headers })
  }
  const { error } = await db.from('push_subscriptions').upsert({
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
    timezone,
    hours,
  })
  if (error) return Response.json({ error: "L'abonnement n'a pas été enregistré." }, { status: 500, headers })
  return Response.json({ ok: true }, { headers })
})
