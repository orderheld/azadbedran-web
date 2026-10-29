import { NextResponse, type NextRequest } from 'next/server'
import { GATE_COOKIE, accessToken, gateEnabled } from './lib/gate'

const locales = ['ku', 'tr', 'en', 'ru'] as const

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const match = pathname.match(/^\/(ku|tr|en|ru)(\/|$)/)

  if (gateEnabled() && request.cookies.get(GATE_COOKIE)?.value !== (await accessToken())) {
    const url = request.nextUrl.clone()
    url.pathname = `/soon/${match?.[1] ?? 'ku'}`
    return NextResponse.rewrite(url)
  }

  if (match || pathname.startsWith('/soon')) return
  // Erste Sprache ist immer Kurmancî
  request.nextUrl.pathname = `/${locales[0]}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
