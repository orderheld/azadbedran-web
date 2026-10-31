import 'server-only'
import { cache } from 'react'
import { sql } from './db'
import { seedConcerts, seedNews, type Concert, type NewsItem } from './seed'
import { gallery as staticGallery } from './site'
import { getDict, type Dict, type Locale } from './i18n'

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

export type GalleryItem = { src: string; w: number; h: number; alt?: string | null }

// Galerie aus dem Admin-Bereich, sonst die freigegebenen Fotos aus lib/site.ts
export async function getGallery(): Promise<GalleryItem[]> {
  if (sql) {
    try {
      const rows = await sql`select src, width, height, alt from gallery where published order by sort, id`
      const all = await sql`select count(*)::int as n from gallery`
      if (all[0].n > 0) return rows.map((r) => ({ src: r.src, w: r.width, h: r.height, alt: r.alt }))
    } catch (e) {
      console.error('[content] gallery: falling back to static list', e)
    }
  }
  return staticGallery
}

// ---- Texte: lib/i18n.ts + Änderungen aus dem Admin-Bereich (Tabelle texts) ----

type Tree = Record<string, unknown> | unknown[]

function setPath(node: unknown, keys: string[], value: string): unknown {
  if (!keys.length) return typeof node === 'string' ? value : node
  if (node === null || typeof node !== 'object') return node
  const [k, ...rest] = keys
  if (!(k in (node as Tree))) return node
  const copy: Tree = Array.isArray(node) ? [...node] : { ...(node as Record<string, unknown>) }
  ;(copy as Record<string, unknown>)[k] = setPath((node as Record<string, unknown>)[k], rest, value)
  return copy
}

export async function getTextOverrides(lang: Locale): Promise<Record<string, string>> {
  if (!sql) return {}
  try {
    const rows = await sql`select key, value from texts where lang = ${lang}`
    return Object.fromEntries(rows.map((r) => [r.key, r.value]))
  } catch (e) {
    console.error('[content] texts: using built-in texts', e)
    return {}
  }
}

export const loadDict = cache(async (lang: Locale): Promise<Dict> => {
  let dict: unknown = getDict(lang)
  for (const [key, value] of Object.entries(await getTextOverrides(lang))) dict = setPath(dict, key.split('.'), value)
  return dict as Dict
})

export async function getHiddenReleases(): Promise<Set<number>> {
  if (!sql) return new Set()
  try {
    const rows = await sql`select apple_id from release_overrides where hidden`
    return new Set(rows.map((r) => Number(r.apple_id)))
  } catch {
    return new Set()
  }
}
