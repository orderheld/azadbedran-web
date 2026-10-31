import { notFound } from 'next/navigation'
import { ManagerCard, PageHero, SocialList } from '@/components/sections'
import { isLocale } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { seo } from '@/lib/seo'
import { loadDict } from '@/lib/content'

export async function generateMetadata({ params }: PageProps<'/[lang]/contact'>) {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = await loadDict(lang)
  return pageMeta(lang, '/contact', seo[lang].contact.title, seo[lang].contact.description)
}

export default async function ContactPage({ params }: PageProps<'/[lang]/contact'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = await loadDict(lang)
  return (
    <main>
      <PageHero kicker={t.contact.kicker} title={t.contact.title} lead={t.contact.text} image="/images/azad-warm.jpg" position="50% 30%" />
      <section className="section section-tight">
        <div className="container contact-grid">
          <ManagerCard t={t} />
          <SocialList t={t} />
        </div>
      </section>
    </main>
  )
}
