'use client'
import { useEffect, useRef, useState } from 'react'
import { coverUrl } from '@/lib/links'
import { usePlayer, type PlayItem } from './Player'
import { ArrowUpRight, Pause, Play } from './Icons'

export type ReleaseView = {
  id: number
  title: string
  year: string
  meta: string // „Single“, „Albûm · 14 stran“ …
  credit: string | null
  art: string
  appleUrl: string
  deezerUrl: string | null
  queue: PlayItem[] // Hörproben dieser Veröffentlichung
}

export function CoverImage({ art, title, sizes = '(max-width: 720px) 50vw, 25vw', eager }: { art: string; title: string; sizes?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false)
  const ref = useRef<HTMLImageElement>(null)
  // Fehler, die vor der Hydration passiert sind, nachträglich erkennen
  useEffect(() => {
    const img = ref.current
    if (img?.complete && img.naturalWidth === 0) setFailed(true)
  }, [])
  if (failed) return <span className="cover-fallback" aria-label={title}><span>{title}</span></span>
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={coverUrl(art, 600)}
      srcSet={`${coverUrl(art, 300)} 300w, ${coverUrl(art, 600)} 600w, ${coverUrl(art, 1000)} 1000w`}
      sizes={sizes}
      alt={title}
      width={600}
      height={600}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

export function ReleaseCard({ r, labels }: { r: ReleaseView; labels: { play: string; choose: string } }) {
  const p = usePlayer()
  const active = r.queue.some((q) => q.key === p.current?.key) && p.playing
  return (
    <article className="release">
      <div className="release-cover">
        <CoverImage art={r.art} title={r.title} />
        <div className="release-actions" data-no-autoplay>
          {r.queue.length > 0 && (
            <button type="button" className="round-btn" onClick={() => (active ? p.toggle() : p.play(r.queue))} aria-label={`${labels.play}: ${r.title}`}>
              {active ? <Pause size={20} /> : <Play size={20} />}
            </button>
          )}
          <button type="button" className="round-btn ghost" onClick={() => p.choose({ title: r.title, subtitle: r.credit ?? undefined, art: r.art, appleUrl: r.appleUrl, deezerUrl: r.deezerUrl })} aria-label={`${labels.choose}: ${r.title}`}>
            <ArrowUpRight size={20} />
          </button>
        </div>
      </div>
      <button type="button" className="release-text" data-no-autoplay onClick={() => p.choose({ title: r.title, subtitle: r.credit ?? undefined, art: r.art, appleUrl: r.appleUrl, deezerUrl: r.deezerUrl })}>
        <h3>{r.title}</h3>
        <p>{r.year} · {r.meta}{r.credit ? ` · ${r.credit}` : ''}</p>
      </button>
    </article>
  )
}

export function TrackList({ items, labels }: { items: (PlayItem & { n: number; ms: number | null })[]; labels: { play: string } }) {
  const p = usePlayer()
  const playable = items.filter((i) => i.src)
  return (
    <ol className="tracklist" data-no-autoplay>
      {items.map((it) => {
        const active = p.current?.key === it.key && p.playing
        const idx = playable.findIndex((x) => x.key === it.key)
        return (
          <li key={it.key} className={active ? 'is-active' : undefined}>
            <button type="button" disabled={!it.src} onClick={() => (active ? p.toggle() : p.play(playable, idx))} aria-label={`${labels.play}: ${it.title}`}>
              <span className="tl-n">{active ? <Pause size={14} /> : String(it.n % 100).padStart(2, '0')}</span>
              <span className="tl-title">{it.title}</span>
              {it.ms && <span className="tl-time">{Math.floor(it.ms / 60000)}:{String(Math.round((it.ms % 60000) / 1000)).padStart(2, '0')}</span>}
            </button>
          </li>
        )
      })}
    </ol>
  )
}
