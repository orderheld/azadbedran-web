'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Close, Phone, Pin, Ticket } from './Icons'

export type PopupShow = {
  id: number
  day: string
  month: string
  weekday: string
  city: string
  place: string
  time: string | null
  poster: string | null
  ticketUrl: string | null
  phone: string | null
  countdown: string
}
type Labels = { next: string; tickets: string; reserve: string; ticketsSoon: string; info: string; close: string; doors: string }

const KEY = 'ab-next-show-seen'

// Hinweis auf das nächste Konzert: einmal pro Besuch, kurz nach dem Laden, nicht auf der Konzertseite selbst.
export default function NextShowPopup({ show, infoHref, t }: { show: PopupShow; infoHref: string; t: Labels }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (pathname.endsWith('/concerts')) return
    try { if (sessionStorage.getItem(KEY) === String(show.id)) return } catch {}
    const timer = setTimeout(() => setOpen(true), 3500)
    return () => clearTimeout(timer)
  }, [pathname, show.id])

  useEffect(() => {
    if (!open) return
    try { sessionStorage.setItem(KEY, String(show.id)) } catch {}
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, show.id])

  if (!open) return null
  return (
    <div className="show-pop" role="dialog" aria-modal="false" aria-label={t.next} data-no-autoplay>
      <button className="show-pop-close" onClick={() => setOpen(false)} aria-label={t.close}><Close size={20} /></button>
      {show.poster && (
        <div className="show-pop-poster"><Image src={show.poster} alt="" fill sizes="140px" /></div>
      )}
      <div className="show-pop-body">
        <p className="eyebrow">{t.next} <span className="pill">{show.countdown}</span></p>
        <p className="show-pop-date"><span className="show-pop-day">{show.day}</span> {show.month} · {show.weekday}</p>
        <p className="show-pop-city">{show.city}</p>
        <p className="show-pop-place"><Pin size={14} /> {show.place}{show.time ? ` · ${t.doors} ${show.time}` : ''}</p>
        <div className="show-pop-actions">
          {show.ticketUrl ? (
            <a className="btn btn-primary btn-sm" href={show.ticketUrl} target="_blank" rel="noopener"><Ticket size={16} /> {t.tickets}</a>
          ) : show.phone ? (
            <a className="btn btn-primary btn-sm" href={`tel:${show.phone.replace(/[^\d+]/g, '')}`}><Phone size={15} /> {t.reserve}</a>
          ) : (
            <span className="tag">{t.ticketsSoon}</span>
          )}
          <Link className="btn btn-ghost btn-sm" href={infoHref} onClick={() => setOpen(false)}>{t.info} <ArrowRight size={15} /></Link>
        </div>
      </div>
    </div>
  )
}
