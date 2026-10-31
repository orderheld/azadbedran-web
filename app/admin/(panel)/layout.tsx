import Nav from '@/components/admin/Nav'
import { requireAdmin } from '@/lib/admin/session'
import { logout, setupDb } from '../actions'
import { dbReady, hasDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function Panel({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  const needsSetup = hasDb() && !(await dbReady())
  return (
    <div className="adm-shell">
      <Nav />
      <div className="adm-main">
        <div className="adm-topbar">
          <a href="/ku" target="_blank" rel="noopener">Website ansehen ↗</a>
          <form action={logout}>
            <button type="submit" className="linklike">Abmelden</button>
          </form>
        </div>
        <div className="adm-content">
          {needsSetup ? (
            <section className="card">
              <h1>Datenbank einrichten</h1>
              <p>Die Datenbank ist verbunden, aber die Tabellen für Inhalte und Statistik fehlen noch. Ein Klick legt sie an und übernimmt die bisherigen Konzerte, News, Videos und Galerie-Fotos. Bestehende Daten bleiben erhalten.</p>
              <form action={setupDb}><button className="btn btn-primary">Datenbank jetzt einrichten</button></form>
            </section>
          ) : children}
        </div>
      </div>
    </div>
  )
}
