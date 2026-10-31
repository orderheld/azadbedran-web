import { notFound } from 'next/navigation'
import Gallery from '@/components/Gallery'
import { PageHero } from '@/components/sections'
import { isLocale } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { seo } from '@/lib/seo'
import { getGallery, loadDict } from '@/lib/content'

export async function generateMetadata({ params }: PageProps<'/[lang]/gallery'>) {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = await loadDict(lang)
  return pageMeta(lang, '/gallery', seo[lang].gallery.title, seo[lang].gallery.description)
}

export default async function GalleryPage({ params }: PageProps<'/[lang]/gallery'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const [t, gallery] = await Promise.all([loadDict(lang), getGallery()])
  return (
    <main>
      <PageHero kicker={t.gallery.kicker} title={t.gallery.title} />
      <section className="section section-tight">
        <div className="container"><Gallery items={gallery} alt="Azad Bedran" closeLabel={t.close} /></div>
      </section>
    </main>
  )
}
