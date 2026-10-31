import ConfirmButton from '@/components/admin/ConfirmButton'
import Uploader from '@/components/admin/Uploader'
import { Card, DbNotice, Flash, PageHead } from '@/components/admin/ui'
import { adminGallery } from '@/lib/admin/data'
import { hasDb } from '@/lib/db'
import { addUploadedToGallery, deleteGalleryItem, moveGalleryItem, saveGalleryItem } from '../../actions'

export const metadata = { title: 'Galerie' }

export default async function GalleryAdmin({ searchParams }: PageProps<'/admin/galerie'>) {
  const { ok } = await searchParams
  const items = await adminGallery()
  const ro = !hasDb()
  return (
    <>
      <PageHead title="Galerie" sub="Fotos der Galerie-Seite. Reihenfolge mit den Pfeilen ändern. Der Bildtext hilft Google und Screenreadern." />
      <Flash ok={ok} />
      <DbNotice />
      <Card title="Fotos hinzufügen">
        <Uploader onUploaded={addUploadedToGallery} disabled={ro} />
      </Card>
      <Card title={`${items.length} Fotos`}>
        <div className="ggrid">
          {items.map((g, i) => (
            <form key={g.id} action={saveGalleryItem} className={`gitem${g.published ? '' : ' is-dim'}`}>
              <input type="hidden" name="id" value={g.id} />
              <div className="gimg"><img src={g.src} alt={g.alt ?? ''} loading="lazy" /></div>
              <input name="alt" defaultValue={g.alt ?? ''} placeholder="Bildtext, z. B. Azad Bedran live in Köln" aria-label="Bildtext" disabled={ro} />
              <label className="check"><input type="checkbox" name="published" defaultChecked={g.published} disabled={ro} /> Sichtbar</label>
              <div className="btn-row">
                <button className="btn btn-small" disabled={ro}>Speichern</button>
                <button className="btn btn-small btn-ghost" formAction={moveGalleryItem} name="dir" value="up" disabled={ro || i === 0} aria-label="Nach vorne">←</button>
                <button className="btn btn-small btn-ghost" formAction={moveGalleryItem} name="dir" value="down" disabled={ro || i === items.length - 1} aria-label="Nach hinten">→</button>
                <ConfirmButton className="btn btn-small btn-danger" message="Foto aus der Galerie entfernen?" formAction={deleteGalleryItem} disabled={ro}>Entfernen</ConfirmButton>
              </div>
              <small className="muted">{g.width}×{g.height}</small>
            </form>
          ))}
        </div>
      </Card>
    </>
  )
}
