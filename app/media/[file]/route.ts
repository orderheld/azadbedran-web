import { sql } from '@/lib/db'

// Hochgeladene Bilder aus der Datenbank ausliefern: /media/12-name.jpg
// Inhalte ändern sich nie (neues Bild = neue ID), daher lange cachebar.
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  const id = Number(file.split('-')[0])
  if (!sql || !Number.isInteger(id)) return new Response('Not found', { status: 404 })
  const [row] = await sql`select mime, data from media where id = ${id}`
  if (!row) return new Response('Not found', { status: 404 })
  const data = typeof row.data === 'string' ? Buffer.from(row.data.replace(/^\\x/, ''), 'hex') : Buffer.from(row.data)
  return new Response(data, {
    headers: {
      'Content-Type': row.mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
