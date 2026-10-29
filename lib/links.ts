import { site } from './site'

export const coverUrl = (art: string, size = 600) => `${art}/${size}x${size}bb.jpg`

export type PlatformLink = { id: string; label: string; url: string; kind: 'stream' | 'buy' }

// Plattformwahl pro Veröffentlichung. Apple und Deezer verlinken exakt, die übrigen öffnen die Suche nach Künstler + Titel.
export function platformLinks(r: { title: string; appleUrl: string; deezerUrl: string | null }): PlatformLink[] {
  const q = encodeURIComponent(`${site.name} ${r.title.replace(/\s*\(live\)/i, '')}`)
  return [
    { id: 'spotify', label: 'Spotify', url: `https://open.spotify.com/search/${q}`, kind: 'stream' },
    { id: 'apple', label: 'Apple Music', url: r.appleUrl, kind: 'stream' },
    { id: 'youtube-music', label: 'YouTube Music', url: `https://music.youtube.com/search?q=${q}`, kind: 'stream' },
    { id: 'deezer', label: 'Deezer', url: r.deezerUrl ?? `https://www.deezer.com/search/${q}`, kind: 'stream' },
    { id: 'amazon', label: 'Amazon Music', url: `https://music.amazon.com/search/${q}`, kind: 'stream' },
    { id: 'tidal', label: 'TIDAL', url: `https://listen.tidal.com/search?q=${q}`, kind: 'stream' },
    { id: 'itunes', label: 'iTunes Store', url: `${r.appleUrl}?app=itunes`, kind: 'buy' },
    { id: 'amazon-buy', label: 'Amazon MP3', url: `https://www.amazon.com/s?k=${q}&i=digital-music`, kind: 'buy' },
  ]
}
