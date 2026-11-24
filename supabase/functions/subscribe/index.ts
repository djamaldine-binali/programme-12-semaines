import { z } from 'npm:zod@4.6.7'
import { corsHeaders, db } from '../_shared/db.ts'

// Push services of Apple, Google, Mozilla and Microsoft: nothing else may be stored as an endpoint.
const pushHosts = /^https:\/\/([\w-]+\.)*(push\.apple\.com|googleapis\.com|mozilla\.com|notify\.windows\.com)\//

const body = z.object({
  subscription: z.object({
    endpoint: z.string().max(1000).regex(pushHosts),
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
