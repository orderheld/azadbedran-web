'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { sql } from '@/lib/db'
import { requireAdmin } from '@/lib/admin/session'
import { ADMIN_COOKIE, SESSION_DAYS, checkAdminPassword, createSessionToken } from '@/lib/admin/token'
import { locales, getDict, isLocale } from '@/lib/i18n'
import { flatten } from '@/lib/admin/texts'
import { setupDatabase } from '@/lib/db-setup'

// ---------- Hilfen ----------

const str = (f: FormData, k: string) => {
  const v = String(f.get(k) ?? '').trim()
  return v === '' ? null : v
}
const req = (f: FormData, k: string, label: string) => {
  const v = str(f, k)
  if (!v) throw new Error(`${label} fehlt`)
  return v
}
const bool = (f: FormData, k: string) => f.get(k) === 'on' || f.get(k) === 'true'
const num = (f: FormData, k: string) => {
  const n = Number(f.get(k))
  return Number.isFinite(n) ? n : null
}

function db() {
  if (!sql) throw new Error('Keine Datenbank verbunden (DATABASE_URL fehlt).')
  return sql
}

// Website sofort aktualisieren
function refresh() {
  revalidatePath('/', 'layout')
}

function done(path: string, msg = 'Gespeichert'): never {
  refresh()
  redirect(`${path}${path.includes('?') ? '&' : '?'}ok=${encodeURIComponent(msg)}`)
}

// ---------- Anmeldung ----------

export async function login(form: FormData) {
  const ok = await checkAdminPassword(String(form.get('password') ?? ''))
  if (!ok) {
    await new Promise((r) => setTimeout(r, 1200)) // bremst Passwort-Raten
    redirect('/admin/login?error=1')
  }
  ;(await cookies()).set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 86400,
  })
  redirect('/admin')
}

export async function logout() {
  ;(await cookies()).delete(ADMIN_COOKIE)
  redirect('/admin/login')
}

// ---------- Konzerte ----------

export async function saveConcert(form: FormData) {
  await requireAdmin()
  const s = db()
  const id = num(form, 'id')
  const v = {
    date: req(form, 'date', 'Datum'),
    time: str(form, 'time'),
    city: req(form, 'city', 'Stadt'),
    venue: str(form, 'venue'),
    address: str(form, 'address'),
    country: (str(form, 'country') ?? 'TR').toUpperCase().slice(0, 2),
    ticket: str(form, 'ticket_url'),
    phone: str(form, 'phone'),
    poster: str(form, 'poster_url'),
    soldOut: bool(form, 'sold_out'),
    published: bool(form, 'published'),
  }
  if (id) {
    await s`update concerts set date = ${v.date}, time = ${v.time}, city = ${v.city}, venue = ${v.venue}, address = ${v.address}, country = ${v.country},
      ticket_url = ${v.ticket}, phone = ${v.phone}, poster_url = ${v.poster}, sold_out = ${v.soldOut}, published = ${v.published} where id = ${id}`
  } else {
    await s`insert into concerts (date, time, city, venue, address, country, ticket_url, phone, poster_url, sold_out, published)
      values (${v.date}, ${v.time}, ${v.city}, ${v.venue}, ${v.address}, ${v.country}, ${v.ticket}, ${v.phone}, ${v.poster}, ${v.soldOut}, ${v.published})`
  }
  done('/admin/konzerte', id ? 'Konzert gespeichert' : 'Konzert angelegt')
}

export async function deleteConcert(form: FormData) {
  await requireAdmin()
  await db()`delete from concerts where id = ${num(form, 'id')}`
  done('/admin/konzerte', 'Konzert gelöscht')
}

// ---------- News ----------

export async function saveNews(form: FormData) {
  await requireAdmin()
  const s = db()
  const id = num(form, 'id')
  const t = Object.fromEntries(locales.map((l) => [l, str(form, `title_${l}`)])) as Record<string, string | null>
  const b = Object.fromEntries(locales.map((l) => [l, str(form, `body_${l}`) ?? ''])) as Record<string, string>
  if (!t.ku) throw new Error('Titel (Kurmancî) fehlt')
  // Fehlende Sprachen fallen auf Englisch bzw. Kurmancî zurück, damit nie eine leere Seite erscheint
  const title = (l: string) => t[l] ?? t.en ?? t.ku!
  const body = (l: string) => b[l] || b.en || b.ku
  const date = str(form, 'date') ?? new Date().toISOString().slice(0, 10)
  const image = str(form, 'image_url')
  const link = str(form, 'link_url')
  const published = bool(form, 'published')
  if (id) {
    await s`update news set date = ${date}, title_ku = ${title('ku')}, title_tr = ${title('tr')}, title_en = ${title('en')}, title_ru = ${title('ru')},
      body_ku = ${body('ku')}, body_tr = ${body('tr')}, body_en = ${body('en')}, body_ru = ${body('ru')}, image_url = ${image}, link_url = ${link}, published = ${published} where id = ${id}`
  } else {
    await s`insert into news (date, title_ku, title_tr, title_en, title_ru, body_ku, body_tr, body_en, body_ru, image_url, link_url, published)
      values (${date}, ${title('ku')}, ${title('tr')}, ${title('en')}, ${title('ru')}, ${body('ku')}, ${body('tr')}, ${body('en')}, ${body('ru')}, ${image}, ${link}, ${published})`
  }
  done('/admin/news', id ? 'Beitrag gespeichert' : 'Beitrag veröffentlicht')
}

export async function deleteNews(form: FormData) {
  await requireAdmin()
  await db()`delete from news where id = ${num(form, 'id')}`
  done('/admin/news', 'Beitrag gelöscht')
}

