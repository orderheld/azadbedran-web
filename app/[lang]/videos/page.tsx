import { notFound } from 'next/navigation'
import { MoreLink, PageHero, VideoGrid } from '@/components/sections'
import { getDict, isLocale } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { site } from '@/lib/site'
import { getVideos } from '@/lib/videos'

export const revalidate = 10800

export async function generateMetadata({ params }: PageProps<'/[lang]/videos'>) {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDict(lang)
  return pageMeta(lang, '/videos', t.nav.videos, t.videos.title)
}

export default async function VideosPage({ params }: PageProps<'/[lang]/videos'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  const { videos } = await getVideos()
  return (
    <main>
      <PageHero kicker={t.videos.kicker} title={t.videos.title} lead={t.videos.fromChannel} />
      <section className="section section-tight">
        <div className="container">
          <VideoGrid videos={videos} t={t} lang={lang} />
          <div className="btn-row">
            <MoreLink to={site.socials.find((s) => s.id === 'youtube')!.url} label={t.videos.more} external />
            <MoreLink to={site.youtubeSubscribeUrl} label={t.videos.subscribe} external />
          </div>
        </div>
      </section>
    </main>
  )
}
