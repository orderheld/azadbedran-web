import Logo from './Logo'

// 404 in allen vier Sprachen (die gesuchte Sprache ist bei falschen Adressen nicht sicher bekannt)
const texts = [
  { lang: 'ku', title: 'Rûpel nehat dîtin', text: 'Ev rûpel tune ye an hatiye guhertin.', home: 'Vegere destpêkê' },
  { lang: 'tr', title: 'Sayfa bulunamadı', text: 'Bu sayfa mevcut değil veya taşınmış.', home: 'Ana sayfaya dön' },
  { lang: 'en', title: 'Page not found', text: 'This page doesn’t exist or has moved.', home: 'Back to home' },
  { lang: 'ru', title: 'Страница не найдена', text: 'Такой страницы нет или она была перемещена.', home: 'На главную' },
] as const

export default function NotFoundView({ standalone = false }: { standalone?: boolean }) {
  return (
    <main className="nf container" id={standalone ? 'main' : undefined}>
      {standalone && (
        <a href="/ku" className="nf-logo" aria-label="Azad Bedran">
          <Logo variant="horizontal" />
        </a>
      )}
      <p className="nf-code" aria-hidden="true">404</p>
      <h1 className="nf-title">{texts[0].title}</h1>
      <p className="nf-text">{texts[0].text}</p>
      <ul className="nf-list">
        {texts.map((t) => (
          <li key={t.lang} lang={t.lang}>
            {t.lang !== 'ku' && <span className="nf-alt">{t.title}</span>}
            <a className="btn btn-ghost btn-sm" href={`/${t.lang}`}>{t.home} <span aria-hidden="true">→</span></a>
          </li>
        ))}
      </ul>
    </main>
  )
}
