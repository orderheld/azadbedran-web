import 'server-only'
import { sql } from '../db'

// ---------- Erfassen ----------

export type TrackInput = {
  type: 'pageview' | 'click' | 'ping' | 'leave'
  pid: string
  path: string
  lang: string | null
  referrer: string | null
  referrerUrl: string | null
  utm: { source: string | null; medium: string | null; campaign: string | null }
  screen: string | null
  target?: string | null
  label?: string | null
  external?: boolean | null
  duration?: number | null
}
export type TrackContext = { visitor: string; country: string | null; region: string | null; city: string | null; device: string; browser: string; os: string }

export async function track(e: TrackInput, c: TrackContext) {
  if (!sql) return
  if (e.type === 'pageview' || e.type === 'click') {
    await sql`insert into analytics_events (type, visitor, pid, path, lang, referrer, referrer_url, utm_source, utm_medium, utm_campaign, country, region, city, device, browser, os, screen, target, label, external)
      values (${e.type}, ${c.visitor}, ${e.pid}, ${e.path}, ${e.lang}, ${e.referrer}, ${e.referrerUrl}, ${e.utm.source}, ${e.utm.medium}, ${e.utm.campaign}, ${c.country}, ${c.region}, ${c.city}, ${c.device}, ${c.browser}, ${c.os}, ${e.screen}, ${e.target ?? null}, ${e.label ?? null}, ${e.external ?? null})`
  }
  if ((e.type === 'ping' || e.type === 'leave') && e.duration != null) {
    await sql`update analytics_events set duration = greatest(coalesce(duration, 0), ${Math.min(e.duration, 3600)}) where pid = ${e.pid} and type = 'pageview'`
  }
  if (e.type === 'leave') {
    await sql`delete from analytics_live where visitor = ${c.visitor}`
  } else {
    await sql`insert into analytics_live (visitor, path, country, city, device, browser, os, referrer)
      values (${c.visitor}, ${e.path}, ${c.country}, ${c.city}, ${c.device}, ${c.browser}, ${c.os}, ${e.referrer})
      on conflict (visitor) do update set path = excluded.path, last_seen = now(),
        first_seen = case when analytics_live.last_seen < now() - interval '30 minutes' then now() else analytics_live.first_seen end,
        referrer = case when analytics_live.last_seen < now() - interval '30 minutes' then excluded.referrer else coalesce(analytics_live.referrer, excluded.referrer) end`
  }
  // Gelegentlich aufräumen: Live-Liste und Rohdaten älter als 25 Monate
  if (Math.random() < 0.01) {
    await sql`delete from analytics_live where last_seen < now() - interval '1 day'`
    await sql`delete from analytics_events where ts < now() - interval '25 months'`
  }
}

// ---------- Auswerten ----------

export type Range = { key: string; label: string; from: Date; to: Date; prevFrom: Date; bucket: 'hour' | 'day' | 'month' }

const TZ = 'Europe/Zurich'

export function getRange(key: string | undefined): Range {
  const now = new Date()
  const startOfToday = new Date(new Date(now.toLocaleString('en-US', { timeZone: TZ })).setHours(0, 0, 0, 0))
  // Zeitzonen-Versatz zwischen Server (UTC) und Zürich ausgleichen
  const offset = new Date(now.toLocaleString('en-US', { timeZone: TZ })).getTime() - new Date(now.toLocaleString('en-US', { timeZone: 'UTC' })).getTime()
  const today = new Date(startOfToday.getTime() - offset)
  const days = (n: number) => new Date(today.getTime() - n * 864e5)
  const ranges: Record<string, () => Range> = {
    today: () => ({ key: 'today', label: 'Heute', from: today, to: now, prevFrom: days(1), bucket: 'hour' }),
    yesterday: () => ({ key: 'yesterday', label: 'Gestern', from: days(1), to: today, prevFrom: days(2), bucket: 'hour' }),
    '7d': () => ({ key: '7d', label: '7 Tage', from: days(6), to: now, prevFrom: days(13), bucket: 'day' }),
    '30d': () => ({ key: '30d', label: '30 Tage', from: days(29), to: now, prevFrom: days(59), bucket: 'day' }),
    '90d': () => ({ key: '90d', label: '90 Tage', from: days(89), to: now, prevFrom: days(179), bucket: 'day' }),
    '12m': () => ({ key: '12m', label: '12 Monate', from: days(364), to: now, prevFrom: days(729), bucket: 'month' }),
  }
  return (ranges[key ?? ''] ?? ranges['7d'])()
}
export const rangeKeys = ['today', 'yesterday', '7d', '30d', '90d', '12m'] as const

