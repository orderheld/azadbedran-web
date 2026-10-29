'use client'
import { useState } from 'react'

// Teilen über das Teilen-Menü des Handys; ohne Web Share direkt per WhatsApp
export default function ShareButton({ url, title, label, copied }: { url: string; title: string; label: string; copied: string }) {
  const [done, setDone] = useState(false)
  const share = async () => {
    const link = new URL(url, location.origin).toString()
    if (navigator.share) {
      try { await navigator.share({ title, url: link }) } catch {}
      return
    }
    if (window.matchMedia('(pointer: coarse)').matches) {
      location.href = `https://wa.me/?text=${encodeURIComponent(`${title} ${link}`)}`
      return
    }
    try { await navigator.clipboard.writeText(link); setDone(true); setTimeout(() => setDone(false), 2000) } catch {}
  }
  return (
    <button type="button" className="btn btn-ghost share-btn" onClick={share} data-no-autoplay>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></svg>
      {done ? copied : label}
    </button>
  )
}
