'use client'

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="card">
      <h1>Das hat nicht geklappt</h1>
      <p className="notice notice-error">{error.message || 'Unbekannter Fehler'}</p>
      <p className="muted">Prüfe die Eingaben und versuche es noch einmal. Wenn der Fehler bleibt, ist die Datenbank eventuell nicht erreichbar.</p>
      <button className="btn" onClick={reset}>Nochmal versuchen</button>
    </div>
  )
}
