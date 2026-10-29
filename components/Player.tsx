'use client'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { coverUrl, platformLinks } from '@/lib/links'
import BrandIcon from './BrandIcon'
import type { Dict } from '@/lib/i18n'
import { ArrowUpRight, Close, Headphones, Next, Pause, Play, Prev } from './Icons'

export type PlayItem = { key: string; title: string; subtitle: string; art: string; src: string; appleUrl: string; deezerUrl: string | null }
export type ChooseItem = { title: string; subtitle?: string; art: string; appleUrl: string; deezerUrl: string | null }

type Ctx = {
  current: PlayItem | null
  playing: boolean
  play: (items: PlayItem[], index?: number) => void
  toggle: () => void
  pause: () => void
  choose: (item: ChooseItem) => void
}
const PlayerContext = createContext<Ctx | null>(null)
export const usePlayer = () => useContext(PlayerContext)!

const OFF = 'ab-preview-off'

// Hörproben-Player für die ganze Website. Browser erlauben Ton erst nach einer Interaktion:
// Wir versuchen sofort zu starten; klappt das nicht, startet die Vorschau mit dem ersten Tippen/Klick auf der Seite.
export function PlayerProvider({ queue: defaultQueue, t, children }: { queue: PlayItem[]; t: Pick<Dict, 'player' | 'choose'>; children: ReactNode }) {
  const audio = useRef<HTMLAudioElement | null>(null)
  const [queue, setQueue] = useState<PlayItem[]>([])
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hidden, setHidden] = useState(false)
  const [chooser, setChooser] = useState<ChooseItem | null>(null)
  const started = useRef(false)
  const current = queue[index] ?? null

  const load = useCallback((items: PlayItem[], i: number) => {
    const el = audio.current
    if (!el || !items[i]) return Promise.resolve(false)
    started.current = true
    setQueue(items)
    setIndex(i)
    setHidden(false)
    el.src = items[i].src
    return el.play().then(() => true, () => false)
  }, [])

  const play = useCallback((items: PlayItem[], i = 0) => {
    try { sessionStorage.removeItem(OFF) } catch {}
    void load(items, i)
  }, [load])

  const pause = useCallback(() => audio.current?.pause(), [])

  const toggle = useCallback(() => {
    const el = audio.current
    if (!el || !current) return
    if (el.paused) void el.play()
    else {
      el.pause()
      try { sessionStorage.setItem(OFF, '1') } catch {}
    }
  }, [current])

  const step = useCallback((d: number) => {
    if (!queue.length) return
    void load(queue, (index + d + queue.length) % queue.length)
  }, [queue, index, load])

  // Automatische Vorschau
  useEffect(() => {
    if (!defaultQueue.length) return
    try { if (sessionStorage.getItem(OFF)) return } catch {}
    let armed = true
    const start = (e: Event) => {
      if (!armed || started.current) return disarm()
      const target = e.target as HTMLElement | null
      if (target?.closest('[data-no-autoplay]')) return
      disarm()
      void load(defaultQueue, 0)
    }
    const events = ['pointerdown', 'keydown'] as const
    const disarm = () => { armed = false; events.forEach((ev) => document.removeEventListener(ev, start, true)) }
    load(defaultQueue, 0).then((ok) => {
      if (ok) return
      started.current = false
      events.forEach((ev) => document.addEventListener(ev, start, { capture: true, passive: true }))
    })
    return disarm
  }, [defaultQueue, load])

  useEffect(() => {
    const el = audio.current
    if (!el) return
    const onTime = () => setProgress(el.duration ? el.currentTime / el.duration : 0)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    el.addEventListener('timeupdate', onTime)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    return () => { el.removeEventListener('timeupdate', onTime); el.removeEventListener('play', onPlay); el.removeEventListener('pause', onPause) }
  }, [])

  // Nach Ende automatisch die nächste Hörprobe
  const onEnded = () => { if (queue.length > 1) step(1) }

  useEffect(() => {
    if (!chooser) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setChooser(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [chooser])

  return (
    <PlayerContext.Provider value={{ current, playing, play, toggle, pause, choose: setChooser }}>
      {children}
      <audio ref={audio} preload="none" onEnded={onEnded} />

      {current && !hidden && (
        <div className="mini-player" data-no-autoplay role="region" aria-label={t.player.preview}>
          <div className="mp-progress" style={{ transform: `scaleX(${progress})` }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="mp-cover" src={coverUrl(current.art, 120)} alt="" width={48} height={48} />
          <div className="mp-meta">
            <span className="mp-label"><Headphones size={13} /> {t.player.preview} · 0:30</span>
            <strong>{current.title}</strong>
            <span className="mp-sub">{current.subtitle}</span>
          </div>
          <div className="mp-controls">
            {queue.length > 1 && <button onClick={() => step(-1)} aria-label={t.player.prev}><Prev size={18} /></button>}
            <button className="mp-play" onClick={toggle} aria-label={playing ? t.player.pause : t.player.play}>
              {playing ? <Pause size={20} /> : <Play size={20} />}
            </button>
            {queue.length > 1 && <button onClick={() => step(1)} aria-label={t.player.next}><Next size={18} /></button>}
          </div>
          <button className="mp-full" onClick={() => setChooser(current)}>{t.player.full}</button>
          <button className="mp-close" onClick={() => { pause(); setHidden(true); try { sessionStorage.setItem(OFF, '1') } catch {} }} aria-label={t.player.close}><Close size={18} /></button>
        </div>
      )}

      {chooser && (
        <div className="chooser" data-no-autoplay role="dialog" aria-modal="true" aria-label={t.choose.title} onClick={() => setChooser(null)}>
          <div className="chooser-panel" onClick={(e) => e.stopPropagation()}>
            <button className="chooser-close" onClick={() => setChooser(null)} aria-label={t.player.close}><Close size={22} /></button>
            <div className="chooser-head">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverUrl(chooser.art, 300)} alt="" width={96} height={96} />
              <div>
                <p className="eyebrow">{t.choose.open}</p>
                <h2>{chooser.title}</h2>
                {chooser.subtitle && <p className="muted">{chooser.subtitle}</p>}
              </div>
            </div>
            {(['stream', 'buy'] as const).map((kind) => (
              <div key={kind} className="chooser-group">
                <p className="eyebrow">{t.choose[kind]}</p>
                <ul>
                  {platformLinks(chooser).filter((l) => l.kind === kind).map((l) => (
                    <li key={l.id}>
                      <a href={l.url} target="_blank" rel="noopener" className={`platform p-${l.id}`}>
                        <BrandIcon id={l.id} size={22} />
                        {l.label}
                        <ArrowUpRight size={16} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </PlayerContext.Provider>
  )
}

// Knöpfe, die überall auf der Seite den Player bzw. die Plattformwahl öffnen
export function PlayButton({ items, index = 0, label, className = 'btn btn-primary' }: { items: PlayItem[]; index?: number; label: string; className?: string }) {
  const p = usePlayer()
  const item = items[index]
  if (!item) return null
  const active = p.current?.key === item.key && p.playing
  return (
    <button type="button" className={className} data-no-autoplay onClick={() => (active ? p.toggle() : p.play(items, index))} aria-pressed={active}>
      {active ? <Pause size={16} /> : <Play size={16} />} <span>{label}</span>
    </button>
  )
}

export function ChooseButton({ item, label, className = 'btn btn-ghost' }: { item: ChooseItem; label: string; className?: string }) {
  const p = usePlayer()
  return (
    <button type="button" className={className} data-no-autoplay onClick={() => p.choose(item)}>
      <span>{label}</span> <ArrowUpRight size={16} />
    </button>
  )
}
