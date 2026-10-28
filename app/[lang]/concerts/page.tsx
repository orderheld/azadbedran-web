import { notFound } from 'next/navigation'
import { ArtistJsonLd, PageIntro, PastList, UpcomingList } from '@/components/sections'
import { getDict, isLocale } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { getConcerts } from '@/lib/content'

export const revalidate = 300

export async function generateMetadata({ params }: PageProps<'/[lang]/concerts'>) {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDict(lang)
  return pageMeta(lang, '/concerts', t.nav.concerts, t.concerts.title)
}

export default async function ConcertsPage({ params }: PageProps<'/[lang]/concerts'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  const { upcoming, past } = await getConcerts()

  return (
    <main>
      <ArtistJsonLd upcoming={upcoming} image={null} />
      <PageIntro kicker={t.concerts.kicker} title={t.concerts.title} />
      <section className="section section-tight">
        <div className="container">
          <h2 className="sub-head first">{t.concerts.upcoming}</h2>
          <UpcomingList upcoming={upcoming} t={t} lang={lang} />
          <h2 className="sub-head">{t.concerts.past}</h2>
          <PastList past={past} t={t} lang={lang} />
        </div>
      </section>
    </main>
  )
}
