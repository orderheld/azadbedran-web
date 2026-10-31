'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadImage } from './MediaInput'

// Mehrere Bilder hochladen; optional danach jedes Bild per Server-Action weiterverarbeiten (z. B. in die Galerie)
export default function Uploader({ label = 'Bilder hochladen', onUploaded, disabled }: { label?: string; onUploaded?: (f: FormData) => Promise<void>; disabled?: boolean }) {
  const input = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<string | null>(null)
  const router = useRouter()

  const run = async (files: FileList | null) => {
    if (!files?.length) return
    const list = [...files]
    try {
      for (const [i, f] of list.entries()) {
        setStatus(`Lade ${i + 1} von ${list.length} hoch …`)
        const up = await uploadImage(f)
        if (onUploaded) {
          const form = new FormData()
          form.set('src', up.url)
          form.set('width', String(up.width))
          form.set('height', String(up.height))
          await onUploaded(form)
        }
      }
      setStatus(`${list.length} ${list.length === 1 ? 'Bild' : 'Bilder'} hochgeladen ✓`)
      router.refresh()
    } catch (e) {
      setStatus(`Fehler: ${(e as Error).message}`)
    } finally {
      if (input.current) input.current.value = ''
    }
  }

  return (
    <div
      className="dropzone"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); if (!disabled) run(e.dataTransfer.files) }}
    >
      <p>Bilder hierher ziehen oder</p>
      <button type="button" className="btn btn-primary" onClick={() => input.current?.click()} disabled={disabled}>{label}</button>
      <p className="hint">JPG, PNG oder WebP. Große Fotos werden automatisch auf max. 2400 px verkleinert.</p>
      {status && <p className="dropzone-status" role="status">{status}</p>}
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => run(e.target.files)} />
    </div>
  )
}
