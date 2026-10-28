import { notFound } from 'next/navigation'
import { AlbumGrid, LatestRelease, PageIntro, SingleGrid, StreamBuyBand } from '@/components/sections'
import { getDict, isLocale } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { getReleases } from '@/lib/content'

export const revalidate = 3600

export async function generateMetadata({ params }: PageProps<'/[lang]/music'>) {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDict(lang)
  return pageMeta(lang, '/music', t.nav.music, t.music.previewText)
}

export default async function MusicPage({ params }: PageProps<'/[lang]/music'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  const releases = await getReleases()
  const albums = releases.filter((r) => r.type !== 'single')
  const singles = releases.filter((r) => r.type === 'single')

  return (
    <main>
      <PageIntro kicker={t.music.kicker} title={t.music.title} />
      <section className="section section-tight">
        <div className="container">
          {releases[0] && <LatestRelease latest={releases[0]} t={t} lang={lang} />}
          <h2 className="sub-head">{t.music.albums}</h2>
          <AlbumGrid albums={albums} t={t} />
          <h2 className="sub-head">{t.music.singles}</h2>
          <SingleGrid singles={singles} />
        </div>
      </section>
      <StreamBuyBand t={t} />
    </main>
  )
}
