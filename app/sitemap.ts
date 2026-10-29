import type { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n'
import { href, pages } from '@/lib/routes'
import { site } from '@/lib/site'
import { getNews } from '@/lib/content'
import { gateEnabled } from '@/lib/gate'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Solange der Passwortschutz aktiv ist, gibt es nur die Startseite je Sprache
  const gated = gateEnabled()
  const news = gated ? [] : await getNews(200)
  const paths = gated ? [(l: (typeof locales)[number]) => href(l)] : [
    ...[undefined, ...pages].map((p) => (l: (typeof locales)[number]) => href(l, p)),
    ...news.map((n) => (l: (typeof locales)[number]) => `${href(l, 'news')}/${n.id}`),
  ]
  return paths.flatMap((path) =>
    locales.map((l) => ({
      url: `${site.url}${path(l)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path(l) === href(l) ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${site.url}${path(x)}`])) },
    })),
  )
}
