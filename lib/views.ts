import type { Dict } from './i18n'
import type { Release } from './music'
import type { PlayItem } from '@/components/Player'
import type { ReleaseView } from '@/components/Release'

export function credit(r: Release, t: Dict) {
  if (r.with?.length) return `${t.music.with} ${r.with.join(', ')}`
  if (r.feat) return `${t.music.feat} ${r.feat}`
  return null
}

export function typeLabel(r: Release, t: Dict) {
  if (r.type === 'single') return t.music.single
  return `${r.type === 'live' ? t.music.live : t.music.album} · ${r.tracks} ${t.music.tracks}`
}

export function playItems(r: Release): PlayItem[] {
  const by = ['Azad Bedran', ...(r.with ?? [])].join(', ')
  return r.songs
    .filter((s) => s.preview)
    .map((s) => ({ key: `${r.id}:${s.n}`, title: r.type === 'single' ? r.title : s.title, subtitle: r.type === 'single' ? by : `${r.title} · ${by}`, art: r.art, src: s.preview!, appleUrl: r.appleUrl, deezerUrl: r.deezerUrl }))
}

export function toView(r: Release, t: Dict): ReleaseView {
  return { id: r.id, title: r.title, year: r.date.slice(0, 4), meta: typeLabel(r, t), credit: credit(r, t), art: r.art, appleUrl: r.appleUrl, deezerUrl: r.deezerUrl, queue: playItems(r) }
}

// Automatische Vorschau: je eine Hörprobe der neuesten Veröffentlichungen
export function latestQueue(releases: Release[], n = 12): PlayItem[] {
  return releases.flatMap((r) => playItems(r).slice(0, 1)).slice(0, n)
}
