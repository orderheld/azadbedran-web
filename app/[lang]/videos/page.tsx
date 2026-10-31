import { notFound } from 'next/navigation'
import { MoreLink, PageHero, SectionHead, VideoGrid } from '@/components/sections'
import { isLocale } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'
import { getVideos } from '@/lib/videos'
import { loadDict } from '@/lib/content'

export const revalidate = 10800

export async function generateMetadata({ params }: PageProps<'/[lang]/videos'>) {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = await loadDict(lang)
  return pageMeta(lang, '/videos', seo[lang].videos.title, seo[lang].videos.description)
}

export default async function VideosPage({ params }: PageProps<'/[lang]/videos'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = await loadDict(lang)
  const { videos, liveIds } = await getVideos()
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: videos.filter((v) => v.date).slice(0, 30).map((v, i) => ({
          '@type': 'VideoObject',
          position: i + 1,
          name: `${v.title} – Azad Bedran`,
          description: `${v.title} – Azad Bedran (YouTube)`,
          thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
          uploadDate: v.date,
          contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
          embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
        })),
      }).replace(/</g, '\\u003c') }} />
      <PageHero kicker={t.videos.kicker} title={t.videos.title} lead={t.videos.fromChannel} />
      <section className="section section-tight">
        <div className="container">
          <VideoGrid videos={videos.filter((v) => !liveIds.has(v.id))} t={t} lang={lang} />
          <div className="sub-section">
            <SectionHead kicker={t.videos.kicker} title={t.concerts.title} />
            <VideoGrid videos={videos.filter((v) => liveIds.has(v.id))} t={t} lang={lang} feature={false} />
          </div>
          <div className="btn-row">
            <MoreLink to={site.socials.find((s) => s.id === 'youtube')!.url} label={t.videos.more} external />
            <MoreLink to={site.youtubeSubscribeUrl} label={t.videos.subscribe} external />
          </div>
        </div>
      </section>
    </main>
  )
}
