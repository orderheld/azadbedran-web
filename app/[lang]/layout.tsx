import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import '@fontsource-variable/bodoni-moda/opsz.css'
import '@fontsource-variable/manrope'
import '@fontsource/playfair-display/cyrillic-500.css'
import '../globals.css'
import { getDict, htmlLang, isLocale, locales } from '@/lib/i18n'
import { site } from '@/lib/site'
import { getDiscography } from '@/lib/music'
import { latestQueue } from '@/lib/views'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { PlayerProvider } from '@/components/Player'
import NextShowPopup from '@/components/NextShowPopup'
import { getConcerts } from '@/lib/content'
import { daysUntil } from '@/components/sections'
import { countryName, dateParts } from '@/lib/i18n'
import { href } from '@/lib/routes'

export const generateStaticParams = () => locales.map((lang) => ({ lang }))
export const dynamicParams = false
export const revalidate = 21600

export const viewport: Viewport = { themeColor: '#0f0a07', colorScheme: 'dark' }

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDict(lang)
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.title, template: `%s – ${site.name}` },
    description: t.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { ku: '/ku', tr: '/tr', en: '/en', ru: '/ru', 'x-default': '/ku' },
    },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: t.meta.title,
      description: t.meta.description,
      locale: { ku: 'ku_TR', tr: 'tr_TR', en: 'en_US', ru: 'ru_RU' }[lang],
      url: `/${lang}`,
      images: [{ url: '/og.jpg', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', site: '@azadbedran' },
  }
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  const [releases, { upcoming }] = await Promise.all([getDiscography(), getConcerts()])
  const next = upcoming[0]
  const d = next && dateParts(next.date, lang)
  return (
    <html lang={htmlLang[lang]}>
      <head>
        <link rel="preconnect" href="https://is1-ssl.mzstatic.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
      </head>
      <body>
        <a className="skip-link" href="#main">{t.skip}</a>
        <PlayerProvider queue={latestQueue(releases)} t={{ player: t.player, choose: t.choose }}>
          <Header lang={lang} t={{ nav: t.nav, menu: t.menu, close: t.close, home: t.home }} />
          <div id="main">{children}</div>
          <Footer lang={lang} t={t} />
          {next && d && (
            <NextShowPopup
              show={{
                id: next.id, day: d.day, month: `${d.month} ${d.year}`, weekday: d.weekday, city: next.city,
                place: `${next.venue ?? t.concerts.venueTba} · ${countryName(next.country, lang)}`, time: next.time,
                poster: next.poster, ticketUrl: next.ticketUrl, phone: next.phone, countdown: t.concerts.daysLeft(daysUntil(next.date)),
              }}
              infoHref={href(lang, 'concerts')}
              t={{ next: t.concerts.next, tickets: t.concerts.tickets, reserve: t.concerts.reserve, ticketsSoon: t.concerts.ticketsSoon, info: t.concerts.info, close: t.close, doors: t.concerts.doors }}
            />
          )}
        </PlayerProvider>
      </body>
    </html>
  )
}
