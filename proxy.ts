import { NextResponse, type NextRequest } from 'next/server'

const locales = ['ku', 'tr', 'en'] as const

function pickLocale(header: string | null): (typeof locales)[number] {
  const langs = (header ?? '')
    .split(',')
    .map((part) => part.split(';')[0].trim().toLowerCase())
  for (const l of langs) {
    if (l.startsWith('ku') || l.startsWith('kmr')) return 'ku'
    if (l.startsWith('tr')) return 'tr'
    if (l.startsWith('en')) return 'en'
  }
  return 'ku'
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  if (hasLocale) return

  const locale = pickLocale(request.headers.get('accept-language'))
  request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (images, robots.txt, sitemap.xml …)
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
