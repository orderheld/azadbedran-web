import Link from 'next/link'
import { type Dict, type Locale } from '@/lib/i18n'
import { href, pages } from '@/lib/routes'
import { manager, site, streamingPlatforms, telUrl, whatsappUrl } from '@/lib/site'
import Logo from './Logo'

export default function Footer({ lang, t }: { lang: Locale; t: Dict }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <Link href={href(lang)} className="footer-logo" aria-label="Azad Bedran"><Logo variant="stacked" /></Link>
          <div className="footer-cols">
            <div>
              <p className="eyebrow">{t.home}</p>
              <ul>{pages.map((p) => <li key={p}><Link href={href(lang, p)}>{t.nav[p]}</Link></li>)}</ul>
            </div>
            <div>
              <p className="eyebrow">{t.platforms}</p>
              <ul>{streamingPlatforms().map((p) => <li key={p.id}><a href={p.url} target="_blank" rel="noopener">{p.label}</a></li>)}</ul>
            </div>
            <div>
              <p className="eyebrow">{t.contact.follow}</p>
              <ul>{site.socials.map((s) => <li key={s.id}><a href={s.url} target="_blank" rel="noopener">{s.label}</a></li>)}</ul>
            </div>
            <div>
              <p className="eyebrow">{t.contact.role}</p>
              <ul>
                <li>{manager.name}</li>
                <li><a href={telUrl}>{manager.phone}</a></li>
                <li><a href={whatsappUrl} target="_blank" rel="noopener">{t.contact.whatsapp}</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Azad Bedran. {t.footer.rights}</p>
          <p>
            <Link href={`/${lang}/impressum`}>{t.footer.imprint}</Link>
            <Link href={`/${lang}/datenschutz`}>{t.footer.privacy}</Link>
          </p>
          <p className="credit">Webdesign bei <a href="https://webnova.ch" target="_blank" rel="noopener">Webnova</a></p>
        </div>
      </div>
    </footer>
  )
}
