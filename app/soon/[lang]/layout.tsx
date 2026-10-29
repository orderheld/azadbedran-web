import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/bodoni-moda/opsz.css'
import '@fontsource-variable/manrope'
import '@fontsource/playfair-display/cyrillic-700.css'
import './soon.css'
import { getDict, htmlLang, isLocale, locales, type Locale } from '@/lib/i18n'
import { site } from '@/lib/site'
import { ogImage, ogLocale } from '@/lib/seo'
import { getDiscography } from '@/lib/music'
import { getConcerts } from '@/lib/content'
import { ArtistJsonLd } from '@/components/sections'

export const generateStaticParams = () => locales.map((lang) => ({ lang }))
export const dynamicParams = false

// Solange die Seite geschützt ist, sehen Google und Link-Vorschauen (WhatsApp, Instagram, Facebook) diese Seite.
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: l } = await params
  const lang: Locale = isLocale(l) ? l : 'ku'
  const t = getDict(lang)
  return {
    metadataBase: new URL(site.url),
    applicationName: site.name,
    title: t.meta.title,
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
      locale: ogLocale[lang],
      alternateLocale: locales.filter((x) => x !== lang).map((x) => ogLocale[x]),
      url: `/${lang}`,
      images: [ogImage(lang)],
    },
    twitter: { card: 'summary_large_image', site: '@azadbedran', title: t.meta.title, description: t.meta.description, images: [ogImage(lang).url] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  }
}
export const viewport: Viewport = { themeColor: '#0f0a07', colorScheme: 'dark' }

export default async function SoonLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang: l } = await params
  const lang: Locale = isLocale(l) ? l : 'ku'
  const [releases, { upcoming }] = await Promise.all([getDiscography(), getConcerts()])
  return (
    <html lang={htmlLang[lang]}>
      <head>
        <ArtistJsonLd upcoming={upcoming} releases={releases} lang={lang} description={getDict(lang).meta.description} />
      </head>
      <body>{children}</body>
    </html>
  )
}
