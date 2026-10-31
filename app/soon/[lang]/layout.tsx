import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/bodoni-moda/opsz.css'
import '@fontsource-variable/manrope'
import '@fontsource/playfair-display/cyrillic-700.css'
import './soon.css'
import { htmlLang, isLocale, locales, type Locale } from '@/lib/i18n'
import { site } from '@/lib/site'
import { ogImage, ogLocale } from '@/lib/seo'
import { getDiscography } from '@/lib/music'
import { getConcerts, loadDict } from '@/lib/content'
import { ArtistJsonLd } from '@/components/sections'
import Analytics from '@/components/Analytics'

export const generateStaticParams = () => locales.map((lang) => ({ lang }))
export const dynamicParams = false

// Solange die Seite geschützt ist, sehen Google und Link-Vorschauen (WhatsApp, Instagram, Facebook) diese Seite.
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: l } = await params
  const lang: Locale = isLocale(l) ? l : 'ku'
  const t = await loadDict(lang)
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
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
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
        <ArtistJsonLd upcoming={upcoming} releases={releases} lang={lang} description={(await loadDict(lang)).meta.description} />
      </head>
      <body>{children}<Analytics /></body>
    </html>
  )
}
