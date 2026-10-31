import Link from 'next/link'
import { Card, DbNotice, Flash, PageHead, countryLabel, dateOnly } from '@/components/admin/ui'
import { adminConcerts } from '@/lib/admin/data'

export const metadata = { title: 'Konzerte' }

export default async function Concerts({ searchParams }: PageProps<'/admin/konzerte'>) {
  const { ok } = await searchParams
  const all = await adminConcerts()
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(new Date())
  const upcoming = all.filter((c) => c.date >= today).reverse()
  const past = all.filter((c) => c.date < today)
  const table = (rows: typeof all) => (
    <table className="tbl">
      <thead><tr><th>Datum</th><th>Stadt</th><th>Ort</th><th>Tickets</th><th>Status</th></tr></thead>
      <tbody>
        {rows.map((c) => (
          <tr key={c.id}>
            <td><Link href={`/admin/konzerte/${c.id}`}><b>{dateOnly(c.date)}</b></Link>{c.time && <span className="muted"> · {c.time}</span>}</td>
            <td><Link href={`/admin/konzerte/${c.id}`}>{c.city}</Link><br /><small className="muted">{countryLabel(c.country)}</small></td>
            <td>{c.venue ?? <span className="muted">noch offen</span>}</td>
            <td>{c.ticket_url ? '🎟 Link' : c.phone ? '📞 Reservierung' : <span className="muted">–</span>}</td>
            <td>
              {!c.published && <span className="tag">Entwurf</span>}
              {c.sold_out && <span className="tag tag-warn">Ausverkauft</span>}
              {c.published && !c.sold_out && <span className="tag tag-ok">Online</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
  return (
    <>
      <PageHead title="Konzerte" sub="Der nächste Termin erscheint automatisch oben auf der Startseite und im Popup.">
        <Link href="/admin/konzerte/neu" className="btn btn-primary">+ Neues Konzert</Link>
      </PageHead>
      <Flash ok={ok} />
      <DbNotice />
      <Card title={`Kommende Konzerte (${upcoming.length})`}>{upcoming.length ? table(upcoming) : <p className="empty">Keine kommenden Konzerte</p>}</Card>
      <Card title={`Vergangene Konzerte (${past.length})`}>{table(past)}</Card>
    </>
  )
}
