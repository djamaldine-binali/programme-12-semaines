import { createClient } from 'npm:@supabase/supabase-js@2.119.0'

const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}')

export const db = createClient(Deno.env.get('SUPABASE_URL')!, secretKeys.default)

// Only the app's own sites may call the public functions.
const allowedOrigins = ['https://djamaldine-binali.github.io', 'http://localhost:5173', 'http://localhost:4173']

export function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('origin') ?? ''
  return {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  }
}
