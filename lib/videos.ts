import 'server-only'

export type Video = { id: string; title: string; date: string | null; views: number | null }

const CHANNEL_ID = 'UCGd0Bur3OfTZibdHr_o26Zg' // youtube.com/@Azadbedranoffical („Azad Bedran resmî hesap“)

// Videos vom offiziellen Kanal (geprüft am 29.10.2026: Titel, Kanal und Datum je Video-Seite)
const curated: (Video & { live?: boolean })[] = [
  { id: 'VZn3rkqh3fo', title: 'Evîna Azad (Konser)', date: '2026-02-27', views: null, live: true },
  { id: 'QjVfjl1WZSQ', title: 'Aşk Amedspor', date: '2026-02-19', views: null },
  { id: 'X3v4Kf8eqrU', title: 'Ka Berxêmin', date: '2025-10-22', views: null },
  { id: 'cnc8kazmikw', title: 'Bêhna Bihuşt', date: '2025-05-23', views: null },
  { id: 'RyvXQT1Qawk', title: 'Wayê Wayê (Amed Konser)', date: '2025-04-30', views: null, live: true },
  { id: 'S7aEHWX9S_s', title: 'Nav Bexça Dil', date: '2025-03-19', views: null },
  { id: '99FHK_kU_VI', title: 'Eva Dinya Pir Mezine (Konser)', date: '2025-02-24', views: null, live: true },
  { id: 'T1hJUjF4T8w', title: 'Çavênte Welatêmine', date: '2024-11-19', views: null },
  { id: 'rnWBZ_zcIU4', title: 'Rêwîyên Şad (Konser)', date: '2024-09-16', views: null, live: true },
  { id: 'Zi8O9otMccI', title: 'Bi Xêr Hatî', date: '2024-08-10', views: null },
  { id: '-S1OrYqfP4E', title: 'Behna Te Dikim Dayê (Konser)', date: '2023-11-04', views: null, live: true },
  { id: 'egq65dfRCE8', title: 'Wayê Wayê', date: '2022-11-24', views: null },
  { id: 'lPwpPGc5nvU', title: 'Paytexta Evînê (Albûm)', date: '2022-08-22', views: null },
  { id: '1X9jHJ6obCo', title: 'Dilaname', date: '2022-05-31', views: null },
  { id: '1zvC29-Y3Dk', title: 'Haydi Amedspor', date: '2022-05-06', views: null },
  { id: 'S3TXj9NVLrs', title: 'Paytexta Evînê', date: '2022-05-02', views: null },
  { id: 'HVeayn2-1Go', title: 'Govend & Halay (Zindî)', date: '2022-03-30', views: null, live: true },
  { id: 'Q3msL9cGb5Q', title: 'Oxir Be', date: '2021-07-16', views: null },
  { id: 'zLv7-xd8ckQ', title: 'Cejna We Pîroz (Newroza Wanê 2021)', date: '2021-03-24', views: null, live: true },
  { id: 'YF-NBRgKH1A', title: 'Were Canê (Ji Bo Xalê Seyitxan)', date: '2021-02-28', views: null },
  { id: 'f8mhHLCT6K4', title: 'Hîve', date: '2020-08-11', views: null },
  { id: '797KSMidXWw', title: 'Ez Nisêbin Tu Qamişlo', date: '2019-10-17', views: null },
  { id: '9qnivjfZOgU', title: 'Leyla (bi Svetlana re)', date: '2018-12-20', views: null },
  { id: 'Ob7TMB3GTyU', title: 'Ki Zava', date: '2017-06-21', views: null },
]
export const liveIds = new Set(curated.filter((v) => v.live).map((v) => v.id))

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
export async function getVideos(): Promise<{ videos: Video[]; live: boolean }> {
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
    const videos = entries.filter((v, i) => v.id && !shorts[i])
    if (!videos.length) throw new Error('empty feed')
    const ids = new Set(videos.map((v) => v.id))
    return { videos: [...videos, ...curated.filter((v) => !ids.has(v.id))].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')), live: true }
  } catch (e) {
    console.warn('[videos] channel feed unavailable:', (e as Error).message)
    return { videos: curated, live: false }
  }
}

export const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
