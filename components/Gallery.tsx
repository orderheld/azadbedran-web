'use client'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Close } from './Icons'

type Item = { src: string | null; alt: string }

export default function Gallery({ items, placeholder, closeLabel }: { items: Item[]; placeholder: string; closeLabel: string }) {
  const [index, setIndex] = useState<number | null>(null)
  const real = items.filter((i): i is { src: string; alt: string } => !!i.src)

  const close = useCallback(() => setIndex(null), [])
  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') setIndex((i) => (i === null ? i : (i + 1) % real.length))
      if (e.key === 'ArrowLeft') setIndex((i) => (i === null ? i : (i - 1 + real.length) % real.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, real.length, close])

  return (
    <>
      <div className="gallery-grid">
        {items.map((item, i) =>
          item.src ? (
            <button key={i} className={`gallery-item g${i % 6}`} onClick={() => setIndex(real.indexOf(item as { src: string; alt: string }))}>
              <Image src={item.src} alt={item.alt} fill sizes="(max-width: 720px) 50vw, 33vw" />
            </button>
          ) : (
            <div key={i} className={`gallery-item g${i % 6} is-placeholder`}>
              <span>{placeholder} {String(i + 1).padStart(2, '0')}</span>
            </div>
          ),
        )}
      </div>
      {index !== null && real[index] && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={close}>
          <button className="lightbox-close" onClick={close} aria-label={closeLabel}><Close size={26} /></button>
          <div className="lightbox-img" onClick={(e) => e.stopPropagation()}>
            <Image src={real[index].src} alt={real[index].alt} fill sizes="100vw" style={{ objectFit: 'contain' }} />
          </div>
        </div>
      )}
    </>
  )
}
