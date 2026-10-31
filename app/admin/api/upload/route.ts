import { isAdmin } from '@/lib/admin/session'
import { mediaUrl } from '@/lib/admin/data'
import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
const MAX = 4 * 1024 * 1024 // Vercel erlaubt max. 4,5 MB pro Anfrage

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: 'Nicht angemeldet' }, { status: 401 })
  if (!sql) return Response.json({ error: 'Keine Datenbank verbunden' }, { status: 503 })
  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return Response.json({ error: 'Keine Datei' }, { status: 400 })
  if (!allowed.has(file.type)) return Response.json({ error: 'Nur JPG, PNG, WebP, GIF oder AVIF' }, { status: 400 })
  if (file.size > MAX) return Response.json({ error: 'Datei zu groß (max. 4 MB)' }, { status: 413 })
  const name = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+/, '').slice(-80) || 'bild.jpg'
  const width = Number(form.get('width')) || null
  const height = Number(form.get('height')) || null
  const data = `\\x${Buffer.from(await file.arrayBuffer()).toString("hex")}` // Hex-Format, funktioniert mit Neon und Postgres
  const [row] = await sql`insert into media (name, mime, width, height, size, data) values (${name}, ${file.type}, ${width}, ${height}, ${file.size}, ${data}::bytea) returning id`
  return Response.json({ url: mediaUrl(row.id, name), id: row.id })
}
