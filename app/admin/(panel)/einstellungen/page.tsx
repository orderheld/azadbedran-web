import { Card, Flash, PageHead } from '@/components/admin/ui'
import { hasDb, sql } from '@/lib/db'
import { adminConfigured } from '@/lib/admin/token'
import { gateEnabled } from '@/lib/gate'
import { site } from '@/lib/site'
import { resetStats } from '../../actions'

export const metadata = { title: 'Einstellungen & SEO' }

async function dbInfo() {
  if (!sql) return null
  try {
    const [r] = await sql`select
      (select count(*)::int from analytics_events) as events,
      (select min(ts) from analytics_events) as since,
      pg_size_pretty(pg_database_size(current_database())) as size`
    return r
  } catch {
    return null
  }
}

export default async function Settings({ searchParams }: PageProps<'/admin/einstellungen'>) {
  const { ok } = await searchParams
  const info = await dbInfo()
  const env = [
    { key: 'DATABASE_URL', ok: hasDb(), text: 'Neon-Datenbank für Inhalte und Statistik' },
    { key: 'ADMIN_PASSWORD', ok: adminConfigured(), text: 'Passwort für diesen Admin-Bereich (mind. 8 Zeichen)' },
    { key: 'ADMIN_SECRET', ok: !!process.env.ADMIN_SECRET, text: 'Optional: zusätzlicher geheimer Schlüssel für die Anmeldung', optional: true },
    { key: 'NEXT_PUBLIC_SITE_URL', ok: !!process.env.NEXT_PUBLIC_SITE_URL, text: `Adresse der Website (jetzt: ${site.url})` },
    { key: 'GOOGLE_SITE_VERIFICATION', ok: !!process.env.GOOGLE_SITE_VERIFICATION, text: 'Optional: Bestätigungscode der Google Search Console', optional: true },
    { key: 'GATE_DISABLED', ok: !gateEnabled(), text: gateEnabled() ? 'Vorschau-Passwort ist aktiv. Zum Livegang GATE_DISABLED=1 setzen.' : 'Website ist öffentlich' },
  ]
  return (
    <>
      <PageHead title="Einstellungen & SEO" />
      <Flash ok={ok} />
      <Card title="Konfiguration (Vercel → Settings → Environment Variables)">
        <table className="tbl">
          <tbody>
            {env.map((e) => (
              <tr key={e.key}>
                <td><span className={`dot ${e.ok ? 'dot-ok' : e.optional ? 'dot-off' : 'dot-warn'}`} /> <code>{e.key}</code></td>
                <td>{e.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint">Nach jeder Änderung an den Variablen in Vercel ein neues Deployment starten (Deployments → … → Redeploy).</p>
      </Card>

      <div className="grid-2">
        <Card title="Suchmaschinen">
          <ul className="list">
            <li><a href="/sitemap.xml" target="_blank" rel="noopener">sitemap.xml</a><span className="muted">Liste aller Seiten in 4 Sprachen für Google</span></li>
            <li><a href="/robots.txt" target="_blank" rel="noopener">robots.txt</a><span className="muted">Admin-Bereich und Schnittstellen sind gesperrt</span></li>
            <li><a href="https://search.google.com/search-console" target="_blank" rel="noopener">Google Search Console ↗</a><span className="muted">Domain hinzufügen, Sitemap einreichen</span></li>
            <li><a href="https://www.bing.com/webmasters" target="_blank" rel="noopener">Bing Webmaster Tools ↗</a><span className="muted">Kann die Daten aus der Search Console übernehmen</span></li>
            <li><a href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(site.url + '/ku')}`} target="_blank" rel="noopener">PageSpeed Insights ↗</a><span className="muted">Ladezeit und Core Web Vitals prüfen</span></li>
            <li><a href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(site.url + '/ku/concerts')}`} target="_blank" rel="noopener">Rich-Results-Test ↗</a><span className="muted">Konzerte als Google-Ereignisse prüfen</span></li>
          </ul>
          <p className="hint">Solange das Vorschau-Passwort aktiv ist, sieht Google nur die „Coming soon“-Seite.</p>
        </Card>
        <Card title="Statistik & Datenschutz">
          <p>Die Statistik setzt keine Cookies und speichert keine IP-Adressen. Besucher werden über einen anonymen Code gezählt, der sich jeden Tag ändert. Ein Cookie-Banner ist dafür nicht nötig; die Datenschutzerklärung beschreibt es.</p>
          {info && <p className="muted">{Number(info.events).toLocaleString('de-CH')} gespeicherte Ereignisse{info.since ? ` seit ${new Date(info.since).toLocaleDateString('de-CH')}` : ''} · Datenbank {info.size}. Rohdaten älter als 25 Monate werden automatisch gelöscht.</p>}
          <form action={resetStats} className="inline-form">
            <label className="field">Statistik komplett löschen: zur Bestätigung <b>LÖSCHEN</b> eingeben
              <input name="confirm" placeholder="LÖSCHEN" disabled={!hasDb()} />
            </label>
            <button className="btn btn-danger" disabled={!hasDb()}>Statistik zurücksetzen</button>
          </form>
        </Card>
      </div>
    </>
  )
}
