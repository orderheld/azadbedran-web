import 'server-only'
import { neon } from '@neondatabase/serverless'
import { site } from './site'
import { seedConcerts, seedNews, seedReleases, type Concert, type NewsItem, type Release } from './seed'

const showDemo = process.env.SHOW_DEMO_CONTENT === '1'
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
        select id, date, time, city, venue, country, ticket_url, sold_out
        from concerts where published order by date desc`
      all = rows.map((r) => ({
        id: r.id,
        date: toIso(r.date),
        time: r.time ? String(r.time).slice(0, 5) : null,
        city: r.city,
        venue: r.venue,
        country: r.country,
        ticketUrl: r.ticket_url,
        soldOut: r.sold_out,
      }))
    } catch (e) {
      console.error('[content] concerts: falling back to seed data', e)
    }
  }
  if (!showDemo) all = all.filter((c) => !c.demo)

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
        select id, date, title_ku, title_tr, title_en, body_ku, body_tr, body_en, image_url, link_url
        from news where published order by date desc limit ${limit}`
      items = rows.map((r) => ({
        id: r.id,
        date: toIso(r.date),
        title: { ku: r.title_ku, tr: r.title_tr, en: r.title_en },
        body: { ku: r.body_ku, tr: r.body_tr, en: r.body_en },
        image: r.image_url,
        link: r.link_url,
      }))
    } catch (e) {
      console.error('[content] news: falling back to seed data', e)
    }
  }
  if (!showDemo) items = items.filter((n) => !n.demo)
  return items.slice(0, limit)
}

type DeezerAlbum = { id: number; title: string; link: string; cover_xl: string; release_date: string; record_type: string; nb_tracks?: number }
type ItunesAlbum = { wrapperType: string; collectionName: string; collectionViewUrl: string; artworkUrl100: string; releaseDate: string; trackCount: number }

const normalize = (s: string) => s.toLocaleLowerCase('tr').replace(/\s*-\s*(single|ep)$/i, '').replace(/[^\p{L}\p{N}]+/gu, '')
const seedByTitle = () => new Map(seedReleases.map((r) => [normalize(r.title), r]))

function inferType(title: string, platformType: string, trackCount?: number): Release['type'] {
  if (/\(live\)/i.test(title)) return 'live'
  if (/album/i.test(platformType) || (trackCount ?? 0) >= 7) return 'album'
  if (/ep/i.test(platformType)) return 'ep'
  return 'single'
}

// Diskografie mit Original-Covern direkt von den Plattformen:
// 1. Deezer (Cover 1000 px), 2. Apple Music / iTunes (Cover 1200 px), 3. Startdaten aus lib/seed.ts
export async function getReleases(): Promise<Release[]> {
  return (await fromDeezer()) ?? (await fromItunes()) ?? seedReleases
}

async function fromDeezer(): Promise<Release[] | null> {
  try {
    const res = await fetch(`https://api.deezer.com/artist/${site.deezerArtistId}/albums?limit=100`, {
      next: { revalidate: 60 * 60 * 6 },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = (await res.json()) as { data?: DeezerAlbum[] }
    if (!json.data?.length) throw new Error('empty')
    const seeds = seedByTitle()
    return json.data
      .map((a): Release => {
        const seed = seeds.get(normalize(a.title))
        return {
          title: a.title,
          date: a.release_date,
          type: seed?.type ?? inferType(a.title, a.record_type, a.nb_tracks),
          tracks: seed?.tracks ?? a.nb_tracks ?? null,
          cover: a.cover_xl,
          link: a.link,
          feat: seed?.feat,
        }
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  } catch (e) {
    console.warn('[content] Deezer releases unavailable:', (e as Error).message)
    return null
  }
}

async function fromItunes(): Promise<Release[] | null> {
  try {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${site.appleArtistId}&entity=album&limit=200`, {
      next: { revalidate: 60 * 60 * 6 },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = (await res.json()) as { results?: ItunesAlbum[] }
    const albums = (json.results ?? []).filter((r) => r.wrapperType === 'collection')
    if (!albums.length) throw new Error('empty')
    const seeds = seedByTitle()
    return albums
      .map((a): Release => {
        const title = a.collectionName.replace(/\s*-\s*(Single|EP)$/i, '')
        const seed = seeds.get(normalize(title))
        return {
          title,
          date: a.releaseDate.slice(0, 10),
          type: seed?.type ?? inferType(a.collectionName, /- EP$/i.test(a.collectionName) ? 'ep' : '', a.trackCount),
          tracks: seed?.tracks ?? a.trackCount,
          cover: a.artworkUrl100.replace(/\/\d+x\d+bb\./, '/1200x1200bb.'),
          link: a.collectionViewUrl,
          feat: seed?.feat,
        }
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  } catch (e) {
    console.warn('[content] iTunes releases unavailable:', (e as Error).message)
    return null
  }
}

export async function getArtistImage(): Promise<string | null> {
  try {
    const res = await fetch(`https://api.deezer.com/artist/${site.deezerArtistId}`, {
      next: { revalidate: 60 * 60 * 24 },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    const json = (await res.json()) as { picture_xl?: string }
    // Deezer liefert für Künstler ohne Bild ein Standard-Silhouettenbild
    if (!json.picture_xl || json.picture_xl.includes('/artist//')) return null
    return json.picture_xl
  } catch {
    return null
  }
}

export async function getNewsItem(id: number): Promise<NewsItem | null> {
  const all = await getNews(200)
  return all.find((n) => n.id === id) ?? null
}
