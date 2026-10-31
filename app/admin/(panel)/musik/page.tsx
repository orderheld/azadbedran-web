import { Card, DbNotice, Flash, PageHead, dateOnly } from '@/components/admin/ui'
import { getHiddenReleases } from '@/lib/content'
import { getDiscography } from '@/lib/music'
import { hasDb } from '@/lib/db'
import { setReleaseHidden } from '../../actions'

export const metadata = { title: 'Musik' }

export default async function Music({ searchParams }: PageProps<'/admin/musik'>) {
  const { ok } = await searchParams
  const [releases, hidden] = await Promise.all([getDiscography({ includeHidden: true }), getHiddenReleases()])
  const ro = !hasDb()
  return (
    <>
      <PageHead title="Musik" sub="Alben und Singles kommen automatisch von Apple Music (alle 6 Stunden). Neue Songs erscheinen von selbst. Hier kannst du einzelne Veröffentlichungen ausblenden." />
      <Flash ok={ok} />
      <DbNotice />
      <Card title={`${releases.length} Veröffentlichungen · ${hidden.size} ausgeblendet`}>
        <table className="tbl">
          <thead><tr><th>Cover</th><th>Titel</th><th>Art</th><th>Datum</th><th>Hörprobe</th><th>Sichtbar</th></tr></thead>
          <tbody>
            {releases.map((r) => {
              const isHidden = hidden.has(r.id)
              return (
                <tr key={r.id} className={isHidden ? 'is-dim' : undefined}>
                  <td><img src={`${r.art}/120x120bb.jpg`} alt="" className="thumb-sm" loading="lazy" /></td>
                  <td><a href={r.appleUrl} target="_blank" rel="noopener"><b>{r.title}</b></a>{r.with && <><br /><small className="muted">mit {r.with.join(', ')}</small></>}</td>
                  <td>{r.type === 'single' ? 'Single' : r.type === 'live' ? 'Live-Album' : 'Album'}{r.type !== 'single' && <small className="muted"> · {r.tracks} Songs</small>}</td>
                  <td>{dateOnly(r.date)}</td>
                  <td>{r.songs.some((s) => s.preview) ? '✓' : <span className="muted">–</span>}</td>
                  <td>
                    <form action={setReleaseHidden}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="hidden" value={isHidden ? 'false' : 'true'} />
                      <button className={`btn btn-small${isHidden ? ' btn-primary' : ''}`} disabled={ro}>{isHidden ? 'Einblenden' : 'Ausblenden'}</button>
                    </form>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </>
  )
}
