import { notFound } from 'next/navigation'
import { ArrowUpRight } from '@/components/Icons'
import { PageIntro, VideoGrid } from '@/components/sections'
import { getDict, isLocale } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { site } from '@/lib/site'

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
  return (
    <main>
      <PageIntro kicker={t.videos.kicker} title={t.videos.title} />
      <section className="section section-tight">
        <div className="container">
          <VideoGrid t={t} />
          <div className="video-cta">
            <a className="btn btn-red" href={site.youtubeSubscribeUrl} target="_blank" rel="noopener">{t.stream.subscribe}</a>
            <a className="link-arrow" href={site.socials[1].url} target="_blank" rel="noopener">{t.videos.more} <ArrowUpRight size={14} /></a>
          </div>
        </div>
      </section>
    </main>
  )
}
