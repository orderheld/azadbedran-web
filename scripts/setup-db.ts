// Legt die Tabellen an und füllt sie einmalig mit den Startdaten.
// Aufruf: DATABASE_URL=... npm run db:setup   (Neon oder ein lokales Postgres)
// Alternativ im Admin-Bereich: Einstellungen → „Datenbank einrichten“.
import { neon } from '@neondatabase/serverless'
import pg from 'pg'
import { setupDatabase, type Query } from '../lib/db-setup'

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL fehlt')
  let q: Query
  let end = async () => {}
  if (/@(localhost|127\.0\.0\.1|postgres)(:\d+)?\//.test(url)) {
    const pool = new pg.Pool({ connectionString: url })
    q = async (text, params) => (await pool.query(text, params)).rows
    end = () => pool.end()
  } else {
    const sql = neon(url)
    q = (text, params) => sql.query(text, params) as ReturnType<Query>
  }
  await setupDatabase(q, console.log)
  await end()
  console.log('Fertig.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
