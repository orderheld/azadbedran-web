// Admin-Sitzung: signiertes Cookie (HMAC-SHA256), läuft auch im Proxy (Web Crypto).
// Passwort über ADMIN_PASSWORD (Vercel-Env). Ohne ADMIN_PASSWORD ist der Admin-Bereich gesperrt.
export const ADMIN_COOKIE = 'ab_admin'
export const SESSION_DAYS = 14

export const adminPassword = () => process.env.ADMIN_PASSWORD || ''
export const adminConfigured = () => adminPassword().length >= 8

const enc = new TextEncoder()
const hex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')

async function key() {
  const secret = `${process.env.ADMIN_SECRET ?? ''}|${adminPassword()}|azadbedran-admin`
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
}

async function sign(payload: string) {
  return hex(await crypto.subtle.sign('HMAC', await key(), enc.encode(payload)))
}

// Vergleich in konstanter Zeit
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function createSessionToken() {
  const exp = Date.now() + SESSION_DAYS * 864e5
  return `${exp}.${await sign(String(exp))}`
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token || !adminConfigured()) return false
  const [exp, sig] = token.split('.')
  if (!exp || !sig || Number(exp) < Date.now()) return false
  return safeEqual(sig, await sign(exp))
}

export async function checkAdminPassword(input: string) {
  if (!adminConfigured()) return false
  // Hash beider Seiten, damit der Vergleich nicht von der Länge abhängt
  const [a, b] = await Promise.all([sign(`pw:${input}`), sign(`pw:${adminPassword()}`)])
  return safeEqual(a, b)
}
