import { notFound } from 'next/navigation'
import { PageHero } from '@/components/sections'
import { isLocale } from '@/lib/i18n'
import { imprint } from '@/lib/legal'
import { loadDict } from '@/lib/content'

export default async function Page({ params }: PageProps<'/[lang]/impressum'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = await loadDict(lang)
  return (
    <main>
      <PageHero kicker="Azad Bedran" title={t.footer.imprint} />
      <section className="section section-tight">
        <div className="container legal">
          {imprint[lang].map((b) => (
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

export async function generateMetadata({ params }: PageProps<'/[lang]/impressum'>) {
  const { lang } = await params
  return { title: isLocale(lang) ? (await loadDict(lang)).footer.imprint : '', robots: { index: false } }
}
