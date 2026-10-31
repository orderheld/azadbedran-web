import { BarList, Kpi, VisitorChart, fmt } from '@/components/admin/charts'
import RangeTabs from '@/components/admin/RangeTabs'
import { Card, DbNotice, PageHead, countryLabel, duration, langLabel } from '@/components/admin/ui'
import { getRange, getStats } from '@/lib/analytics/store'
import { hasDb } from '@/lib/db'

export const metadata = { title: 'Besucher' }

const pageLabel = (p: string) => p.replace(/^\/soon\//, '/(Vorschau) ')

export default async function Stats({ searchParams }: PageProps<'/admin/statistik'>) {
  const { r } = await searchParams
  const range = getRange(typeof r === 'string' ? r : undefined)
  if (!hasDb()) return <><PageHead title="Besucher" /><DbNotice /></>
  const s = await getStats(range)
  return (
    <>
      <PageHead title="Besucher" sub="Eigene Statistik ohne Cookies und ohne gespeicherte IP-Adressen. Deine eigenen Besuche (angemeldet) werden nicht gezählt.">
        <RangeTabs range={range} base="/admin/statistik" />
      </PageHead>

      <div className="kpis">
        <Kpi label="Besucher" value={s.now.visitors} prev={s.prev.visitors} />
        <Kpi label="Seitenaufrufe" value={s.now.pageviews} prev={s.prev.pageviews} />
        <Kpi label="Seiten pro Besuch" value={s.now.visitors ? Math.round((s.now.pageviews / s.now.visitors) * 10) / 10 : 0} prev={s.prev.visitors ? Math.round((s.prev.pageviews / s.prev.visitors) * 10) / 10 : 0} format={(n) => n.toLocaleString('de-CH')} />
        <Kpi label="Ø Verweildauer" value={s.now.avgDuration} prev={s.prev.avgDuration} format={duration} />
        <Kpi label="Absprungrate" value={s.now.bounceRate} prev={s.prev.bounceRate} format={(n) => `${n} %`} invert />
        <Kpi label="Link-Klicks" value={s.now.clicks} prev={s.prev.clicks} />
      </div>

      <Card title={`Besucher · ${range.label}`}>
        <VisitorChart points={s.points} />
      </Card>

      <div className="grid-2">
        <Card title="Seiten"><BarList rows={s.pages} label={pageLabel} /></Card>
        <Card title="Einstiegsseiten"><BarList rows={s.entry} label={pageLabel} valueLabel="Einstiege" /></Card>
        <Card title="Herkunft (Websites & Apps)"><BarList rows={s.referrers} /></Card>
        <Card title="Kampagnen (UTM-Links)"><BarList rows={s.campaigns} empty="Keine Kampagnen-Links. Tipp: Links mit ?utm_source=instagram teilen." /></Card>
        <Card title="Länder"><BarList rows={s.countries} label={countryLabel} /></Card>
        <Card title="Städte"><BarList rows={s.cities} label={(k) => { const [city, cc] = k.split(', '); return <>{countryLabel(cc).split(' ')[0]} {city}</> }} /></Card>
        <Card title="Geräte"><BarList rows={s.devices} /></Card>
        <Card title="Browser & Apps"><BarList rows={s.browsers} /></Card>
        <Card title="Betriebssysteme"><BarList rows={s.os} /></Card>
        <Card title="Sprache der Website"><BarList rows={s.langs} label={(k) => langLabel[k] ?? k} /></Card>
      </div>

      <Card title="Meistgeklickte Links" action={<a href={`/admin/klicks?r=${range.key}`} className="more">Alle Klicks →</a>}>
        {s.clicks.length ? (
          <table className="tbl">
            <thead><tr><th>Ziel</th><th className="num">Klicks</th><th className="num">Personen</th></tr></thead>
            <tbody>
              {s.clicks.map((c) => (
                <tr key={c.target}>
                  <td><a href={`/admin/klicks?r=${range.key}&target=${encodeURIComponent(c.target)}`}>{c.label || c.target}</a><br /><small className="muted">{c.target}</small></td>
                  <td className="num">{fmt(c.clicks)}</td>
                  <td className="num">{fmt(c.visitors)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="empty">Noch keine Klicks</p>}
      </Card>
    </>
  )
}
