import { z } from 'npm:zod@4.6.7'
import { corsHeaders, db } from '../_shared/db.ts'

const body = z.object({ endpoint: z.string().max(1000) })

Deno.serve(async (request) => {
  const headers = corsHeaders(request)
  if (request.method === 'OPTIONS') return new Response(null, { headers })
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers })

  const parsed = body.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'Demande invalide.' }, { status: 400, headers })

  await db.from('push_subscriptions').delete().eq('endpoint', parsed.data.endpoint)
  return Response.json({ ok: true }, { headers })
})
