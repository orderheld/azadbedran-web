import { notFound } from 'next/navigation'
import { PageHero } from '@/components/sections'
import { isLocale } from '@/lib/i18n'
import { privacy, legalMeta } from '@/lib/legal'
import { pageMeta } from '@/lib/meta'
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
  if (!isLocale(lang)) return {}
  const t = await loadDict(lang)
  // Eigene Beschreibung + kanonisch auf sich selbst (nicht auf die Startseite), weiterhin nicht indexiert
  return { ...pageMeta(lang, '/datenschutz', t.footer.privacy, legalMeta.privacy[lang]), robots: { index: false, follow: true } }
}
