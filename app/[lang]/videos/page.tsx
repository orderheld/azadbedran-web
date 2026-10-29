import { notFound } from 'next/navigation'
import { MoreLink, PageHero, SectionHead, VideoGrid } from '@/components/sections'
import { getDict, isLocale } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'
import { getVideos, liveIds } from '@/lib/videos'

export const revalidate = 10800

export async function generateMetadata({ params }: PageProps<'/[lang]/videos'>) {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDict(lang)
  return pageMeta(lang, '/videos', seo[lang].videos.title, seo[lang].videos.description)
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
