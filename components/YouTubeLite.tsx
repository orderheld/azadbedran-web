'use client'
import { useState } from 'react'
import { usePlayer } from './Player'
import { Play } from './Icons'

// Vorschaubild von YouTube (hqdefault gibt es für jedes Video), Player lädt erst nach Klick (youtube-nocookie)
export default function YouTubeLite({ id, title, playLabel, eager }: { id: string; title: string; playLabel: string; eager?: boolean }) {
  const [active, setActive] = useState(false)
  const player = usePlayer()
  return (
    <div className="yt" data-no-autoplay>
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => { player.pause(); setActive(true) }} aria-label={`${playLabel}: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" width={480} height={360} />
          <span className="yt-play"><Play size={26} /></span>
        </button>
      )}
    </div>
  )
}