export type Totals = { visitors: number; pageviews: number; clicks: number; avgDuration: number; bounceRate: number }

async function totals(from: Date, to: Date): Promise<Totals> {
  const [r] = await sql!`
    with pv as (select visitor, duration from analytics_events where type = 'pageview' and ts >= ${from} and ts < ${to}),
         per as (select visitor, count(*)::int as n from pv group by visitor)
    select
      (select count(*)::int from per) as visitors,
      (select count(*)::int from pv) as pageviews,
      (select count(*)::int from analytics_events where type = 'click' and ts >= ${from} and ts < ${to}) as clicks,
      (select coalesce(round(avg(duration))::int, 0) from pv where duration > 0) as avg_duration,
      (select coalesce(round(100.0 * count(*) filter (where n = 1) / nullif(count(*), 0))::int, 0) from per) as bounce`
  return { visitors: r.visitors, pageviews: r.pageviews, clicks: r.clicks, avgDuration: r.avg_duration, bounceRate: r.bounce }
}

export type Point = { t: string; visitors: number; pageviews: number }

async function series(range: Range): Promise<Point[]> {
  const unit = range.bucket
  const fmt = unit === 'hour' ? 'HH24:00' : unit === 'day' ? 'YYYY-MM-DD' : 'YYYY-MM'
  const step = unit === 'hour' ? '1 hour' : unit === 'day' ? '1 day' : '1 month'
  const rows = await sql!.query(
    `with b as (
       select generate_series(date_trunc($1, $2::timestamptz at time zone '${TZ}'), date_trunc($1, $3::timestamptz at time zone '${TZ}'), $4::interval) as t
     ), e as (
       select date_trunc($1, ts at time zone '${TZ}') as t, count(distinct visitor)::int as visitors, count(*)::int as pageviews
       from analytics_events where type = 'pageview' and ts >= $2 and ts < $3 group by 1
     )
     select to_char(b.t, '${fmt}') as t, coalesce(e.visitors, 0) as visitors, coalesce(e.pageviews, 0) as pageviews
     from b left join e on e.t = b.t order by b.t`,
    [unit, range.from, range.to, step],
  )
  return rows as Point[]
}

export type Row = { key: string; visitors: number; count: number }

async function breakdown(column: string, range: Range, opts: { type?: string; limit?: number; where?: string } = {}): Promise<Row[]> {
  const rows = await sql!.query(
    `select coalesce(nullif(${column}, ''), '–') as key, count(distinct visitor)::int as visitors, count(*)::int as count
     from analytics_events where type = $1 and ts >= $2 and ts < $3 ${opts.where ?? ''}
     group by 1 order by visitors desc, count desc limit ${opts.limit ?? 10}`,
    [opts.type ?? 'pageview', range.from, range.to],
  )
  return rows as Row[]
}

