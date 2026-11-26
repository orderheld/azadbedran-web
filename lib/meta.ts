import type { Metadata } from 'next'
import type { Locale } from './i18n'
import { locales } from './i18n'
import { site } from './site'
import { ogImage, ogLocale } from './seo'

type Image = { url: string; width?: number; height?: number; alt?: string }

export function pageMeta(lang: Locale, path: string, title: string, description?: string, image?: Image, type: 'website' | 'article' = 'website'): Metadata {
  const images = [image ?? ogImage(lang)]
  // Kein doppeltes „Azad Bedran“, wenn der Titel den Namen schon enthält (z. B. News)
  const full = title.includes(site.name) ? title : `${title} – ${site.name}`
  return {
    title: { absolute: full },
    description,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: { ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])), 'x-default': `/ku${path}` },
    },
    openGraph: {
      type,
      siteName: site.name,
      title: full,
      description,
      url: `/${lang}${path}`,
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      images,
    },
    twitter: { card: 'summary_large_image', site: '@azadbedran', creator: '@azadbedran', title: full, description, images: images.map((i) => i.url) },
  }
}
