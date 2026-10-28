'use client'
import { useState } from 'react'
import { Play } from './Icons'

// Zwei-Klick-Lösung: Der Player eines Drittanbieters wird erst nach Klick geladen (DSGVO / revDSG).
export default function ConsentEmbed({ src, title, provider, loadLabel, notice, height = 380 }: {
  src: string
  title: string
  provider: string
  loadLabel: string
  notice: string
  height?: number
}) {
  const [active, setActive] = useState(false)
  if (active) {
    return <iframe className="embed-frame" src={src} title={title} height={height} allow="encrypted-media; clipboard-write" loading="lazy" />
  }
  return (
    <div className="embed-consent" style={{ minHeight: height }}>
      <button className="btn btn-gold" onClick={() => setActive(true)}>
        <Play size={16} /> {loadLabel}
      </button>
      <p>{notice.replace('%s', provider)}</p>
    </div>
  )
}
