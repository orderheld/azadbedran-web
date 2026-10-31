'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const groups: { title?: string; items: { href: string; label: string; icon: string }[] }[] = [
  { items: [{ href: '/admin', label: 'Dashboard', icon: '◧' }] },
  {
    title: 'Statistik',
    items: [
      { href: '/admin/live', label: 'Live', icon: '●' },
      { href: '/admin/statistik', label: 'Besucher', icon: '▤' },
      { href: '/admin/klicks', label: 'Link-Klicks', icon: '↗' },
    ],
  },
  {
    title: 'Inhalte',
    items: [
      { href: '/admin/konzerte', label: 'Konzerte', icon: '♫' },
      { href: '/admin/news', label: 'News', icon: '✎' },
      { href: '/admin/musik', label: 'Musik', icon: '♪' },
      { href: '/admin/videos', label: 'Videos', icon: '▶' },
      { href: '/admin/galerie', label: 'Galerie', icon: '▦' },
      { href: '/admin/texte', label: 'Texte & Bio', icon: '¶' },
      { href: '/admin/medien', label: 'Medien', icon: '⧉' },
    ],
  },
  { title: 'System', items: [{ href: '/admin/einstellungen', label: 'Einstellungen & SEO', icon: '⚙' }] },
]

export default function Nav() {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const active = (href: string) => (href === '/admin' ? path === '/admin' : path.startsWith(href))
  return (
    <>
      <button className="adm-menu-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menü">☰</button>
      <nav className={`adm-nav${open ? ' is-open' : ''}`} onClick={() => setOpen(false)}>
        <Link href="/admin" className="adm-brand">
          <span>Azad Bedran</span>
          <small>Admin</small>
        </Link>
        {groups.map((g, i) => (
          <div key={i} className="adm-nav-group">
            {g.title && <p className="adm-nav-title">{g.title}</p>}
            {g.items.map((it) => (
              <Link key={it.href} href={it.href} className={active(it.href) ? 'is-active' : undefined}>
                <span className="adm-ico" aria-hidden>{it.icon}</span>
                {it.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </>
  )
}
