import Image from 'next/image'
import Logo from '@/components/Logo'
import { site } from '@/lib/site'

const copy = {
  ku: { kicker: 'Malpera fermî', title: 'Di demeke nêzîk de', text: 'Malpera nû ya Azad Bedran tê amadekirin. Heta wê demê, Azad li ser medyaya civakî bişopîne.', label: 'Têketin', placeholder: 'Şîfre', button: 'Têkeve', error: 'Şîfre ne rast e.' },
  tr: { kicker: 'Resmî web sitesi', title: 'Çok yakında', text: 'Azad Bedran’ın yeni web sitesi hazırlanıyor. O zamana kadar Azad’ı sosyal medyada takip edin.', label: 'Giriş', placeholder: 'Şifre', button: 'Giriş', error: 'Şifre yanlış.' },
  en: { kicker: 'Official website', title: 'Coming soon', text: 'Azad Bedran’s new website is on its way. Until then, follow Azad on social media.', label: 'Login', placeholder: 'Password', button: 'Enter', error: 'Wrong password.' },
  ru: { kicker: 'Официальный сайт', title: 'Скоро открытие', text: 'Новый сайт Азада Бедрана скоро появится. А пока следите за Азадом в социальных сетях.', label: 'Вход', placeholder: 'Пароль', button: 'Войти', error: 'Неверный пароль.' },
} as const
type Lang = keyof typeof copy
const names: Record<Lang, string> = { ku: 'Kurmancî', tr: 'Türkçe', en: 'English', ru: 'Русский' }

export default async function Soon({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ error?: string }> }) {
  const [{ lang: l }, sp] = await Promise.all([params, searchParams])
  const lang: Lang = l in copy ? (l as Lang) : 'ku'
  const t = copy[lang]

  return (
    <main className="soon" lang={lang}>
      <div className="soon-photo" aria-hidden>
        <Image src="/images/azad-studio.jpg" alt="" fill priority sizes="(max-width: 900px) 100vw, 62vw" />
      </div>

      <header className="soon-top">
        <nav className="soon-lang" aria-label="Language">
          {(Object.keys(copy) as Lang[]).map((l) => (
            <a key={l} href={`/${l}`} hrefLang={l} aria-current={l === lang ? 'true' : undefined}>{names[l]}</a>
          ))}
        </nav>
      </header>

      <section className="soon-body">
        <p className="caps soon-kicker">{t.kicker}</p>
        <h1><Logo variant="stacked" className="soon-logo" /></h1>
        <div className="soon-rule" aria-hidden><span /></div>
        <p className="caps soon-title">{t.title}</p>
        <p className="soon-text">{t.text}</p>
        <ul className="soon-social">
          {site.socials.map((s) => (
            <li key={s.id}><a className="caps" href={s.url} target="_blank" rel="noopener">{s.label}</a></li>
          ))}
        </ul>
      </section>

      <form className="soon-login" method="post" action="/api/unlock">
        <input type="hidden" name="lang" value={lang} />
        <label className="caps" htmlFor="pw">{t.label}</label>
        <div className="soon-field">
          <input id="pw" name="password" type="password" inputMode="numeric" autoComplete="current-password" placeholder={t.placeholder} required />
          <button className="caps" type="submit">{t.button}</button>
        </div>
        {sp.error && <p className="soon-error" role="alert">{t.error}</p>}
      </form>

      <p className="soon-credit">Webdesign by <a href="https://webnova.ch" target="_blank" rel="noopener">Webnova</a></p>
    </main>
  )
}
