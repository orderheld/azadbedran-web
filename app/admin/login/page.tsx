import { redirect } from 'next/navigation'
import { login } from '../actions'
import { isAdmin } from '@/lib/admin/session'
import { adminConfigured } from '@/lib/admin/token'

export const metadata = { title: 'Anmelden' }

export default async function Login({ searchParams }: PageProps<'/admin/login'>) {
  if (await isAdmin()) redirect('/admin')
  const { error } = await searchParams
  const configured = adminConfigured()
  return (
    <main className="login">
      <form action={login} className="login-box">
        <p className="login-logo">Azad Bedran</p>
        <h1>Admin-Bereich</h1>
        {!configured ? (
          <p className="notice notice-warn">
            Der Admin-Bereich ist noch nicht eingerichtet. Lege in Vercel unter <b>Settings → Environment Variables</b> die Variable <code>ADMIN_PASSWORD</code> an (mindestens 8 Zeichen) und starte ein neues Deployment.
          </p>
        ) : (
          <>
            {error && <p className="notice notice-error">Passwort falsch. Bitte noch einmal versuchen.</p>}
            <label>
              Passwort
              <input type="password" name="password" autoComplete="current-password" autoFocus required />
            </label>
            <button className="btn btn-primary btn-block" type="submit">Anmelden</button>
          </>
        )}
        <a className="login-back" href="/">← Zur Website</a>
      </form>
    </main>
  )
}
