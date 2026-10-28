import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowRight, Sun } from '@/components/Icons'
import {
  ArtistJsonLd, BioBlock, LatestRelease, ManagerCard, MoreLink, NewsGrid, NextShowCard, SectionHead, SocialList, StreamBuyBand, UpcomingList, VideoGrid,
} from '@/components/sections'
import { getDict, isLocale } from '@/lib/i18n'
import { href } from '@/lib/routes'
import { site } from '@/lib/site'
import { getArtistImage, getConcerts, getNews, getReleases } from '@/lib/content'

export const revalidate = 300

export default async function Home({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)

  const [{ upcoming }, news, releases, artistImage] = await Promise.all([getConcerts(), getNews(3), getReleases(), getArtistImage()])
  const latest = releases[0]
  const heroImage = site.heroImage ?? artistImage

  return (
    <main>
      <ArtistJsonLd upcoming={upcoming} image={heroImage} />

      <section className="hero">
        <div className={`hero-media${heroImage ? ' has-photo' : ''}`}>
          {heroImage ? (
            <div className="hero-photo"><Image src={heroImage} alt="Azad Bedran" fill priority sizes="(max-width: 900px) 100vw, 70vw" className="hero-img" /></div>
          ) : <div className="hero-sun"><Sun /></div>}
        </div>
        <div className="container hero-content">
          <p className="eyebrow reveal">{t.hero.eyebrow}</p>
          <h1 className="hero-title reveal"><span>Azad</span><span className="indent">Bedran</span></h1>
          <p className="hero-tagline reveal">{t.hero.tagline}</p>
          <div className="hero-actions reveal">
            <a className="btn btn-gold" href={href(lang, 'music')}>{t.hero.listen} <ArrowRight size={16} /></a>
            <a className="btn btn-line" href={href(lang, 'videos')}>{t.hero.watch}</a>
          </div>
        </div>
        <NextShowCard next={upcoming[0]} t={t} lang={lang} />
      </section>

      {latest && (
        <div className="ticker" aria-hidden>
          <div className="ticker-track">
            {Array.from({ length: 8 }, (_, i) => <span key={i}>“{latest.title}” <i>—</i> {t.ticker} <i>✦</i></span>)}
          </div>
        </div>
      )}

      {latest && (
        <section className="section">
          <div className="container">
            <SectionHead n="01" kicker={t.music.kicker} title={t.music.latest} />
            <LatestRelease latest={latest} t={t} lang={lang} withPlayer={false} />
            <MoreLink to={href(lang, 'music')} label={t.more.music} />
          </div>
        </section>
      )}

      <section className="section section-alt">
        <div className="container">
          <SectionHead n="02" kicker={t.news.kicker} title={t.news.title} />
          <NewsGrid news={news} t={t} lang={lang} latestCover={latest?.cover} />
          <MoreLink to={href(lang, 'news')} label={t.more.news} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead n="03" kicker={t.concerts.kicker} title={t.concerts.upcoming} />
          <UpcomingList upcoming={upcoming.slice(0, 4)} t={t} lang={lang} />
          <MoreLink to={href(lang, 'concerts')} label={t.more.concerts} />
        </div>
      </section>

      <StreamBuyBand t={t} />

      <section className="section">
        <div className="container">
          <SectionHead n="04" kicker={t.videos.kicker} title={t.videos.title} />
          <VideoGrid t={t} limit={1} />
          <MoreLink to={href(lang, 'videos')} label={t.more.videos} />
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <BioBlock t={t} portrait={site.portraitImage ?? artistImage} full={false} moreHref={href(lang, 'bio')} />
        </div>
      </section>

      <section className="section">
        <div className="container contact">
          <div>
            <SectionHead n="05" kicker={t.contact.kicker} title={t.contact.title} />
            <p className="muted lead-sm">{t.contact.text}</p>
            <SocialList t={t} />
          </div>
          <ManagerCard t={t} />
        </div>
      </section>
    </main>
  )
}
