// Tabellen anlegen (idempotent) und einmalig mit Startdaten füllen.
// Wird von scripts/setup-db.ts und vom Button im Admin-Bereich benutzt.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { seedConcerts, seedNews } from './seed'
import { curatedVideos } from './curated-videos'
import { gallery } from './site'

export type Query = (text: string, params?: unknown[]) => Promise<Record<string, any>[]> // eslint-disable-line @typescript-eslint/no-explicit-any

export async function setupDatabase(q: Query, log: (m: string) => void = () => {}) {
  const schema = readFileSync(join(process.cwd(), 'db', 'schema.sql'), 'utf8').replace(/--[^\n]*/g, '')
  for (const stmt of schema.split(';').map((s) => s.trim()).filter(Boolean)) await q(stmt)

  const count = async (table: string) => (await q(`select count(*)::int as n from ${table}`))[0].n as number

  if ((await count('concerts')) === 0) {
    for (const c of seedConcerts)
      await q(`insert into concerts (id, date, time, city, venue, address, country, ticket_url, phone, poster_url, sold_out) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [c.id, c.date, c.time, c.city, c.venue, c.address, c.country, c.ticketUrl, c.phone, c.poster, c.soldOut])
    log('Konzerte eingefügt')
  }
  if ((await count('news')) === 0) {
    for (const n of seedNews)
      await q(`insert into news (id, date, title_ku, title_tr, title_en, title_ru, body_ku, body_tr, body_en, body_ru, image_url, link_url) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [n.id, n.date, n.title.ku, n.title.tr, n.title.en, n.title.ru, n.body.ku, n.body.tr, n.body.en, n.body.ru, n.image, n.link])
    log('News eingefügt')
  }
  if ((await count('videos')) === 0) {
    for (const v of curatedVideos) await q(`insert into videos (youtube_id, title, date, live) values ($1,$2,$3,$4)`, [v.id, v.title, v.date, !!v.live])
    log('Videos eingefügt')
  }
  if ((await count('gallery')) === 0) {
    for (const [i, g] of gallery.entries()) await q(`insert into gallery (src, width, height, sort) values ($1,$2,$3,$4)`, [g.src, g.w, g.h, i])
    log('Galerie eingefügt')
  }
  // Startdaten behalten ihre IDs (stabile News-Links), danach Zähler weitersetzen
  for (const t of ['concerts', 'news']) await q(`select setval(pg_get_serial_sequence('${t}', 'id'), greatest((select max(id) from ${t}), 1))`)
}
