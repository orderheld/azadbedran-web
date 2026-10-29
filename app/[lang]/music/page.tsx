import { notFound } from 'next/navigation'
import { ChooseButton } from '@/components/Player'
import { CoverImage, TrackList } from '@/components/Release'
import { LatestRelease, PageHero, PlatformStrip, ReleaseGrid, SectionHead } from '@/components/sections'
import { getDict, isLocale } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { getAlbumSongs, getDiscography } from '@/lib/music'
import { credit, toView, typeLabel } from '@/lib/views'

export const revalidate = 21600

export async function generateMetadata({ params }: PageProps<'/[lang]/music'>) {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDict(lang)
  return pageMeta(lang, '/music', t.nav.music, t.music.platformsText)
}

export default async function MusicPage({ params }: PageProps<'/[lang]/music'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  const releases = await getDiscography()
  const albums = releases.filter((r) => r.type !== 'single')
  const singles = releases.filter((r) => r.type === 'single')
  const songs = await Promise.all(albums.map((a) => getAlbumSongs(a.id)))
  const by = 'Azad Bedran'

  return (
    <main>
      <PageHero kicker={t.music.kicker} title={t.music.title} lead={`${t.music.count(releases.length)} · ${t.music.platformsText}`} />
      {releases[0] && (
        <section className="section section-tight">
          <div className="container"><LatestRelease r={toView(releases[0], t)} t={t} /></div>
        </section>
      )}
      <PlatformStrip t={t} />

      <section className="section">
        <div className="container">
          <SectionHead kicker={t.music.kicker} title={t.music.albums} />
          <div className="albums">
            {albums.map((a, i) => {
              const list = (songs[i].length ? songs[i] : a.songs).map((s) => ({
                key: `${a.id}:${s.n}`, n: s.n, ms: s.ms, title: s.title, subtitle: `${a.title} · ${by}`, art: a.art, src: s.preview ?? '', appleUrl: a.appleUrl, deezerUrl: a.deezerUrl,
              }))
              return (
                <article key={a.id} className="album" id={`album-${a.id}`}>
                  <div className="album-cover"><CoverImage art={a.art} title={a.title} sizes="(max-width: 900px) 90vw, 420px" /></div>
                  <div className="album-body">
                    <p className="eyebrow">{typeLabel(a, t)} · {a.date.slice(0, 4)}</p>
                    <h3 className="display">{a.title}</h3>
                    {credit(a, t) && <p className="muted">{credit(a, t)}</p>}
                    {list.length > 0 && <TrackList items={list} labels={{ play: t.player.preview }} />}
                    <ChooseButton item={{ title: a.title, art: a.art, appleUrl: a.appleUrl, deezerUrl: a.deezerUrl }} label={t.choose.title} className="btn btn-primary" />
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <SectionHead kicker={t.music.kicker} title={`${t.music.singles} · ${singles.length}`} />
          <ReleaseGrid items={singles.map((r) => toView(r, t))} t={t} compact />
          <p className="source-note">{t.music.source}</p>
        </div>
      </section>
    </main>
  )
}
