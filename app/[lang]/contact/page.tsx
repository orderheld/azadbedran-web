import { notFound } from 'next/navigation'
import { ManagerCard, PageHero, SocialList } from '@/components/sections'
import { getDict, isLocale } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'

export async function generateMetadata({ params }: PageProps<'/[lang]/contact'>) {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDict(lang)
  return pageMeta(lang, '/contact', t.nav.contact, t.contact.text)
}

export default async function ContactPage({ params }: PageProps<'/[lang]/contact'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
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
