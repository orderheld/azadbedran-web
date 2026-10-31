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
  const latestNews = news[0]?.date
  type P = { path: (l: (typeof locales)[number]) => string; modified?: string }
  const paths: P[] = gated ? [{ path: (l) => href(l) }] : [
    ...[undefined, ...pages].map((p): P => ({ path: (l) => href(l, p), modified: p === 'news' ? latestNews : undefined })),
    ...news.map((n): P => ({ path: (l) => `${href(l, 'news')}/${n.id}`, modified: n.date })),
  ]
  return paths.flatMap(({ path, modified }) =>
    locales.map((l) => ({
      url: `${site.url}${path(l)}`,
      lastModified: modified ? new Date(modified) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: path(l) === href(l) ? 1 : 0.7,
      alternates: { languages: { ...Object.fromEntries(locales.map((x) => [x, `${site.url}${path(x)}`])), 'x-default': `${site.url}${path('ku')}` } },
    })),
  )
}
