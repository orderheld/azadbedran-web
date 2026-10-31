import { notFound } from 'next/navigation'
import { PageHero } from '@/components/sections'
import { isLocale } from '@/lib/i18n'
import { privacy } from '@/lib/legal'
import { loadDict } from '@/lib/content'

export default async function Page({ params }: PageProps<'/[lang]/datenschutz'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = await loadDict(lang)
  return (
    <main>
      <PageHero kicker="Azad Bedran" title={t.footer.privacy} />
      <section className="section section-tight">
        <div className="container legal">
          {privacy[lang].map((b) => (
            <section key={b.h}>
              <h2>{b.h}</h2>
              {b.p.map((p) => <p key={p}>{p}</p>)}
            </section>
          ))}
        </div>
      </section>
    </main>
  )
}

export async function generateMetadata({ params }: PageProps<'/[lang]/datenschutz'>) {
  const { lang } = await params
  return { title: isLocale(lang) ? (await loadDict(lang)).footer.privacy : '', robots: { index: false } }
}
