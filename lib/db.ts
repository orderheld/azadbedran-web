import 'server-only'
import { neon } from '@neondatabase/serverless'

// Einheitlicher Datenbankzugang: Neon (Produktion, HTTP) oder ein normales Postgres
// (z. B. lokal: DATABASE_URL=postgres://postgres@localhost/azad). Beide liefern Zeilen als Array.
type Row = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
export type Sql = {
  (strings: TemplateStringsArray, ...values: unknown[]): Promise<Row[]>
  query: (text: string, params?: unknown[]) => Promise<Row[]>
}

const url = process.env.DATABASE_URL
const isLocal = !!url && /@(localhost|127\.0\.0\.1|postgres)(:\d+)?\//.test(url)

function localSql(connectionString: string): Sql {
  let pool: Promise<import('pg').Pool> | null = null
  const getPool = () =>
    (pool ??= import('pg').then(({ default: pg }) => {
      pg.types.setTypeParser(1082, (v: string) => v) // date als 'YYYY-MM-DD'
      pg.types.setTypeParser(20, (v: string) => Number(v)) // bigint/count als Zahl
      return new pg.Pool({ connectionString, max: 5 })
    }))
  const query = async (text: string, params: unknown[] = []) => (await (await getPool()).query(text, params)).rows
  const tag = (strings: TemplateStringsArray, ...values: unknown[]) =>
    query(strings.reduce((acc, s, i) => acc + `$${i}` + s), values)
  return Object.assign(tag, { query })
}

function neonSql(connectionString: string): Sql {
  const n = neon(connectionString)
  const tag = (strings: TemplateStringsArray, ...values: unknown[]) => n(strings, ...values) as Promise<Row[]>
  return Object.assign(tag, { query: (text: string, params: unknown[] = []) => n.query(text, params) as Promise<Row[]> })
}

export const sql: Sql | null = url ? (isLocal ? localSql(url) : neonSql(url)) : null
export const hasDb = () => sql !== null

// Sind die Tabellen schon angelegt? (für den Hinweis im Admin-Bereich)
export async function dbReady() {
  if (!sql) return false
  try {
    const [r] = await sql`select to_regclass('public.analytics_live') is not null and to_regclass('public.texts') is not null as ok`
    return !!r.ok
  } catch {
    return false
  }
}
