'use client'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Close, Next, Prev } from './Icons'

type Item = { src: string; w: number; h: number; alt?: string | null }

export default function Gallery({ items, alt, closeLabel }: { items: Item[]; alt: string; closeLabel: string }) {
  const [index, setIndex] = useState<number | null>(null)
  const close = useCallback(() => setIndex(null), [])
  const go = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length])

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    document.documentElement.classList.add('menu-open')
    return () => { window.removeEventListener('keydown', onKey); document.documentElement.classList.remove('menu-open') }
  }, [index, close, go])

  return (
    <>
      <div className="gallery">
        {items.map((item, i) => (
          <button key={item.src} type="button" className="gallery-item" style={{ aspectRatio: `${item.w} / ${item.h}` }} onClick={() => setIndex(i)} aria-label={`${alt} ${i + 1}`}>
            <Image src={item.src} alt={item.alt || `${alt} ${i + 1}`} fill sizes="(max-width: 720px) 50vw, 33vw" />
          </button>
        ))}
      </div>
      {index !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={close}>
          <button className="lightbox-close" onClick={close} aria-label={closeLabel}><Close size={26} /></button>
          <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); go(-1) }} aria-label="←"><Prev size={22} /></button>
          <div className="lightbox-img" onClick={(e) => e.stopPropagation()}>
            <Image src={items[index].src} alt={items[index].alt || `${alt} ${index + 1}`} fill sizes="100vw" style={{ objectFit: 'contain' }} />
          </div>
          <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); go(1) }} aria-label="→"><Next size={22} /></button>
        </div>
      )}
    </>
  )
}
