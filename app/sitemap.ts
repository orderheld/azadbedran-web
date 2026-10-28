import type { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n'
import { href, pages } from '@/lib/routes'
import { site } from '@/lib/site'
import { getNews } from '@/lib/content'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getNews(200)
  const paths = [
    ...[undefined, ...pages].map((p) => (l: (typeof locales)[number]) => href(l, p)),
    ...news.map((n) => (l: (typeof locales)[number]) => `${href(l, 'news')}/${n.id}`),
  ]
  return paths.flatMap((path) =>
    locales.map((l) => ({
      url: `${site.url}${path(l)}`,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${site.url}${path(x)}`])) },
    })),
  )
}
