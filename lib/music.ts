import 'server-only'
import { catalog } from './catalog'
import { site } from './site'

export type Track = { title: string; preview: string | null; ms: number | null; n: number }
export type Release = {
  id: number
  title: string
  date: string
  type: 'album' | 'live' | 'single'
  tracks: number
  art: string // Basis-URL ohne Größe, siehe coverUrl()
  appleUrl: string
  deezerUrl: string | null
  with?: string[]
  feat?: string
  songs: Track[]
}

const THUMB = 'https://is1-ssl.mzstatic.com/image/thumb/'

type ItunesCollection = { wrapperType: string; collectionId: number; collectionName: string; collectionViewUrl: string; artworkUrl100: string; releaseDate: string; trackCount: number; artistName: string }
type ItunesTrack = { wrapperType: string; kind?: string; collectionId: number; trackName: string; previewUrl?: string; trackTimeMillis?: number; trackNumber: number; discNumber?: number }
type DeezerAlbum = { title: string; link: string }

const REVALIDATE = 60 * 60 * 6
async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE }, signal: AbortSignal.timeout(6000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()) as T
  } catch (e) {
    console.warn('[music]', url, (e as Error).message)
    return null
  }
}

export const titleKey = (s: string) =>
  s.toLocaleLowerCase('tr').replace(/\s*\(feat\.[^)]*\)/, '').replace(/\s*-\s*(single|ep)$/i, '').replace(/[^\p{L}\p{N}]+/gu, '')

function fromCatalog(): Release[] {
  return catalog.map((c) => ({
    ...c,
    art: THUMB + c.art,
    appleUrl: `https://music.apple.com/album/${c.id}`,
    deezerUrl: null,
    songs: [],
  }))
}

function fromItunes(c: ItunesCollection): Release {
  let title = c.collectionName.replace(/\s*-\s*(Single|EP)$/i, '')
  const feat = title.match(/\s*\(feat\. ([^)]+)\)/)
  if (feat) title = title.replace(feat[0], '')
  const others = c.artistName.split(/,|&/).map((s) => s.trim()).filter((s) => s && s !== site.name)
  return {
    id: c.collectionId,
    title,
    date: c.releaseDate.slice(0, 10),
    type: /\(live\)/i.test(title) ? 'live' : c.trackCount >= 7 ? 'album' : 'single',
    tracks: c.trackCount,
    art: c.artworkUrl100.replace(/\/\d+x\d+bb\.\w+$/, ''),
    appleUrl: c.collectionViewUrl.split('?')[0],
    deezerUrl: null,
    with: others.length ? others : undefined,
    feat: feat?.[1],
    songs: [],
  }
}

// Diskografie: Apple Music live (neue Veröffentlichungen erscheinen automatisch), sonst Stand aus lib/catalog.ts.
// Hörproben (30 s) kommen von Apple, Deezer-Links werden über den Titel zugeordnet.
export async function getDiscography(): Promise<Release[]> {
  const [albums, songs, deezer] = await Promise.all([
    getJson<{ results: ItunesCollection[] }>(`https://itunes.apple.com/lookup?id=${site.appleArtistId}&entity=album&limit=200`),
    getJson<{ results: ItunesTrack[] }>(`https://itunes.apple.com/lookup?id=${site.appleArtistId}&entity=song&limit=200`),
    getJson<{ data: DeezerAlbum[] }>(`https://api.deezer.com/artist/${site.deezerArtistId}/albums?limit=200`),
  ])

  const byId = new Map(fromCatalog().map((r) => [r.id, r]))
  for (const c of albums?.results ?? []) if (c.wrapperType === 'collection') byId.set(c.collectionId, fromItunes(c))

  for (const t of songs?.results ?? []) {
    if (t.wrapperType !== 'track' || t.kind !== 'song') continue
    const r = byId.get(t.collectionId)
    if (r) r.songs.push({ title: t.trackName, preview: t.previewUrl ?? null, ms: t.trackTimeMillis ?? null, n: (t.discNumber ?? 1) * 100 + t.trackNumber })
  }

  const deezerByTitle = new Map((deezer?.data ?? []).map((a) => [titleKey(a.title), a.link]))
  const all = [...byId.values()]
  for (const r of all) {
    r.songs.sort((a, b) => a.n - b.n)
    r.deezerUrl = deezerByTitle.get(titleKey(r.title)) ?? null
  }

  // Neuauflagen gleichen Titels (z. B. „Wayê Wayê“ 2021/2023) nur einmal zeigen – die Erstveröffentlichung.
  const first = new Map<string, Release>()
  for (const r of all.sort((a, b) => a.date.localeCompare(b.date))) {
    const key = `${r.type === 'single' ? 's' : r.type}:${titleKey(r.title)}`
    if (!first.has(key)) first.set(key, r)
    else if (!first.get(key)!.songs.length && r.songs.length) first.get(key)!.songs = r.songs
  }
  return [...first.values()].sort((a, b) => b.date.localeCompare(a.date))
}

// Songs eines Albums inkl. Hörproben (eigene Abfrage, da die Künstlerabfrage bei 200 Songs endet)
export async function getAlbumSongs(id: number): Promise<Track[]> {
  const json = await getJson<{ results: ItunesTrack[] }>(`https://itunes.apple.com/lookup?id=${id}&entity=song`)
  return (json?.results ?? [])
    .filter((t) => t.wrapperType === 'track')
    .map((t) => ({ title: t.trackName, preview: t.previewUrl ?? null, ms: t.trackTimeMillis ?? null, n: (t.discNumber ?? 1) * 100 + t.trackNumber }))
    .sort((a, b) => a.n - b.n)
}
