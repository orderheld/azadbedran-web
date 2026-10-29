import { NextResponse, type NextRequest } from 'next/server'
import { GATE_COOKIE, accessToken, checkPassword } from '@/lib/gate'

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const lang = ['ku', 'tr', 'en', 'ru'].includes(String(form.get('lang'))) ? String(form.get('lang')) : 'ku'
  const ok = checkPassword(String(form.get('password') ?? ''))

  const target = new URL(ok ? `/${lang}` : `/${lang}?error=1`, request.url)
  const res = NextResponse.redirect(target, 303)
  if (ok) {
    res.cookies.set(GATE_COOKIE, await accessToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
  }
  return res
}
