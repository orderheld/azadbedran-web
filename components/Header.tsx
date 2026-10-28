'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, type Locale, type Dict } from '@/lib/i18n'
import { href, pages } from '@/lib/routes'
import { Close, Menu } from './Icons'

export default function Header({ lang, nav }: { lang: Locale; nav: Dict['nav'] }) {
  const pathname = usePathname()
  const isHome = pathname === `/${lang}`
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  // Sprachwechsel bleibt auf der aktuellen Unterseite
  const rest = pathname.replace(/^\/(ku|tr|en)/, '')

  return (
    <header className={`site-header${scrolled || open || !isHome ? ' is-solid' : ''}`}>
      <div className="container header-row">
        <Link href={href(lang)} className="wordmark">Azad <em>Bedran</em></Link>
        <nav className={`main-nav${open ? ' is-open' : ''}`} aria-label="Main">
          <ul>
            {pages.map((p) => {
              const to = href(lang, p)
              const active = pathname === to || pathname.startsWith(`${to}/`)
              return (
                <li key={p}>
                  <Link href={to} aria-current={active ? 'page' : undefined}>{nav[p]}</Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="header-tools">
          <div className="lang-switch" role="group" aria-label="Language">
            {locales.map((l) => (
              <Link key={l} href={`/${l}${rest}`} hrefLang={l} aria-current={l === lang ? 'true' : undefined}>
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
          <button className="menu-toggle" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <Close size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  )
}
