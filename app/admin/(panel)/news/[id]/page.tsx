import Link from 'next/link'
import { notFound } from 'next/navigation'
import ConfirmButton from '@/components/admin/ConfirmButton'
import LangTabs from '@/components/admin/LangTabs'
import MediaInput from '@/components/admin/MediaInput'
import { Card, DbNotice, PageHead } from '@/components/admin/ui'
import { adminNews } from '@/lib/admin/data'
import { hasDb } from '@/lib/db'
import { locales } from '@/lib/i18n'
import { deleteNews, saveNews } from '../../../actions'

export const metadata = { title: 'Beitrag bearbeiten' }

export default async function EditNews({ params }: PageProps<'/admin/news/[id]'>) {
  const { id } = await params
  const isNew = id === 'neu'
  const n = isNew ? null : (await adminNews()).find((x) => x.id === Number(id))
  if (!isNew && !n) notFound()
  const ro = !hasDb()
  const panels = Object.fromEntries(
    locales.map((l) => [
      l,
      <div key={l}>
        <label className="field">Titel{l === 'ku' ? ' *' : ''}<input name={`title_${l}`} defaultValue={n?.[`title_${l}`] ?? ''} required={l === 'ku'} disabled={ro} dir="auto" /></label>
        <label className="field">Text<textarea name={`body_${l}`} defaultValue={n?.[`body_${l}`] ?? ''} rows={10} disabled={ro} dir="auto" /></label>
      </div>,
    ]),
  )
  return (
    <>
      <PageHead title={isNew ? 'Neuer Beitrag' : 'Beitrag bearbeiten'}>
        {n && <a className="btn btn-ghost" href={`/ku/news/${n.id}`} target="_blank" rel="noopener">Ansehen ↗</a>}
        <Link href="/admin/news" className="btn btn-ghost">← Zurück</Link>
      </PageHead>
      <DbNotice />
      <form action={saveNews} className="form">
        {n && <input type="hidden" name="id" value={n.id} />}
        <div className="form-main">
          <Card title="Inhalt">
            <LangTabs panels={panels} filled={n ? Object.fromEntries(locales.map((l) => [l, !!(n[`title_${l}`] && n[`body_${l}`])])) : undefined} />
          </Card>
        </div>
        <aside className="form-side">
          <Card title="Veröffentlichen">
            <label className="field">Datum<input type="date" name="date" defaultValue={n?.date ?? new Date().toISOString().slice(0, 10)} disabled={ro} /></label>
            <label className="check"><input type="checkbox" name="published" defaultChecked={n?.published ?? true} disabled={ro} /> Auf der Website zeigen</label>
            <div className="btn-row">
              <button className="btn btn-primary" type="submit" disabled={ro}>{isNew ? 'Veröffentlichen' : 'Speichern'}</button>
              {n && <ConfirmButton message="Diesen Beitrag wirklich löschen?" disabled={ro} formAction={deleteNews}>Löschen</ConfirmButton>}
            </div>
          </Card>
          <Card title="Bild">
            <MediaInput name="image_url" defaultValue={n?.image_url} label="Beitragsbild" disabled={ro} />
          </Card>
          <Card title="Link (optional)">
            <label className="field">Weiterführender Link<input type="url" name="link_url" defaultValue={n?.link_url ?? ''} placeholder="https://…" disabled={ro} /></label>
          </Card>
        </aside>
      </form>
    </>
  )
}
