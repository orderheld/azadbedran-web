import { notFound } from 'next/navigation'
import { ManagerCard, PageIntro, SocialList } from '@/components/sections'
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
      <PageIntro kicker={t.contact.kicker} title={t.contact.title} />
      <section className="section section-tight">
        <div className="container contact">
          <div>
            <p className="muted lead-sm">{t.contact.text}</p>
            <SocialList t={t} />
          </div>
          <ManagerCard t={t} />
        </div>
      </section>
    </main>
  )
}
