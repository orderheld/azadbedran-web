import { notFound } from 'next/navigation'
import { NewsGrid, PageHero } from '@/components/sections'
import { isLocale } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { seo } from '@/lib/seo'
import { getNews, loadDict } from '@/lib/content'

export const revalidate = 600

export async function generateMetadata({ params }: PageProps<'/[lang]/news'>) {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = await loadDict(lang)
  return pageMeta(lang, '/news', seo[lang].news.title, seo[lang].news.description)
}

export default async function NewsPage({ params }: PageProps<'/[lang]/news'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = await loadDict(lang)
  const news = await getNews(50)
  return (
    <main>
      <PageHero kicker={t.news.kicker} title={t.news.title} />
      <section className="section section-tight">
        <div className="container"><NewsGrid news={news} t={t} lang={lang} /></div>
      </section>
    </main>
  )
}