export async function getStats(range: Range) {
  const [now, prev, points, pages, referrers, countries, cities, devices, browsers, os, langs, campaigns, entry, clicks] = await Promise.all([
    totals(range.from, range.to),
    totals(range.prevFrom, range.from),
    series(range),
    breakdown('path', range),
    breakdown("coalesce(referrer, 'Direkt / unbekannt')", range),
    breakdown('country', range, { limit: 15 }),
    breakdown("concat_ws(', ', city, country)", range, { where: 'and city is not null', limit: 15 }),
    breakdown('device', range),
    breakdown('browser', range),
    breakdown('os', range),
    breakdown('lang', range),
    breakdown("concat_ws(' / ', utm_source, utm_medium, utm_campaign)", range, { where: 'and utm_source is not null' }),
    sql!.query(
      `select path as key, count(*)::int as visitors, count(*)::int as count from (
         select distinct on (visitor) visitor, path from analytics_events
         where type = 'pageview' and ts >= $1 and ts < $2 order by visitor, ts) s
       group by path order by 2 desc limit 10`,
      [range.from, range.to],
    ) as Promise<Row[]>,
    getClicks(range, 8),
  ])
  return { now, prev, points, pages, referrers, countries, cities, devices, browsers, os, langs, campaigns, entry, clicks }
}

export type ClickRow = { target: string; label: string | null; external: boolean; clicks: number; visitors: number; pages: string[]; countries: string[] }

export async function getClicks(range: Range, limit = 100, onlyExternal = false): Promise<ClickRow[]> {
  return (await sql!.query(
    `select target, (array_agg(label order by ts desc) filter (where label is not null))[1] as label, bool_or(coalesce(external, false)) as external,
       count(*)::int as clicks, count(distinct visitor)::int as visitors,
       (array_agg(distinct path))[1:5] as pages,
       (array_agg(distinct country) filter (where country is not null))[1:6] as countries
     from analytics_events where type = 'click' and ts >= $1 and ts < $2 ${onlyExternal ? 'and external' : ''}
     group by target order by clicks desc limit ${limit}`,
    [range.from, range.to],
  )) as ClickRow[]
}

export async function getClickDetail(target: string, range: Range) {
  const by = async (column: string) =>
    (await sql!.query(
      `select coalesce(nullif(${column}, ''), '–') as key, count(distinct visitor)::int as visitors, count(*)::int as count
       from analytics_events where type = 'click' and target = $1 and ts >= $2 and ts < $3 group by 1 order by count desc limit 15`,
      [target, range.from, range.to],
    )) as Row[]
  const [pages, referrers, countries, cities, devices, browsers, recent] = await Promise.all([
    by('path'),
    by("coalesce(referrer, 'Direkt / unbekannt')"),
    by('country'),
    by("concat_ws(', ', city, country)"),
    by('device'),
    by('browser'),
    sql!.query(
      `select ts, path, country, city, device, browser, os, referrer, label from analytics_events
       where type = 'click' and target = $1 and ts >= $2 and ts < $3 order by ts desc limit 50`,
      [target, range.from, range.to],
    ),
  ])
  return { pages, referrers, countries, cities, devices, browsers, recent }
}

export type LiveVisitor = { visitor: string; path: string; country: string | null; city: string | null; device: string | null; browser: string | null; os: string | null; referrer: string | null; first_seen: string; last_seen: string; pages: number }

export async function getLive(): Promise<{ visitors: LiveVisitor[]; last30: number; recent: Record<string, unknown>[] }> {
  if (!sql) return { visitors: [], last30: 0, recent: [] }
  const [visitors, [{ n }], recent] = await Promise.all([
    sql`select l.*, (select count(*)::int from analytics_events e where e.visitor = l.visitor and e.type = 'pageview' and e.ts > l.first_seen - interval '1 minute') as pages
        from analytics_live l where last_seen > now() - interval '90 seconds' order by last_seen desc limit 100`,
    sql`select count(distinct visitor)::int as n from analytics_events where ts > now() - interval '30 minutes'`,
    sql`select ts, type, path, target, label, country, city, device, browser, os, referrer from analytics_events order by ts desc limit 40`,
  ])
  return { visitors: visitors as LiveVisitor[], last30: n, recent }
}
