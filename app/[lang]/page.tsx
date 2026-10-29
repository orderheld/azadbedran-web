import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Logo from '@/components/Logo'
import { PlayButton } from '@/components/Player'
import { ArrowRight } from '@/components/Icons'
import {
  ConcertList, Facts, LatestRelease, ManagerCard, MoreLink, NewsGrid, NextShow, PlatformStrip, ReleaseGrid, Rule, SectionHead, VideoGrid, daysUntil,
} from '@/components/sections'
import { dateParts, getDict, isLocale } from '@/lib/i18n'
import { href } from '@/lib/routes'
import { images, site } from '@/lib/site'
import { getConcerts, getNews } from '@/lib/content'
import { getDiscography } from '@/lib/music'
import { getVideos } from '@/lib/videos'
import { latestQueue, toView } from '@/lib/views'

export const revalidate = 21600

export default async function Home({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)

  const [{ upcoming }, news, releases, { videos }] = await Promise.all([getConcerts(), getNews(3), getDiscography(), getVideos()])
  const latest = releases[0]
  const albums = releases.filter((r) => r.type !== 'single')
  const singles = releases.filter((r) => r.type === 'single' && r.id !== latest?.id).slice(0, 5)
  const next = upcoming[0]
  const queue = latestQueue(releases)

  return (
    <main className="home">

      <section className="hero">
        <div className="hero-img" aria-hidden>
          <Image src={images.hero.src} alt="" fill priority quality={82} sizes="100vw" />
        </div>
        <div className="container hero-inner">
          <p className="eyebrow hero-kicker">{t.hero.kicker}</p>
          <h1 className="hero-logo"><Logo variant="stacked" title="Azad Bedran" /></h1>
          <Rule />
          <p className="hero-tagline">{t.hero.tagline}</p>
          <div className="btn-row">
            <PlayButton items={queue} label={`${t.hero.listen}${latest ? ` · ${latest.title}` : ''}`} />
            <Link className="btn btn-ghost" href={href(lang, 'concerts')}>{t.hero.concerts} <ArrowRight size={16} /></Link>
          </div>
        </div>
        {next && (
          <Link href={href(lang, 'concerts')} className="hero-next">
            <span className="eyebrow">{t.hero.nextShow}</span>
            <span className="hero-next-main">{dateParts(next.date, lang).day} {dateParts(next.date, lang).month} · {next.city}</span>
            <span className="pill">{t.concerts.daysLeft(daysUntil(next.date))}</span>
          </Link>
        )}
      </section>

      <PlatformStrip t={t} />

      {latest && (
        <section className="section">
          <div className="container">
            <LatestRelease r={toView(latest, t)} t={t} />
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="section section-tour">
          <div className="container">
            <SectionHead kicker={t.concerts.kicker} title={t.concerts.upcoming} />
            <NextShow c={next} t={t} lang={lang} />
            {upcoming.length > 1 && <ConcertList concerts={upcoming.slice(1)} t={t} lang={lang} />}
            <MoreLink to={href(lang, 'concerts')} label={t.concerts.more} />
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <SectionHead kicker={t.music.kicker} title={t.music.albums} />
          <ReleaseGrid items={albums.map((r) => toView(r, t))} t={t} />
          <h3 className="sub-head">{t.music.singles}</h3>
          <ReleaseGrid items={singles.map((r) => toView(r, t))} t={t} compact />
          <MoreLink to={href(lang, 'music')} label={`${t.music.more} · ${t.music.count(releases.length)}`} />
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <SectionHead kicker={t.videos.kicker} title={t.videos.title} />
          <VideoGrid videos={videos.slice(0, 3)} t={t} lang={lang} feature={false} />
          <div className="btn-row">
            <MoreLink to={href(lang, 'videos')} label={t.nav.videos} />
            <MoreLink to={site.youtubeSubscribeUrl} label={t.videos.subscribe} external />
          </div>
        </div>
      </section>

      <section className="section bio-teaser">
        <div className="container bio-teaser-grid">
          <div className="bio-teaser-img">
            <Image src={images.portrait.src} alt="Azad Bedran" fill sizes="(max-width: 900px) 90vw, 480px" />
          </div>
          <div>
            <SectionHead kicker={t.bio.kicker} title={t.bio.title}>
              <p className="lead">{t.bio.lead}</p>
            </SectionHead>
            <p>{t.bio.sections[0].p[0]}</p>
            <Facts t={t} />
            <MoreLink to={href(lang, 'bio')} label={t.bio.more} />
          </div>
        </div>
      </section>

      {news.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHead kicker={t.news.kicker} title={t.news.title} />
            <NewsGrid news={news} t={t} lang={lang} />
            <MoreLink to={href(lang, 'news')} label={t.news.more} />
          </div>
        </section>
      )}

      <section className="section section-contact">
        <div className="container contact-grid">
          <SectionHead kicker={t.contact.kicker} title={t.contact.title}>
            <p className="lead">{t.contact.text}</p>
          </SectionHead>
          <ManagerCard t={t} />
        </div>
      </section>
    </main>
  )
}
