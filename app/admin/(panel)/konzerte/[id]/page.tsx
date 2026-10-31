import Link from 'next/link'
import { notFound } from 'next/navigation'
import ConfirmButton from '@/components/admin/ConfirmButton'
import MediaInput from '@/components/admin/MediaInput'
import { Card, DbNotice, PageHead } from '@/components/admin/ui'
import { adminConcert } from '@/lib/admin/data'
import { countries } from '@/lib/i18n'
import { hasDb } from '@/lib/db'
import { deleteConcert, saveConcert } from '../../../actions'

export const metadata = { title: 'Konzert bearbeiten' }

const regionNames = new Intl.DisplayNames(['de'], { type: 'region' })

export default async function EditConcert({ params }: PageProps<'/admin/konzerte/[id]'>) {
  const { id } = await params
  const isNew = id === 'neu'
  const c = isNew ? null : await adminConcert(Number(id))
  if (!isNew && !c) notFound()
  const ro = !hasDb()
  const codes = [...new Set([...Object.keys(countries), 'US', 'CA', 'DK', 'NO', 'IT', 'ES', 'GR', 'CY', 'AZ', 'GE', 'UA', 'BY', 'IR', 'SY', 'AU'])]
  return (
    <>
      <PageHead title={isNew ? 'Neues Konzert' : `${c!.city} · ${c!.date.split('-').reverse().join('.')}`}>
        <Link href="/admin/konzerte" className="btn btn-ghost">← Zurück</Link>
      </PageHead>
      <DbNotice />
      <form action={saveConcert} className="form">
        {c && <input type="hidden" name="id" value={c.id} />}
        <div className="form-main">
          <Card title="Termin">
            <div className="row-3">
              <label className="field">Datum *<input type="date" name="date" defaultValue={c?.date} required disabled={ro} /></label>
              <label className="field">Uhrzeit (Beginn/Einlass)<input type="time" name="time" defaultValue={c?.time ?? ''} disabled={ro} /></label>
              <label className="field">Land *
                <select name="country" defaultValue={c?.country ?? 'DE'} disabled={ro}>
                  {codes.sort((a, b) => regionNames.of(a)!.localeCompare(regionNames.of(b)!, 'de')).map((cc) => <option key={cc} value={cc}>{regionNames.of(cc)}</option>)}
                </select>
              </label>
            </div>
            <div className="row-2">
              <label className="field">Stadt *<input name="city" defaultValue={c?.city} required placeholder="z. B. Köln" disabled={ro} /></label>
              <label className="field">Veranstaltungsort<input name="venue" defaultValue={c?.venue ?? ''} placeholder="leer = „wird bekannt gegeben“" disabled={ro} /></label>
            </div>
            <label className="field">Adresse<input name="address" defaultValue={c?.address ?? ''} placeholder="Straße und Nummer" disabled={ro} /></label>
          </Card>
          <Card title="Tickets & Reservierung">
            <label className="field">Ticket-Link<input type="url" name="ticket_url" defaultValue={c?.ticket_url ?? ''} placeholder="https://…" disabled={ro} /></label>
            <label className="field">Telefon für Reservierung<input name="phone" defaultValue={c?.phone ?? ''} placeholder="+49 …" disabled={ro} /></label>
            <p className="hint">Ohne Link und Telefon zeigt die Website „Tickets: bald verfügbar“.</p>
          </Card>
        </div>
        <aside className="form-side">
          <Card title="Veröffentlichen">
            <label className="check"><input type="checkbox" name="published" defaultChecked={c?.published ?? true} disabled={ro} /> Auf der Website zeigen</label>
            <label className="check"><input type="checkbox" name="sold_out" defaultChecked={c?.sold_out ?? false} disabled={ro} /> Ausverkauft</label>
            <div className="btn-row">
              <button className="btn btn-primary" type="submit" disabled={ro}>{isNew ? 'Konzert anlegen' : 'Speichern'}</button>
              {c && <ConfirmButton message="Dieses Konzert wirklich löschen?" disabled={ro} formAction={deleteConcert}>Löschen</ConfirmButton>}
            </div>
          </Card>
          <Card title="Plakat">
            <MediaInput name="poster_url" defaultValue={c?.poster_url} label="Plakat (Hochformat)" disabled={ro} />
          </Card>
        </aside>
      </form>
    </>
  )
}
