import Link from 'next/link'
import { Kpi, VisitorChart } from '@/components/admin/charts'
import LiveBoard from '@/components/admin/LiveBoard'
import { Card, DbNotice, Flash, PageHead, countryLabel, dateOnly } from '@/components/admin/ui'
import { BarList } from '@/components/admin/charts'
import { adminConcerts, adminNews } from '@/lib/admin/data'
import { getRange, getStats } from '@/lib/analytics/store'
import { hasDb } from '@/lib/db'
import { adminConfigured } from '@/lib/admin/token'
import { gateEnabled } from '@/lib/gate'

export const metadata = { title: 'Dashboard' }

export default async function Dashboard({ searchParams }: PageProps<'/admin'>) {
  const { ok } = await searchParams
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(new Date())
  const [concerts, news, stats] = await Promise.all([
    adminConcerts(),
    adminNews(),
    hasDb() ? getStats(getRange('7d')) : null,
  ])
  const upcoming = concerts.filter((c) => c.date >= today).reverse()

  return (
    <>
      <PageHead title="Dashboard" sub="Willkommen zurück. Hier siehst du das Wichtigste auf einen Blick.">
        <Link href="/admin/konzerte/neu" className="btn btn-primary">+ Konzert</Link>
        <Link href="/admin/news/neu" className="btn">+ News</Link>
      </PageHead>
      <Flash ok={ok} />
      <DbNotice />
      {gateEnabled() && (
        <p className="notice notice-info">Die Website ist noch durch das Vorschau-Passwort geschützt („Coming soon“). Besucher sehen bis zum Livegang die Vorschau-Seite; sie wird trotzdem gezählt.</p>
      )}

      {hasDb() && (
        <Card title="Live" action={<Link className="more" href="/admin/live">Alle Live-Daten →</Link>}>
          <LiveBoard compact />
        </Card>
      )}

      {stats && (
        <>
          <div className="kpis">
            <Kpi label="Besucher (7 Tage)" value={stats.now.visitors} prev={stats.prev.visitors} />
            <Kpi label="Seitenaufrufe" value={stats.now.pageviews} prev={stats.prev.pageviews} />
            <Kpi label="Link-Klicks" value={stats.now.clicks} prev={stats.prev.clicks} />
            <Kpi label="Absprungrate" value={stats.now.bounceRate} prev={stats.prev.bounceRate} format={(n) => `${n} %`} invert />
          </div>
          <div className="grid-2 grid-2-wide">
            <Card title="Besucher · letzte 7 Tage" action={<Link className="more" href="/admin/statistik">Statistik →</Link>}>
              <VisitorChart points={stats.points} />
            </Card>
            <Card title="Top-Länder">
              <BarList rows={stats.countries.slice(0, 6)} label={countryLabel} />
            </Card>
          </div>
        </>
      )}

      <div className="grid-2">
        <Card title="Nächste Konzerte" action={<Link className="more" href="/admin/konzerte">Alle →</Link>}>
          {upcoming.length ? (
            <ul className="list">
              {upcoming.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link href={`/admin/konzerte/${c.id}`}><b>{dateOnly(c.date)}</b> · {c.city}</Link>
                  <span className="muted">{c.venue ?? 'Ort offen'}{!c.ticket_url && !c.phone ? ' · ⚠ keine Tickets/Reservierung' : ''}</span>
                </li>
              ))}
            </ul>
          ) : <p className="empty">Keine kommenden Konzerte. <Link href="/admin/konzerte/neu">Jetzt eintragen</Link></p>}
        </Card>
        <Card title="Neueste News" action={<Link className="more" href="/admin/news">Alle →</Link>}>
          <ul className="list">
            {news.slice(0, 5).map((n) => (
              <li key={n.id}>
                <Link href={`/admin/news/${n.id}`}><b>{dateOnly(n.date)}</b> · {n.title_ku}</Link>
                {!n.published && <span className="tag">Entwurf</span>}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="System">
        <ul className="status">
          <li className={hasDb() ? 'ok' : 'warn'}>Datenbank {hasDb() ? 'verbunden' : 'nicht verbunden'}</li>
          <li className={adminConfigured() ? 'ok' : 'warn'}>Admin-Passwort {adminConfigured() ? 'gesetzt' : 'fehlt'}</li>
          <li className={gateEnabled() ? 'warn' : 'ok'}>Website {gateEnabled() ? 'im Vorschau-Modus (Passwort)' : 'öffentlich'}</li>
          <li className={process.env.NEXT_PUBLIC_SITE_URL ? 'ok' : 'warn'}>Domain {process.env.NEXT_PUBLIC_SITE_URL ?? 'nicht gesetzt (Standard azadbedran.com)'}</li>
        </ul>
      </Card>
    </>
  )
}
