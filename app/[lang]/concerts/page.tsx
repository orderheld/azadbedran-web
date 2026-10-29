import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArtistJsonLd, ConcertList, ManagerCard, NextShow, PageHero, SectionHead } from '@/components/sections'
import { getDict, isLocale } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { getConcerts } from '@/lib/content'

export const revalidate = 3600

export async function generateMetadata({ params }: PageProps<'/[lang]/concerts'>) {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDict(lang)
  return pageMeta(lang, '/concerts', t.nav.concerts, t.concerts.upcoming)
}

export default async function ConcertsPage({ params }: PageProps<'/[lang]/concerts'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  const { upcoming, past } = await getConcerts()
  const posters = [...new Set(upcoming.map((c) => c.poster).filter((p): p is string => !!p))]

  return (
    <main>
      <ArtistJsonLd upcoming={upcoming} />
      <PageHero kicker={t.concerts.kicker} title={t.concerts.title} image="/images/azad-live-stage.jpg" position="50% 35%" />
      <section className="section section-tight">
        <div className="container">
          {upcoming.length ? (
            <>
              <NextShow c={upcoming[0]} t={t} lang={lang} />
              {upcoming.length > 1 && (
                <>
                  <h2 className="sub-head">{t.concerts.upcoming}</h2>
                  <ConcertList concerts={upcoming.slice(1)} t={t} lang={lang} />
                </>
              )}
            </>
          ) : (
            <p className="lead">{t.concerts.none}</p>
          )}
        </div>
      </section>

      {posters.length > 1 && (
        <section className="section section-dark">
          <div className="container posters">
            {posters.map((p) => (
              <div key={p} className="poster"><Image src={p} alt={`${t.concerts.poster} – Azad Bedran`} fill sizes="(max-width: 720px) 90vw, 400px" /></div>
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHead kicker={t.concerts.kicker} title={t.concerts.past} />
            <ConcertList concerts={past} t={t} lang={lang} past />
          </div>
        </section>
      )}

      <section className="section section-contact">
        <div className="container contact-grid">
          <SectionHead kicker={t.concerts.booking} title={t.contact.title}><p className="lead">{t.contact.text}</p></SectionHead>
          <ManagerCard t={t} />
        </div>
      </section>
    </main>
  )
}
