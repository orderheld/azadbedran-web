import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDict, isLocale } from '@/lib/i18n'

export default async function Page({ params }: PageProps<'/[lang]/impressum'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  return (
    <main className="legal container">
      <Link href={`/${lang}`} className="link-arrow">← {t.footer.back}</Link>
      <h1>{t.footer.imprint}</h1>
      {/* TODO: Rechtstext einfügen (Verantwortliche Person, Adresse, Kontakt; Hosting: Vercel; Datenbank: Neon; eingebettete Inhalte: YouTube, Deezer/Spotify) */}
      <p className="muted">—</p>
    </main>
  )
}

export async function generateMetadata({ params }: PageProps<'/[lang]/impressum'>) {
  const { lang } = await params
  return { title: isLocale(lang) ? getDict(lang).footer.imprint : '', robots: { index: false } }
}
