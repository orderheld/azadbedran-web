import { notFound } from 'next/navigation'
import { NewsGrid, PageIntro } from '@/components/sections'
import { getDict, isLocale } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { getNews, getReleases } from '@/lib/content'

export const revalidate = 300

export async function generateMetadata({ params }: PageProps<'/[lang]/news'>) {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDict(lang)
  return pageMeta(lang, '/news', t.nav.news, t.news.title)
}

export default async function NewsPage({ params }: PageProps<'/[lang]/news'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  const [news, releases] = await Promise.all([getNews(50), getReleases()])

  return (
    <main>
      <PageIntro kicker={t.news.kicker} title={t.news.title} />
      <section className="section section-tight">
        <div className="container">
          <NewsGrid news={news} t={t} lang={lang} latestCover={releases[0]?.cover} />
        </div>
      </section>
    </main>
  )
}
