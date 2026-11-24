// Creates the water-reminder secrets once, without printing them:
//   node scripts/generate-push-secrets.mjs <project-ref>
// Writes supabase/functions/.env (function secrets) and supabase/vault-setup.local (SQL for the Vault),
// both ignored by Git, and .env.local with the two public values the app needs.
import { generateKeyPairSync, randomBytes } from 'node:crypto'
import { existsSync, writeFileSync } from 'node:fs'

const projectRef = process.argv[2]
if (!/^[a-z]{20}$/.test(projectRef ?? '')) {
  console.error('Usage : node scripts/generate-push-secrets.mjs <identifiant du projet Supabase>')
  process.exit(1)
}
if (existsSync('supabase/functions/.env')) {
  console.error('supabase/functions/.env existe déjà : supprime-le pour régénérer les clés.')
  process.exit(1)
}

const { publicKey, privateKey } = generateKeyPairSync('ec', { namedCurve: 'prime256v1' })
const publicJwk = publicKey.export({ format: 'jwk' })
const privateJwk = privateKey.export({ format: 'jwk' })
// The browser wants the raw uncompressed point: 0x04, then x, then y.
const applicationServerKey = Buffer.concat([
  Buffer.from([4]),
  Buffer.from(publicJwk.x, 'base64url'),
  Buffer.from(publicJwk.y, 'base64url'),
]).toString('base64url')
const cronSecret = randomBytes(32).toString('base64url')
const functionsUrl = `https://${projectRef}.supabase.co/functions/v1`

writeFileSync(
  'supabase/functions/.env',
  [
    `VAPID_KEYS=${JSON.stringify({ publicKey: publicJwk, privateKey: privateJwk })}`,
    'VAPID_CONTACT=https://djamaldine-binali.github.io/programme-12-semaines/',
    `CRON_SECRET=${cronSecret}`,
    '',
  ].join('\n'),
)
writeFileSync(
  'supabase/vault-setup.local',
  [
    `select vault.create_secret('https://${projectRef}.supabase.co', 'project_url');`,
    `select vault.create_secret('${cronSecret}', 'cron_secret');`,
    '',
  ].join('\n'),
)
writeFileSync('.env.local', `VITE_PUSH_FUNCTIONS_URL=${functionsUrl}\nVITE_VAPID_PUBLIC_KEY=${applicationServerKey}\n`)

console.log('Secrets écrits dans supabase/functions/.env et supabase/vault-setup.local (non suivis par Git).')
console.log(
  `Valeurs publiques (aussi dans .env.local) :\nVITE_PUSH_FUNCTIONS_URL=${functionsUrl}\nVITE_VAPID_PUBLIC_KEY=${applicationServerKey}`,
)
