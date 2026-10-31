import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ConcertList, ManagerCard, NextShow, PageHero, SectionHead } from '@/components/sections'
import { formatDate, isLocale } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { seo } from '@/lib/seo'
import { getConcerts, loadDict } from '@/lib/content'

export const revalidate = 3600

export async function generateMetadata({ params }: PageProps<'/[lang]/concerts'>) {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const { upcoming } = await getConcerts()
  const s = seo[lang]
  const list = upcoming.slice(0, 4).map((c) => `${formatDate(c.date, lang)} ${c.city}`).join(' · ')
  const description = list ? `${s.concerts.description} ${s.upcoming}: ${list}.` : s.concerts.description
  return pageMeta(lang, '/concerts', s.concerts.title, description, { url: `/og/concerts-${lang}.jpg`, width: 1200, height: 630, alt: s.concerts.title })
}

export default async function ConcertsPage({ params }: PageProps<'/[lang]/concerts'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = await loadDict(lang)
  const { upcoming, past } = await getConcerts()
  const posters = [...new Set(upcoming.map((c) => c.poster).filter((p): p is string => !!p))]

  return (
    <main>
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
