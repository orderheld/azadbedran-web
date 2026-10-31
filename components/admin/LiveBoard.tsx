'use client'
import { useEffect, useState } from 'react'

type Visitor = { visitor: string; path: string; country: string | null; city: string | null; device: string | null; browser: string | null; os: string | null; referrer: string | null; first_seen: string; last_seen: string; pages: number }
type Event = { ts: string; type: string; path: string; target: string | null; label: string | null; country: string | null; city: string | null; device: string | null; browser: string | null; os: string | null; referrer: string | null }
type Data = { visitors: Visitor[]; last30: number; recent: Event[] }

const flag = (cc: string | null) => (cc && /^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc].map((c) => 0x1f1a5 + c.charCodeAt(0))) : '🌐')
const regions = typeof Intl !== 'undefined' ? new Intl.DisplayNames(['de'], { type: 'region' }) : null
const country = (cc: string | null) => {
  if (!cc) return 'Unbekannt'
  try { return regions?.of(cc) ?? cc } catch { return cc }
}
const since = (iso: string) => {
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
  return s < 60 ? `${s} s` : `${Math.floor(s / 60)} min`
}
const time = (iso: string) => new Date(iso).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
const deviceIcon = (d: string | null) => (d === 'Handy' ? '📱' : d === 'Tablet' ? '📲' : '💻')

export default function LiveBoard({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const res = await fetch('/admin/api/live', { cache: 'no-store' })
        if (!res.ok) throw new Error()
        const json = (await res.json()) as Data
        if (alive) { setData(json); setError(false) }
      } catch {
        if (alive) setError(true)
      }
    }
    load()
    const t = window.setInterval(load, 5000)
    return () => { alive = false; window.clearInterval(t) }
  }, [])

  if (!data) return <p className="empty">{error ? 'Live-Daten nicht erreichbar' : 'Lade …'}</p>

  const n = data.visitors.length
  return (
    <div className="live">
      <div className="live-count">
        <span className="live-dot" aria-hidden />
        <b>{n}</b> {n === 1 ? 'Besucher' : 'Besucher'} gerade auf der Website
        <span className="muted"> · {data.last30} in den letzten 30 Minuten</span>
      </div>

      {n > 0 && (
        <table className="tbl live-table">
          <thead><tr><th>Ort</th><th>Seite</th><th>Gerät</th><th>Herkunft</th><th className="num">Seiten</th><th className="num">Seit</th></tr></thead>
          <tbody>
            {data.visitors.slice(0, compact ? 6 : 100).map((v) => (
              <tr key={v.visitor}>
                <td>{flag(v.country)} {v.city ? `${v.city}, ` : ''}{country(v.country)}</td>
                <td><code>{v.path}</code></td>
                <td>{deviceIcon(v.device)} {v.device} · {v.browser}{compact ? '' : ` · ${v.os}`}</td>
                <td>{v.referrer ?? 'Direkt'}</td>
                <td className="num">{v.pages}</td>
                <td className="num">{since(v.first_seen)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!compact && (
        <>
          <h2 className="live-h">Letzte Aktivitäten</h2>
          {data.recent.length ? (
            <ol className="feed">
              {data.recent.map((e, i) => (
                <li key={i}>
                  <time>{time(e.ts)}</time>
                  <span>{flag(e.country)}</span>
                  <span className={`tag tag-${e.type}`}>{e.type === 'click' ? 'Klick' : 'Aufruf'}</span>
                  <span className="feed-main">
                    {e.type === 'click' ? <>{e.label || e.target} <small className="muted">auf {e.path}</small></> : <code>{e.path}</code>}
                  </span>
                  <small className="muted">{[e.city, e.device, e.browser, e.referrer && `von ${e.referrer}`].filter(Boolean).join(' · ')}</small>
                </li>
              ))}
            </ol>
          ) : <p className="empty">Noch keine Aktivitäten</p>}
        </>
      )}
    </div>
  )
}
