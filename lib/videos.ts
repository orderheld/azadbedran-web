import 'server-only'
import { curatedVideos, type CuratedVideo } from './curated-videos'
import { sql } from './db'

export type Video = { id: string; title: string; date: string | null; views: number | null }

const CHANNEL_ID = 'UCGd0Bur3OfTZibdHr_o26Zg' // youtube.com/@Azadbedranoffical („Azad Bedran resmî hesap“)


// Videoliste aus dem Admin-Bereich (Tabelle videos), sonst die geprüfte Liste aus lib/curated-videos.ts
async function getCurated(): Promise<{ list: CuratedVideo[]; hidden: Set<string> }> {
  if (sql) {
    try {
      const rows = await sql`select youtube_id, title, date, live, published from videos order by date desc nulls last, id desc`
      if (rows.length) {
        const list = rows.filter((r) => r.published).map((r) => ({ id: r.youtube_id, title: r.title, date: r.date ? (r.date instanceof Date ? r.date.toISOString() : String(r.date)).slice(0, 10) : null, views: null, live: r.live }))
        return { list, hidden: new Set(rows.filter((r) => !r.published).map((r) => r.youtube_id)) }
      }
    } catch (e) {
      console.error('[videos] database unavailable, using built-in list', e)
    }
  }
  return { list: curatedVideos, hidden: new Set() }
}

const decode = (s: string) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')

// Shorts sind hochkant und passen nicht ins 16:9-Raster: /shorts/<id> antwortet nur bei Shorts mit 200.
async function isShort(id: string) {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${id}`, { method: 'HEAD', redirect: 'manual', next: { revalidate: 60 * 60 * 24 * 7 }, signal: AbortSignal.timeout(4000) })
    return res.status === 200
  } catch {
    return false
  }
}

export const cleanTitle = (t: string) =>
  t.replace(/^azad\s+bedran\s*[-–|:]\s*/i, '').replace(/\s*[-–|]\s*azad\s+bedran$/i, '').replace(/\s*#\S+/g, '').trim()

// Neueste Videos direkt vom offiziellen Kanal (RSS, max. 15), ohne Shorts
export async function getVideos(): Promise<{ videos: Video[]; live: boolean; liveIds: Set<string> }> {
  const { list: curated, hidden } = await getCurated()
  const liveIds = new Set(curated.filter((v) => v.live).map((v) => v.id))
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`, { next: { revalidate: 60 * 60 * 3 }, signal: AbortSignal.timeout(6000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const xml = await res.text()
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
      id: e.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1] ?? '',
      title: cleanTitle(decode(e.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '')),
      date: e.match(/<published>([^<]+)<\/published>/)?.[1]?.slice(0, 10) ?? null,
      views: Number(e.match(/views="(\d+)"/)?.[1] ?? NaN) || null,
    }))
    const shorts = await Promise.all(entries.map((v) => isShort(v.id)))
    const videos = entries.filter((v, i) => v.id && !shorts[i] && !hidden.has(v.id))
    if (!videos.length) throw new Error('empty feed')
    const ids = new Set(videos.map((v) => v.id))
    return { videos: [...videos, ...curated.filter((v) => !ids.has(v.id))].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')), live: true, liveIds }
  } catch (e) {
    console.warn('[videos] channel feed unavailable:', (e as Error).message)
    return { videos: curated, live: false, liveIds }
  }
}

export const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
