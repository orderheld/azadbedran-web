import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Cover from '@/components/Cover'
import { ArrowUpRight } from '@/components/Icons'
import { stripQuotes } from '@/components/sections'
import { formatDate, getDict, isLocale, locales } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { href } from '@/lib/routes'
import { getNews, getNewsItem } from '@/lib/content'

export const revalidate = 300
export const dynamicParams = true

export async function generateStaticParams() {
  const news = await getNews(50)
  return locales.flatMap((lang) => news.map((n) => ({ lang, id: String(n.id) })))
}

export async function generateMetadata({ params }: PageProps<'/[lang]/news/[id]'>) {
  const { lang, id } = await params
  if (!isLocale(lang)) return {}
  const item = await getNewsItem(Number(id))
  if (!item) return {}
  return pageMeta(lang, `/news/${id}`, item.title[lang], item.body[lang].slice(0, 160))
}

export default async function NewsArticle({ params }: PageProps<'/[lang]/news/[id]'>) {
  const { lang, id } = await params
  if (!isLocale(lang)) notFound()
  const item = await getNewsItem(Number(id))
  if (!item) notFound()
  const t = getDict(lang)

  return (
    <main className="article">
      <div className="container article-inner">
        <Link href={href(lang, 'news')} className="link-arrow">← {t.more.back}</Link>
        <p className="eyebrow article-date">{formatDate(item.date, lang)}</p>
        <h1 className="display-md">{item.title[lang]}</h1>
        <div className="article-media">
          {item.image ? <Image src={item.image} alt="" fill sizes="(max-width: 900px) 100vw, 860px" priority /> : <Cover title={stripQuotes(item.title[lang])} src={null} sizes="860px" />}
        </div>
        <div className="article-body">
          {item.body[lang].split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)}
        </div>
        {item.link && <a className="btn btn-gold" href={item.link} target="_blank" rel="noopener">{t.news.more} <ArrowUpRight size={14} /></a>}
      </div>
    </main>
  )
}
