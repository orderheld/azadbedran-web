import { getLive } from '@/lib/analytics/store'
import { isAdmin } from '@/lib/admin/session'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: 'unauthorized' }, { status: 401 })
  return Response.json(await getLive(), { headers: { 'Cache-Control': 'no-store' } })
}
