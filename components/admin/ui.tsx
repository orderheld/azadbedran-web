import Link from 'next/link'
import { hasDb } from '@/lib/db'

export function PageHead({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <header className="adm-head">
      <div>
        <h1>{title}</h1>
        {sub && <p className="adm-sub">{sub}</p>}
      </div>
      {children && <div className="adm-head-actions">{children}</div>}
    </header>
  )
}

export function Flash({ ok }: { ok?: string | string[] }) {
  if (!ok) return null
  return <p className="notice notice-ok" role="status">✓ {String(ok)}</p>
}

export function DbNotice() {
  if (hasDb()) return null
  return (
    <div className="notice notice-warn">
      <b>Noch keine Datenbank verbunden.</b> Du siehst die eingebauten Startdaten, kannst aber noch nichts speichern und es wird keine Statistik erfasst.
      Verbinde in Vercel unter <b>Storage → Neon</b> eine Datenbank (setzt <code>DATABASE_URL</code>) starte ein neues Deployment und klicke danach hier auf „Datenbank einrichten“. <Link href="/admin/einstellungen">Details</Link>
    </div>
  )
}

export function Card({ title, children, action, className }: { title?: string; children: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <section className={`card${className ? ` ${className}` : ''}`}>
      {(title || action) && (
        <header className="card-head">
          {title && <h2>{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="empty">{children}</p>
}

const regionNames = new Intl.DisplayNames(['de'], { type: 'region' })
export function countryLabel(code: string | null | undefined) {
  if (!code || code === '–' || !/^[A-Z]{2}$/.test(code)) return code || 'Unbekannt'
  const flag = String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0)))
  let name = code
  try {
    name = regionNames.of(code) ?? code
  } catch {}
  return `${flag} ${name}`
}

export const langLabel: Record<string, string> = { ku: 'Kurmancî', tr: 'Türkçe', en: 'English', ru: 'Русский' }

export function duration(sec: number) {
  if (!sec) return '–'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return m ? `${m} min ${String(s).padStart(2, '0')} s` : `${s} s`
}

export const dateTime = (v: string | Date) =>
  new Intl.DateTimeFormat('de-CH', { timeZone: 'Europe/Zurich', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(v))

export const dateOnly = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}.${m}.${y}`
}
