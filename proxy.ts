import { NextResponse, type NextRequest } from 'next/server'
import { GATE_COOKIE, accessToken, gateEnabled } from './lib/gate'
import { ADMIN_COOKIE, verifySessionToken } from './lib/admin/token'

const locales = ['ku', 'tr', 'en', 'ru'] as const

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin-Bereich: eigener Login, nie indexieren, nicht hinter dem Vorschau-Passwort
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const ok = pathname === '/admin/login' || (await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value))
    if (!ok) {
      if (pathname.startsWith('/admin/api/')) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    const res = NextResponse.next()
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    res.headers.set('Cache-Control', 'no-store')
    return res
  }

  const match = pathname.match(/^\/(ku|tr|en|ru)(\/|$)/)

  if (gateEnabled() && request.cookies.get(GATE_COOKIE)?.value !== (await accessToken())) {
    const url = request.nextUrl.clone()
    url.pathname = `/soon/${match?.[1] ?? 'ku'}`
    return NextResponse.rewrite(url)
  }

  // Seite ist öffentlich: alte „Coming soon“-Links auf die echte Startseite umleiten
  const soon = pathname.match(/^\/soon(?:\/(ku|tr|en|ru))?/)
  if (soon && !gateEnabled()) return NextResponse.redirect(new URL(`/${soon[1] ?? 'ku'}`, request.url), 308)

  if (match || soon) return
  // Erste Sprache ist immer Kurmancî
  request.nextUrl.pathname = `/${locales[0]}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
