import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE, verifySessionToken } from './token'

export async function isAdmin() {
  return verifySessionToken((await cookies()).get(ADMIN_COOKIE)?.value)
}

// In jeder Admin-Seite und jeder Server-Action aufrufen
export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin/login')
}
