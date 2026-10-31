import Link from 'next/link'
import { BarList, fmt } from '@/components/admin/charts'
import RangeTabs from '@/components/admin/RangeTabs'
import { Card, DbNotice, PageHead, countryLabel, dateTime } from '@/components/admin/ui'
import { getClickDetail, getClicks, getRange } from '@/lib/analytics/store'
import { hasDb } from '@/lib/db'

export const metadata = { title: 'Link-Klicks' }

function kind(target: string) {
  if (target.startsWith('tel:')) return '📞 Anruf'
  if (/wa\.me|whatsapp/.test(target)) return '💬 WhatsApp'
  if (/spotify/.test(target)) return 'Spotify'
  if (/music\.apple|itunes/.test(target)) return 'Apple Music'
  if (/music\.youtube/.test(target)) return 'YouTube Music'
  if (/youtube|youtu\.be/.test(target)) return 'YouTube'
  if (/deezer/.test(target)) return 'Deezer'
  if (/instagram/.test(target)) return 'Instagram'
  if (/facebook/.test(target)) return 'Facebook'
  if (/x\.com|twitter/.test(target)) return 'X'
  if (/amazon/.test(target)) return 'Amazon Music'
  if (/tidal/.test(target)) return 'TIDAL'
  if (/anghami/.test(target)) return 'Anghami'
  if (/shazam/.test(target)) return 'Shazam'
  if (target.startsWith('/')) return 'Intern'
  try { return new URL(target).hostname.replace(/^www\./, '') } catch { return 'Link' }
}

export default async function Clicks({ searchParams }: PageProps<'/admin/klicks'>) {
  const sp = await searchParams
  const range = getRange(typeof sp.r === 'string' ? sp.r : undefined)
  const target = typeof sp.target === 'string' ? sp.target : null
  const all = sp.all === '1'
  if (!hasDb()) return <><PageHead title="Link-Klicks" /><DbNotice /></>

  if (target) {
    const d = await getClickDetail(target, range)
    return (
      <>
        <PageHead title="Link-Details" sub={target}>
          <RangeTabs range={range} base="/admin/klicks" extra={`&target=${encodeURIComponent(target)}`} />
        </PageHead>
        <p><Link href={`/admin/klicks?r=${range.key}`}>← Alle Links</Link></p>
        <div className="grid-2">
          <Card title="Geklickt auf Seite"><BarList rows={d.pages} valueLabel="Personen" /></Card>
          <Card title="Besucher kamen von"><BarList rows={d.referrers} valueLabel="Personen" /></Card>
          <Card title="Länder"><BarList rows={d.countries} label={countryLabel} valueLabel="Personen" /></Card>
          <Card title="Städte"><BarList rows={d.cities} valueLabel="Personen" /></Card>
          <Card title="Geräte"><BarList rows={d.devices} valueLabel="Personen" /></Card>
          <Card title="Browser & Apps"><BarList rows={d.browsers} valueLabel="Personen" /></Card>
        </div>
        <Card title="Letzte Klicks">
          <table className="tbl">
            <thead><tr><th>Zeit</th><th>Seite</th><th>Ort</th><th>Gerät</th><th>Herkunft</th></tr></thead>
            <tbody>
              {d.recent.map((e, i) => (
                <tr key={i}>
                  <td>{dateTime(e.ts)}</td>
                  <td><code>{e.path}</code></td>
                  <td>{countryLabel(e.country)}{e.city ? ` · ${e.city}` : ''}</td>
                  <td>{e.device} · {e.browser} · {e.os}</td>
                  <td>{e.referrer ?? 'Direkt'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </>
    )
  }

  const rows = await getClicks(range, 200, !all)
  const total = rows.reduce((n, r) => n + r.clicks, 0)
  return (
    <>
      <PageHead title="Link-Klicks" sub="Welche Links angeklickt werden, wie oft, auf welcher Seite und von wo die Besucher kommen.">
        <RangeTabs range={range} base="/admin/klicks" extra={all ? '&all=1' : ''} />
      </PageHead>
      <nav className="tabs tabs-small">
        <Link href={`/admin/klicks?r=${range.key}`} className={!all ? 'is-active' : undefined}>Externe Links, Anrufe & WhatsApp</Link>
        <Link href={`/admin/klicks?r=${range.key}&all=1`} className={all ? 'is-active' : undefined}>Alle Links (auch Menü)</Link>
      </nav>
      <Card title={`${fmt(total)} Klicks`}>
        {rows.length ? (
          <table className="tbl">
            <thead><tr><th>Link</th><th>Art</th><th className="num">Klicks</th><th className="num">Personen</th><th>Auf Seiten</th><th>Länder</th></tr></thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.target}>
                  <td>
                    <Link href={`/admin/klicks?r=${range.key}&target=${encodeURIComponent(c.target)}`}><b>{c.label || c.target}</b></Link>
                    <br /><small className="muted break">{c.target}</small>
                  </td>
                  <td>{kind(c.target)}</td>
                  <td className="num"><b>{fmt(c.clicks)}</b></td>
                  <td className="num">{fmt(c.visitors)}</td>
                  <td><small>{c.pages.join(', ')}</small></td>
                  <td>{c.countries.map((cc) => countryLabel(cc).split(' ')[0]).join(' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="empty">Noch keine Klicks in diesem Zeitraum</p>}
      </Card>
    </>
  )
}
