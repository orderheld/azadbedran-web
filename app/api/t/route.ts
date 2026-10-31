import type { NextRequest } from 'next/server'
import { track, type TrackInput } from '@/lib/analytics/store'
import { isBot, parseUA } from '@/lib/analytics/ua'
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin/token'
import { hasDb } from '@/lib/db'

// Eigene, cookielose Besucherstatistik.
// Es werden keine IP-Adressen gespeichert: Besucher werden über einen täglich wechselnden,
// nicht umkehrbaren Hash (Tages-Salt + IP + Browser) gezählt, wie bei Plausible/Fathom.

const types = new Set(['pageview', 'click', 'ping', 'leave'])
const clip = (v: unknown, n: number) => (typeof v === 'string' && v ? v.slice(0, n) : null)

async function visitorId(ip: string, ua: string, host: string) {
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zurich' }).format(new Date())
  const salt = process.env.ANALYTICS_SALT ?? process.env.ADMIN_SECRET ?? process.env.DATABASE_URL ?? 'azadbedran'
  const data = new TextEncoder().encode(`${salt}|${day}|${ip}|${ua}|${host}`)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash).slice(0, 12), (b) => b.toString(16).padStart(2, '0')).join('')
}

function hostOf(url: string | null) {
  if (!url) return null
  try {
    return new URL(url).hostname.replace(/^www\./, '').replace(/^(l|lm|m)\.(facebook|instagram)\.com$/, '$2.com')
  } catch {
    return null
  }
}

const decode = (v: string | null) => {
  if (!v) return null
  try {
    return decodeURIComponent(v)
  } catch {
    return v
  }
}

export async function POST(req: NextRequest) {
  const ok = new Response(null, { status: 204 })
  if (!hasDb()) return ok
  const ua = req.headers.get('user-agent') ?? ''
  if (isBot(ua)) return ok
  if (await verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) return ok // eigene Besuche nicht zählen

  let body: Record<string, unknown>
  try {
    body = JSON.parse(await req.text())
  } catch {
    return ok
  }
  if (!types.has(String(body.type)) || typeof body.path !== 'string' || !body.path.startsWith('/')) return ok

  const ownHost = req.nextUrl.hostname.replace(/^www\./, '')
  const refUrl = clip(body.referrer, 500)
  let refHost = hostOf(refUrl)
  if (refHost === ownHost) refHost = null
  const utm = (body.utm ?? {}) as Record<string, unknown>
  if (!refHost && utm.source) refHost = clip(utm.source, 80)

  const input: TrackInput = {
    type: body.type as TrackInput['type'],
    pid: clip(body.pid, 40) ?? '',
    path: body.path.slice(0, 300),
    lang: body.path.match(/^\/(?:soon\/)?(ku|tr|en|ru)\b/)?.[1] ?? null,
    referrer: refHost,
    referrerUrl: refHost ? refUrl : null,
    utm: { source: clip(utm.source, 80), medium: clip(utm.medium, 80), campaign: clip(utm.campaign, 120) },
    screen: clip(body.screen, 20),
    target: clip(body.target, 500),
    label: clip(body.label, 120),
    external: typeof body.external === 'boolean' ? body.external : null,
    duration: typeof body.duration === 'number' ? Math.max(0, Math.round(body.duration)) : null,
  }

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || req.headers.get('x-real-ip') || ''
  const { device, browser, os } = parseUA(ua)
  try {
    await track(input, {
      visitor: await visitorId(ip, ua, ownHost),
      country: req.headers.get('x-vercel-ip-country'),
      region: decode(req.headers.get('x-vercel-ip-country-region')),
      city: decode(req.headers.get('x-vercel-ip-city')),
      device,
      browser,
      os,
    })
  } catch (e) {
    console.error('[analytics]', e)
  }
  return ok
}
