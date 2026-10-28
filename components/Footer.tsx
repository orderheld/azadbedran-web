import Link from 'next/link'
import { type Dict, type Locale } from '@/lib/i18n'
import { site } from '@/lib/site'

export default function Footer({ lang, t }: { lang: Locale; t: Dict }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-mark">Azad <em>Bedran</em></p>
          <p className="muted small">© {new Date().getFullYear()} Azad Bedran. {t.footer.rights}</p>
        </div>
        <ul className="footer-social">
          {site.socials.map((s) => <li key={s.id}><a href={s.url} target="_blank" rel="noopener">{s.label}</a></li>)}
        </ul>
        <ul className="footer-legal">
          <li><Link href={`/${lang}/impressum`}>{t.footer.imprint}</Link></li>
          <li><Link href={`/${lang}/datenschutz`}>{t.footer.privacy}</Link></li>
        </ul>
      </div>
      <div className="flag-line" />
    </footer>
  )
}
