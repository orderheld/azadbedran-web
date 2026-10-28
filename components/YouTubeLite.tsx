'use client'
import { useState } from 'react'
import { Play } from './Icons'

export default function YouTubeLite({ id, title, playLabel }: { id: string; title: string; playLabel: string }) {
  const [active, setActive] = useState(false)
  return (
    <div className="yt">
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button onClick={() => setActive(true)} aria-label={`${playLabel}: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`} alt="" loading="lazy" />
          <span className="yt-play"><Play size={26} /></span>
        </button>
      )}
    </div>
  )
}
