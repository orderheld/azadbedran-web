import { Card, DbNotice, Flash, PageHead, dateOnly } from '@/components/admin/ui'
import ConfirmButton from '@/components/admin/ConfirmButton'
import { adminVideos } from '@/lib/admin/data'
import { hasDb } from '@/lib/db'
import { deleteVideo, saveVideo } from '../../actions'

export const metadata = { title: 'Videos' }

export default async function Videos({ searchParams }: PageProps<'/admin/videos'>) {
  const { ok } = await searchParams
  const videos = await adminVideos()
  const ro = !hasDb()
  const visible = videos.filter((v) => v.published)
  const hidden = videos.filter((v) => !v.published)
  return (
    <>
      <PageHead title="Videos" sub="Videos vom offiziellen YouTube-Kanal. „Konzert/Live“ erscheint im unteren Bereich der Video-Seite." />
      <Flash ok={ok} />
      <DbNotice />
      <Card title="Video hinzufügen">
        <form action={saveVideo} className="row-4">
          <label className="field">YouTube-Link *<input name="youtube" required placeholder="https://www.youtube.com/watch?v=…" disabled={ro} /></label>
          <label className="field">Titel *<input name="title" required placeholder="Songtitel" disabled={ro} /></label>
          <label className="field">Datum<input type="date" name="date" disabled={ro} /></label>
          <div className="field">
            <label className="check"><input type="checkbox" name="live" disabled={ro} /> Konzert / Live</label>
            <button className="btn btn-primary" disabled={ro}>Hinzufügen</button>
          </div>
        </form>
      </Card>
      <Card title={`Auf der Website (${visible.length})`}>
        <div className="vlist">
          {visible.map((v) => (
            <form key={v.id} action={saveVideo} className="vitem">
              <input type="hidden" name="id" value={v.id} />
              <input type="hidden" name="published" value="on" />
              <a href={`https://www.youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noopener" className="vthumb">
                <img src={`https://i.ytimg.com/vi/${v.youtube_id}/mqdefault.jpg`} alt="" loading="lazy" />
              </a>
              <div className="vfields">
                <input name="title" defaultValue={v.title} required aria-label="Titel" disabled={ro} />
                <div className="vrow">
                  <input name="youtube" defaultValue={v.youtube_id} required aria-label="YouTube-ID" disabled={ro} />
                  <input type="date" name="date" defaultValue={v.date ?? ''} aria-label="Datum" disabled={ro} />
                  <label className="check"><input type="checkbox" name="live" defaultChecked={v.live} disabled={ro} /> Live</label>
                </div>
              </div>
              <div className="btn-col">
                <button className="btn btn-small" disabled={ro}>Speichern</button>
                <ConfirmButton className="btn btn-small btn-ghost" message="Video auf der Website ausblenden?" formAction={deleteVideo} disabled={ro}>Ausblenden</ConfirmButton>
              </div>
            </form>
          ))}
        </div>
      </Card>
      {hidden.length > 0 && (
        <Card title={`Ausgeblendet (${hidden.length})`}>
          <ul className="list">
            {hidden.map((v) => (
              <li key={v.id}>
                <form action={saveVideo} className="inline">
                  <input type="hidden" name="id" value={v.id} />
                  <input type="hidden" name="youtube" value={v.youtube_id} />
                  <input type="hidden" name="title" value={v.title} />
                  <input type="hidden" name="date" value={v.date ?? ''} />
                  {v.live && <input type="hidden" name="live" value="on" />}
                  <input type="hidden" name="published" value="on" />
                  <span>{v.title} <small className="muted">{v.date ? dateOnly(v.date) : ''}</small></span>
                  <button className="btn btn-small" disabled={ro}>Wieder zeigen</button>
                </form>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  )
}
