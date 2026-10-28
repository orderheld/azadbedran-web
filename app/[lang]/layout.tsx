import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/500.css'
import '@fontsource/playfair-display/400-italic.css'
import '@fontsource-variable/manrope'
import '../globals.css'
import { getDict, htmlLang, isLocale, locales } from '@/lib/i18n'
import { site } from '@/lib/site'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const generateStaticParams = () => locales.map((lang) => ({ lang }))
export const dynamicParams = false

export const viewport: Viewport = { themeColor: '#0b0a09', colorScheme: 'dark' }

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
      languages: { ku: '/ku', tr: '/tr', en: '/en', 'x-default': '/ku' },
    },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: t.meta.title,
      description: t.meta.description,
      locale: lang === 'tr' ? 'tr_TR' : lang === 'en' ? 'en_US' : 'ku_TR',
      url: `/${lang}`,
      images: site.heroImage ? [{ url: site.heroImage }] : undefined,
    },
    twitter: { card: 'summary_large_image', site: '@azadbedran' },
  }
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  return (
    <html lang={htmlLang[lang]}>
      <body>
        <Header lang={lang} nav={t.nav} />
        {children}
        <Footer lang={lang} t={t} />
      </body>
    </html>
  )
}
