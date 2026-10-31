'use client'
import { useRef, useState } from 'react'

// Bild-Feld: URL eintragen oder Datei hochladen (wird im Browser verkleinert, dann gespeichert)
export async function uploadImage(file: File, maxSize = 2400): Promise<{ url: string; width: number; height: number }> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  let blob: Blob = file
  if (scale < 1 || file.size > 1_500_000 || !/jpe?g|png|webp/.test(file.type)) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height)
    blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), 'image/jpeg', 0.86))
  }
  const name = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'bild'
  const body = new FormData()
  body.append('file', blob, `${name}.${blob.type === 'image/png' ? 'png' : blob.type === 'image/webp' ? 'webp' : 'jpg'}`)
  body.append('width', String(width))
  body.append('height', String(height))
  const res = await fetch('/admin/api/upload', { method: 'POST', body })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Upload fehlgeschlagen')
  return { url: json.url, width, height }
}

export default function MediaInput({ name, defaultValue, label, disabled }: { name: string; defaultValue?: string | null; label: string; disabled?: boolean }) {
  const [value, setValue] = useState(defaultValue ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const file = useRef<HTMLInputElement>(null)

  const onFile = async (f: File | undefined) => {
    if (!f) return
    setBusy(true)
    setError(null)
    try {
      setValue((await uploadImage(f)).url)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
      if (file.current) file.current.value = ''
    }
  }

  return (
    <div className="field media-input">
      <span className="field-label">{label}</span>
      <div className="media-row">
        {value ? <img src={value} alt="" className="media-thumb" /> : <span className="media-thumb is-empty">Kein Bild</span>}
        <div className="media-ctrl">
          <input type="text" name={name} value={value} onChange={(e) => setValue(e.target.value)} placeholder="/images/… oder https://…" disabled={disabled} />
          <div className="btn-row">
            <button type="button" className="btn btn-small" onClick={() => file.current?.click()} disabled={busy || disabled}>{busy ? 'Lädt hoch …' : 'Bild hochladen'}</button>
            {value && <button type="button" className="btn btn-small btn-ghost" onClick={() => setValue('')} disabled={disabled}>Entfernen</button>}
          </div>
          {error && <p className="field-error">{error}</p>}
        </div>
      </div>
      <input ref={file} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
    </div>
  )
}