// ---------- Musik ----------

export async function setReleaseHidden(form: FormData) {
  await requireAdmin()
  const id = num(form, 'id')
  const hidden = bool(form, 'hidden')
  await db()`insert into release_overrides (apple_id, hidden) values (${id}, ${hidden})
    on conflict (apple_id) do update set hidden = excluded.hidden, updated_at = now()`
  done('/admin/musik', hidden ? 'Ausgeblendet' : 'Wieder sichtbar')
}

// ---------- Videos ----------

export async function youtubeId(input: string) {
  const m = input.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/) ?? input.match(/^([\w-]{11})$/)
  return m?.[1] ?? null
}

export async function saveVideo(form: FormData) {
  await requireAdmin()
  const s = db()
  const id = num(form, 'id')
  const yt = await youtubeId(req(form, 'youtube', 'YouTube-Link'))
  if (!yt) throw new Error('Kein gültiger YouTube-Link')
  const title = req(form, 'title', 'Titel')
  const date = str(form, 'date')
  const live = bool(form, 'live')
  const published = id ? bool(form, 'published') : true
  if (id) await s`update videos set youtube_id = ${yt}, title = ${title}, date = ${date}, live = ${live}, published = ${published} where id = ${id}`
  else
    await s`insert into videos (youtube_id, title, date, live) values (${yt}, ${title}, ${date}, ${live})
      on conflict (youtube_id) do update set title = excluded.title, date = excluded.date, live = excluded.live, published = true`
  done('/admin/videos', id ? 'Video gespeichert' : 'Video hinzugefügt')
}

export async function deleteVideo(form: FormData) {
  await requireAdmin()
  // Nicht löschen, sondern ausblenden: sonst taucht ein Video aus dem YouTube-Feed wieder auf
  await db()`update videos set published = false where id = ${num(form, 'id')}`
  done('/admin/videos', 'Video ausgeblendet')
}

// ---------- Galerie ----------

// Vom Uploader aufgerufen (ohne Weiterleitung, damit mehrere Bilder nacheinander gehen)
export async function addUploadedToGallery(form: FormData) {
  await requireAdmin()
  const src = req(form, 'src', 'Bild')
  await db()`insert into gallery (src, width, height, sort) values (${src}, ${num(form, 'width') || 1200}, ${num(form, 'height') || 800}, (select coalesce(max(sort), 0) + 1 from gallery))`
  refresh()
}

export async function saveGalleryItem(form: FormData) {
  await requireAdmin()
  await db()`update gallery set alt = ${str(form, 'alt')}, published = ${bool(form, 'published')} where id = ${num(form, 'id')}`
  done('/admin/galerie')
}

export async function moveGalleryItem(form: FormData) {
  await requireAdmin()
  const s = db()
  const id = num(form, 'id')
  const dir = form.get('dir') === 'up' ? -1 : 1
  const rows = await s`select id from gallery order by sort, id`
  const ids = rows.map((r) => r.id as number)
  const i = ids.indexOf(id!)
  const j = i + dir
  if (i >= 0 && j >= 0 && j < ids.length) {
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
    await s.query(`update gallery set sort = v.sort from (select unnest($1::int[]) as id, generate_series(1, $2) as sort) v where gallery.id = v.id`, [ids, ids.length])
  }
  done('/admin/galerie', 'Reihenfolge geändert')
}

export async function deleteGalleryItem(form: FormData) {
  await requireAdmin()
  await db()`delete from gallery where id = ${num(form, 'id')}`
  done('/admin/galerie', 'Foto entfernt')
}

// ---------- Texte ----------

export async function saveTexts(form: FormData) {
  await requireAdmin()
  const s = db()
  const lang = String(form.get('lang'))
  const section = String(form.get('section') ?? '')
  if (!isLocale(lang)) throw new Error('Unbekannte Sprache')
  const defaults = flatten(getDict(lang))
  for (const [k, raw] of form.entries()) {
    if (!k.startsWith('t:')) continue
    const key = k.slice(2)
    if (!(key in defaults)) continue
    const value = String(raw).replace(/\r\n/g, '\n').trim()
    if (!value || value === defaults[key]) await s`delete from texts where lang = ${lang} and key = ${key}`
    else
      await s`insert into texts (lang, key, value) values (${lang}, ${key}, ${value})
        on conflict (lang, key) do update set value = excluded.value, updated_at = now()`
  }
  done(`/admin/texte?lang=${lang}&section=${section}`, 'Texte gespeichert')
}

export async function resetText(form: FormData) {
  await requireAdmin()
  const lang = String(form.get('lang'))
  await db()`delete from texts where lang = ${lang} and key = ${String(form.get('key'))}`
  done(`/admin/texte?lang=${lang}&section=${String(form.get('section') ?? '')}`, 'Originaltext wiederhergestellt')
}

// ---------- Medien ----------

export async function deleteMedia(form: FormData) {
  await requireAdmin()
  await db()`delete from media where id = ${num(form, 'id')}`
  done('/admin/medien', 'Datei gelöscht')
}

// ---------- Statistik ----------

export async function resetStats(form: FormData) {
  await requireAdmin()
  if (form.get('confirm') !== 'LÖSCHEN') throw new Error('Zur Bestätigung LÖSCHEN eingeben')
  const s = db()
  await s`delete from analytics_events`
  await s`delete from analytics_live`
  done('/admin/einstellungen', 'Statistik zurückgesetzt')
}

// ---------- Datenbank einrichten (Tabellen + Startdaten, kann gefahrlos wiederholt werden) ----------

export async function setupDb() {
  await requireAdmin()
  await setupDatabase(db().query)
  done('/admin', 'Datenbank eingerichtet')
}
