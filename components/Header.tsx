'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, localeNames, type Locale, type Dict } from '@/lib/i18n'
import { href, pages } from '@/lib/routes'
import Logo from './Logo'
import { Close, Menu } from './Icons'

export default function Header({ lang, t }: { lang: Locale; t: Pick<Dict, 'nav' | 'menu' | 'close' | 'home'> }) {
  const pathname = usePathname()
  const isHome = pathname === `/${lang}`
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
  }, [open])

  const rest = pathname.replace(/^\/(ku|tr|en|ru)/, '')

  return (
    <header className={`site-header${scrolled || open ? ' is-solid' : ''}${isHome ? ' on-hero' : ''}`}>
      <div className="container header-row">
        <Link href={href(lang)} className="brand" aria-label={`Azad Bedran – ${t.home}`}>
          <Logo variant="horizontal" className="brand-logo" />
        </Link>
        <nav className={`main-nav${open ? ' is-open' : ''}`} aria-label="Main">
          <ul>
            {pages.map((p, i) => {
              const to = href(lang, p)
              const active = pathname === to || pathname.startsWith(`${to}/`)
              return (
                <li key={p} style={{ '--i': i } as React.CSSProperties}>
                  <Link href={to} aria-current={active ? 'page' : undefined}>{t.nav[p]}</Link>
                </li>
              )
            })}
          </ul>
          <div className="nav-langs" role="group" aria-label="Language">
            {locales.map((l) => (
              <Link key={l} href={`/${l}${rest}`} hrefLang={l} aria-current={l === lang ? 'true' : undefined}>{localeNames[l]}</Link>
            ))}
          </div>
        </nav>
        <div className="header-tools">
          <div className="lang-switch" role="group" aria-label="Language">
            {locales.map((l) => (
              <Link key={l} href={`/${l}${rest}`} hrefLang={l} title={localeNames[l]} aria-current={l === lang ? 'true' : undefined}>{l.toUpperCase()}</Link>
            ))}
          </div>
          <button className="menu-toggle" aria-label={open ? t.close : t.menu} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <Close size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  )
}
