import { notFound } from 'next/navigation'
import { BioBlock, PageIntro } from '@/components/sections'
import { getDict, isLocale } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { site } from '@/lib/site'
import { getArtistImage } from '@/lib/content'

export const revalidate = 86400

export async function generateMetadata({ params }: PageProps<'/[lang]/biography'>) {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDict(lang)
  return pageMeta(lang, '/biography', t.nav.bio, t.bio.paragraphs[0])
}

export default async function BioPage({ params }: PageProps<'/[lang]/biography'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  const artistImage = await getArtistImage()
  return (
    <main>
      <PageIntro kicker={t.bio.kicker} title={t.nav.bio} />
      <section className="section section-tight">
        <div className="container">
          <BioBlock t={t} portrait={site.portraitImage ?? artistImage} />
        </div>
      </section>
    </main>
  )
}
