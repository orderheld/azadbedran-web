// Legt die Tabellen in Neon an und füllt sie einmalig mit den Startdaten.
// Aufruf: DATABASE_URL=... npm run db:setup
import { readFileSync } from 'node:fs'
import { neon } from '@neondatabase/serverless'
import { seedConcerts, seedNews } from '../lib/seed'

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL fehlt')
  const sql = neon(url)

  const schema = readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8')
  for (const stmt of schema.split(';').map((s) => s.trim()).filter(Boolean)) {
    await sql.query(stmt)
  }

  const [{ count: concertCount }] = await sql`select count(*)::int as count from concerts`
  if (concertCount === 0) {
    for (const c of seedConcerts.filter((c) => !c.demo)) {
      await sql`insert into concerts (date, time, city, venue, country, ticket_url, sold_out)
                values (${c.date}, ${c.time}, ${c.city}, ${c.venue}, ${c.country}, ${c.ticketUrl}, ${c.soldOut})`
    }
    console.log('Konzerte eingefügt')
  }

  const [{ count: newsCount }] = await sql`select count(*)::int as count from news`
  if (newsCount === 0) {
    for (const n of seedNews.filter((n) => !n.demo)) {
      await sql`insert into news (date, title_ku, title_tr, title_en, body_ku, body_tr, body_en, image_url, link_url)
                values (${n.date}, ${n.title.ku}, ${n.title.tr}, ${n.title.en}, ${n.body.ku}, ${n.body.tr}, ${n.body.en}, ${n.image}, ${n.link})`
    }
    console.log('News eingefügt')
  }
  console.log('Fertig.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
