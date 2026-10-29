import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Facts, PageHero, Rule } from '@/components/sections'
import { bioSources, getDict, isLocale } from '@/lib/i18n'
import { pageMeta } from '@/lib/meta'
import { images } from '@/lib/site'

export async function generateMetadata({ params }: PageProps<'/[lang]/biography'>) {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDict(lang)
  return pageMeta(lang, '/biography', t.nav.bio, t.bio.lead)
}

export default async function BioPage({ params }: PageProps<'/[lang]/biography'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  return (
    <main>
      <PageHero kicker={t.bio.kicker} title={t.bio.title} lead={t.bio.lead} image={images.hero.src} position="60% 30%" />
      <section className="section section-tight">
        <div className="container bio-layout">
          <aside className="bio-aside">
            <div className="bio-portrait"><Image src={images.portrait.src} alt="Azad Bedran" fill sizes="(max-width: 900px) 90vw, 380px" /></div>
            <Facts t={t} />
          </aside>
          <article className="bio-text">
            {t.bio.sections.map((s, i) => (
              <section key={s.h}>
                <h2 className="display"><span className="bio-num">{String(i + 1).padStart(2, '0')}</span>{s.h}</h2>
                {s.p.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
              </section>
            ))}
          </article>
        </div>
      </section>
      <section className="section bio-quote">
        <figure className="container">
          <blockquote className="display">“Sanat hakikatin arayışıdır.”</blockquote>
          {lang !== 'tr' && <p className="lead">{t.bio.quote}</p>}
          <figcaption>Azad Bedran · Medgündem, 2018</figcaption>
        </figure>
      </section>
      <section className="section section-dark">
        <div className="container">
          <p className="eyebrow center">{t.bio.timelineTitle}</p>
          <Rule />
          <ol className="timeline">
            {t.bio.timeline.map((e) => (
              <li key={e.year}><span className="tl-year display">{e.year}</span><span>{e.text}</span></li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section section-tight">
        <div className="container sources">
          <p className="eyebrow">{t.bio.sources}</p>
          <ul>{bioSources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener">{s.label}</a></li>)}</ul>
        </div>
      </section>
    </main>
  )
}
