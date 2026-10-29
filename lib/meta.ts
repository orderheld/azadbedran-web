import type { Metadata } from 'next'
import type { Locale } from './i18n'

export function pageMeta(lang: Locale, path: string, title: string, description?: string): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: { ku: `/ku${path}`, tr: `/tr${path}`, en: `/en${path}`, ru: `/ru${path}`, 'x-default': `/ku${path}` },
    },
    openGraph: { title, description, url: `/${lang}${path}` },
  }
}
