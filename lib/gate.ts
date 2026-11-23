// Passwortschutz („Coming soon“). Seit dem Livegang (23.11.2026) standardmässig AUS.
// Nur wieder einschalten, wenn nötig: SITE_GATE=1 in Vercel setzen (Passwort über SITE_PASSWORD).
export const GATE_COOKIE = 'ab_access'
export const gateEnabled = () => process.env.SITE_GATE === '1' && process.env.GATE_DISABLED !== '1'
const password = () => process.env.SITE_PASSWORD || '121212'

export async function accessToken(pw = password()) {
  const data = new TextEncoder().encode(`azadbedran:${pw}`)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, '0')).join('')
}

export const checkPassword = (input: string) => input === password()
