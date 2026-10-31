import 'server-only'
import { sql } from '../db'
import { seedConcerts, seedNews } from '../seed'
import { curatedVideos } from '../curated-videos'
import { gallery as staticGallery } from '../site'

// Lesen für den Admin-Bereich: inkl. unveröffentlichter Einträge. Ohne Datenbank: Startdaten.
const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : v == null ? '' : String(v)).slice(0, 10)

export type AdminConcert = { id: number; date: string; time: string | null; city: string; venue: string | null; address: string | null; country: string; ticket_url: string | null; phone: string | null; poster_url: string | null; sold_out: boolean; published: boolean }
export type AdminNews = { id: number; date: string; image_url: string | null; link_url: string | null; published: boolean } & Record<`title_${'ku' | 'tr' | 'en' | 'ru'}` | `body_${'ku' | 'tr' | 'en' | 'ru'}`, string | null>
export type AdminVideo = { id: number; youtube_id: string; title: string; date: string | null; live: boolean; published: boolean }
export type AdminGallery = { id: number; src: string; width: number; height: number; alt: string | null; sort: number; published: boolean }

export async function adminConcerts(): Promise<AdminConcert[]> {
  if (!sql) return seedConcerts.map((c) => ({ id: c.id, date: c.date, time: c.time, city: c.city, venue: c.venue, address: c.address, country: c.country, ticket_url: c.ticketUrl, phone: c.phone, poster_url: c.poster, sold_out: c.soldOut, published: true })).sort((a, b) => b.date.localeCompare(a.date))
  const rows = await sql`select * from concerts order by date desc`
  return rows.map((r) => ({ ...r, date: iso(r.date), time: r.time ? String(r.time).slice(0, 5) : null })) as AdminConcert[]
}

export async function adminConcert(id: number) {
  return (await adminConcerts()).find((c) => c.id === id) ?? null
}

export async function adminNews(): Promise<AdminNews[]> {
  if (!sql)
    return seedNews.map((n) => ({ id: n.id, date: n.date, image_url: n.image, link_url: n.link, published: true, title_ku: n.title.ku, title_tr: n.title.tr, title_en: n.title.en, title_ru: n.title.ru, body_ku: n.body.ku, body_tr: n.body.tr, body_en: n.body.en, body_ru: n.body.ru })).sort((a, b) => b.date.localeCompare(a.date))
  const rows = await sql`select * from news order by date desc, id desc`
  return rows.map((r) => ({ ...r, date: iso(r.date) })) as AdminNews[]
}

export async function adminVideos(): Promise<AdminVideo[]> {
  if (!sql) return curatedVideos.map((v, i) => ({ id: i + 1, youtube_id: v.id, title: v.title, date: v.date, live: !!v.live, published: true }))
  const rows = await sql`select * from videos order by date desc nulls last, id desc`
  return rows.map((r) => ({ ...r, date: r.date ? iso(r.date) : null })) as AdminVideo[]
}

export async function adminGallery(): Promise<AdminGallery[]> {
  if (!sql) return staticGallery.map((g, i) => ({ id: i + 1, src: g.src, width: g.w, height: g.h, alt: null, sort: i, published: true }))
  return (await sql`select * from gallery order by sort, id`) as AdminGallery[]
}

export async function adminMedia() {
  if (!sql) return []
  return sql`select id, name, mime, width, height, size, created_at from media order by created_at desc`
}

export const mediaUrl = (id: number, name: string) => `/media/${id}-${name}`
