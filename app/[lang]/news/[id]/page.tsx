import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight } from '@/components/Icons'
import { formatDate, isLocale, locales } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { shareLabels } from '@/lib/seo'
import { site } from '@/lib/site'
import ShareButton from '@/components/ShareButton'
import { href } from '@/lib/routes'
import { getNews, getNewsItem, loadDict } from '@/lib/content'

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
  const text = item.body[lang].replace(/\s+/g, ' ')
  const description = text.length > 160 ? `${text.slice(0, 157).replace(/\s\S*$/, '')}…` : text
  return pageMeta(lang, `/news/${id}`, item.title[lang], description, item.image ? { url: item.image, alt: item.title[lang] } : undefined, 'article')
}

export default async function NewsArticle({ params }: PageProps<'/[lang]/news/[id]'>) {
  const { lang, id } = await params
  if (!isLocale(lang)) notFound()
  const item = await getNewsItem(Number(id))
  if (!item) notFound()
  const t = await loadDict(lang)

  return (
    <main className="article">
      <div className="container article-inner">
        <Link href={href(lang, 'news')} className="link-arrow">← {t.news.back}</Link>
        <p className="eyebrow article-date">{formatDate(item.date, lang)}</p>
        <h1 className="display">{item.title[lang]}</h1>
        {item.image && <div className="article-media">
          <Image src={item.image} alt="" fill sizes="(max-width: 900px) 100vw, 640px" priority />
        </div>}
        <div className="article-body">
          {item.body[lang].split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="btn-row">
          {item.link && <a className="btn btn-primary" href={item.link} target="_blank" rel="noopener">{t.news.read} <ArrowUpRight size={14} /></a>}
          <ShareButton url={`/${lang}/news/${id}`} title={item.title[lang]} label={shareLabels[lang].share} copied={shareLabels[lang].copied} />
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: item.title[lang],
          datePublished: item.date,
          inLanguage: lang,
          mainEntityOfPage: `${site.url}/${lang}/news/${id}`,
          ...(item.image ? { image: [item.image.startsWith('http') ? item.image : `${site.url}${item.image}`] } : {}),
          author: { '@type': 'MusicGroup', '@id': `${site.url}/#artist`, name: site.name },
          publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: `${site.url}/icon-512.png` } },
        }).replace(/</g, '\\u003c') }} />
      </div>
    </main>
  )
}
