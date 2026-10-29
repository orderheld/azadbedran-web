import 'server-only'
import { neon } from '@neondatabase/serverless'
import { seedConcerts, seedNews, type Concert, type NewsItem } from './seed'

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null

const toIso = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10))

function todayInIstanbul() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(new Date())
}

export async function getConcerts(): Promise<{ upcoming: Concert[]; past: Concert[] }> {
  let all: Concert[] = seedConcerts
  if (sql) {
    try {
      const rows = await sql`
        select id, date, time, city, venue, address, country, ticket_url, phone, poster_url, sold_out
        from concerts where published order by date desc`
      all = rows.map((r) => ({
        id: r.id,
        date: toIso(r.date),
        time: r.time ? String(r.time).slice(0, 5) : null,
        city: r.city,
        venue: r.venue,
        address: r.address,
        country: r.country,
        ticketUrl: r.ticket_url,
        phone: r.phone,
        poster: r.poster_url,
        soldOut: r.sold_out,
      }))
    } catch (e) {
      console.error('[content] concerts: falling back to seed data', e)
    }
  }
  const today = todayInIstanbul()
  const upcoming = all.filter((c) => c.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  const past = all.filter((c) => c.date < today).sort((a, b) => b.date.localeCompare(a.date))
  return { upcoming, past }
}

export async function getNews(limit = 6): Promise<NewsItem[]> {
  let items: NewsItem[] = seedNews
  if (sql) {
    try {
      const rows = await sql`
        select id, date, title_ku, title_tr, title_en, title_ru, body_ku, body_tr, body_en, body_ru, image_url, link_url
        from news where published order by date desc limit ${limit}`
      items = rows.map((r) => ({
        id: r.id,
        date: toIso(r.date),
        title: { ku: r.title_ku, tr: r.title_tr, en: r.title_en, ru: r.title_ru || r.title_en },
        body: { ku: r.body_ku, tr: r.body_tr, en: r.body_en, ru: r.body_ru || r.body_en },
        image: r.image_url,
        link: r.link_url,
      }))
    } catch (e) {
      console.error('[content] news: falling back to seed data', e)
    }
  }
  return [...items].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit)
}

export async function getNewsItem(id: number): Promise<NewsItem | null> {
  const all = await getNews(200)
  return all.find((n) => n.id === id) ?? null
}
