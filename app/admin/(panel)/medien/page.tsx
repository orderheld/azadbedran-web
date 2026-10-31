import ConfirmButton from '@/components/admin/ConfirmButton'
import CopyButton from '@/components/admin/CopyButton'
import Uploader from '@/components/admin/Uploader'
import { Card, DbNotice, Flash, PageHead, dateTime } from '@/components/admin/ui'
import { adminMedia, mediaUrl } from '@/lib/admin/data'
import { hasDb } from '@/lib/db'
import { deleteMedia } from '../../actions'

export const metadata = { title: 'Medien' }

export default async function Media({ searchParams }: PageProps<'/admin/medien'>) {
  const { ok } = await searchParams
  const files = await adminMedia()
  const ro = !hasDb()
  return (
    <>
      <PageHead title="Medien" sub="Alle hochgeladenen Bilder. Den Link kannst du in News, Konzerten oder der Galerie verwenden." />
      <Flash ok={ok} />
      <DbNotice />
      <Card title="Hochladen"><Uploader disabled={ro} /></Card>
      <Card title={`${files.length} Dateien`}>
        {files.length ? (
          <div className="ggrid">
            {files.map((f) => {
              const url = mediaUrl(f.id, f.name)
              return (
                <form key={f.id} action={deleteMedia} className="gitem">
                  <input type="hidden" name="id" value={f.id} />
                  <div className="gimg"><img src={url} alt="" loading="lazy" /></div>
                  <small className="break">{f.name}</small>
                  <small className="muted">{f.width}×{f.height} · {Math.round(f.size / 1024)} KB · {dateTime(f.created_at)}</small>
                  <div className="btn-row">
                    <CopyButton text={url} />
                    <ConfirmButton className="btn btn-small btn-danger" message="Datei löschen? Wo sie verwendet wird, fehlt das Bild dann." disabled={ro}>Löschen</ConfirmButton>
                  </div>
                </form>
              )
            })}
          </div>
        ) : <p className="empty">Noch keine Uploads</p>}
      </Card>
    </>
  )
}
