import BrandIcon from './BrandIcon'
import Image from 'next/image'
import Link from 'next/link'
import YouTubeLite from './YouTubeLite'
import { ChooseButton, PlayButton } from './Player'
import { CoverImage, ReleaseCard, type ReleaseView } from './Release'
import { ArrowRight, ArrowUpRight, Phone, Pin, Ticket } from './Icons'
import { countryName, dateParts, formatDate, type Dict, type Locale } from '@/lib/i18n'
import { href } from '@/lib/routes'
import { coverUrl } from '@/lib/links'
import { manager, site, streamingPlatforms, telUrl, whatsappUrl } from '@/lib/site'
import type { Concert, NewsItem } from '@/lib/seed'
import type { Video } from '@/lib/videos'

type Base = { t: Dict; lang: Locale }

export function SectionHead({ kicker, title, as = 'h2', center, children }: { kicker: string; title: string; as?: 'h1' | 'h2'; center?: boolean; children?: React.ReactNode }) {
  const H = as
  return (
    <header className={`section-head${center ? ' is-center' : ''}`}>
      <p className="eyebrow">{kicker}</p>
      <H className="display">{title}</H>
      {children}
    </header>
  )
}

export function Rule() {
  return <div className="rule" aria-hidden><span /></div>
}

export function MoreLink({ to, label, external }: { to: string; label: string; external?: boolean }) {
  return external ? (
    <a className="more-link" href={to} target="_blank" rel="noopener">{label} <ArrowUpRight size={15} /></a>
  ) : (
    <Link className="more-link" href={to}>{label} <ArrowRight size={15} /></Link>
  )
}

export function PageHero({ kicker, title, lead, image, position = '50% 30%' }: { kicker: string; title: string; lead?: string; image?: string; position?: string }) {
  return (
    <section className={`page-hero${image ? ' has-image' : ''}`}>
      {image && (
        <div className="page-hero-img" aria-hidden>
          <Image src={image} alt="" fill priority sizes="100vw" style={{ objectPosition: position }} />
        </div>
      )}
      <div className="container">
        <SectionHead kicker={kicker} title={title} as="h1">
          {lead && <p className="lead">{lead}</p>}
        </SectionHead>
      </div>
    </section>
  )
}

export function daysUntil(iso: string) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(new Date())
  return Math.round((Date.parse(iso) - Date.parse(today)) / 86400000)
}

export function ConcertAction({ c, t }: { c: Concert; t: Dict }) {
  if (c.soldOut) return <span className="tag">{t.concerts.soldOut}</span>
  if (c.ticketUrl) return <a className="btn btn-primary btn-sm" href={c.ticketUrl} target="_blank" rel="noopener"><Ticket size={16} /> {t.concerts.tickets}</a>
  if (c.phone) return <a className="btn btn-ghost btn-sm" href={`tel:${c.phone.replace(/[^\d+]/g, '')}`}><Phone size={15} /> {t.concerts.reserve}</a>
  return <span className="tag">{t.concerts.ticketsSoon}</span>
}

export function NextShow({ c, t, lang, more }: Base & { c: Concert; more?: boolean }) {
  const d = dateParts(c.date, lang)
  const left = daysUntil(c.date)
  return (
    <article className="next-show">
      {c.poster && (
        <div className="next-show-poster">
          <Image src={c.poster} alt={`${t.concerts.poster}: Azad Bedran – ${c.city}`} fill sizes="(max-width: 900px) 80vw, 380px" />
        </div>
      )}
      <div className="next-show-body">
        <p className="eyebrow">{t.concerts.next} <span className="pill">{t.concerts.daysLeft(left)}</span></p>
        <div className="next-show-date">
          <span className="big-day">{d.day}</span>
          <span><strong>{d.month} {d.year}</strong><br />{d.weekday}{c.time ? ` · ${t.concerts.doors} ${c.time}` : ''}</span>
        </div>
        <h3 className="display">{c.city}</h3>
        <p className="next-show-venue">
          <Pin size={16} /> {c.venue ?? t.concerts.venueTba}{c.address ? `, ${c.address}` : ''} · {countryName(c.country, lang)}
        </p>
        <div className="btn-row">
          <ConcertAction c={c} t={t} />
          {c.phone && <span className="muted small">{c.phone}</span>}
          {more && <MoreLink to={href(lang, 'concerts')} label={t.concerts.more} />}
        </div>
      </div>
    </article>
  )
}

export function ConcertList({ concerts, t, lang, past }: Base & { concerts: Concert[]; past?: boolean }) {
  return (
    <ol className={`concerts${past ? ' is-past' : ''}`}>
      {concerts.map((c) => {
        const d = dateParts(c.date, lang)
        return (
          <li key={c.id} className="concert">
            <time dateTime={c.date} className="concert-date">
              <span className="day">{d.day}</span>
              <span className="month">{d.month}<br />{d.year}</span>
            </time>
            <div className="concert-place">
              <strong>{c.city}</strong>
              <span>{c.venue ?? t.concerts.venueTba} · {countryName(c.country, lang)}</span>
            </div>
            {!past && <div className="concert-action"><ConcertAction c={c} t={t} /></div>}
          </li>
        )
      })}
    </ol>
  )
}

export function LatestRelease({ r, t, label }: { r: ReleaseView; t: Dict; label?: string }) {
  const choose = { title: r.title, subtitle: r.credit ?? undefined, art: r.art, appleUrl: r.appleUrl, deezerUrl: r.deezerUrl }
  return (
    <div className="latest">
      <div className="latest-cover">
        <div className="latest-glow" aria-hidden style={{ backgroundImage: `url(${coverUrl(r.art, 100)})` }} />
        <CoverImage art={r.art} title={r.title} sizes="(max-width: 900px) 86vw, 520px" eager />
      </div>
      <div className="latest-body">
        <p className="eyebrow">{label ?? t.music.latest}</p>
        <h2 className="display xl">{r.title}</h2>
        <p className="latest-meta">{r.meta}{r.credit ? ` · ${r.credit}` : ''} · {r.year}</p>
        <p className="muted">{t.music.out}</p>
        <div className="btn-row">
          <PlayButton items={r.queue} label={`${t.player.preview} 0:30`} />
          <ChooseButton item={choose} label={t.choose.title} />
        </div>
      </div>
    </div>
  )
}

export function ReleaseGrid({ items, t, compact }: { items: ReleaseView[]; t: Dict; compact?: boolean }) {
  return (
    <div className={`release-grid${compact ? ' is-compact' : ''}`}>
      {items.map((r) => <ReleaseCard key={r.id} r={r} labels={{ play: t.player.preview, choose: t.choose.title }} />)}
    </div>
  )
}

export function PlatformStrip({ t }: { t: Dict }) {
  return (
    <div className="platform-strip">
      <p className="eyebrow">{t.platforms}</p>
      <ul>
        {streamingPlatforms().map((p) => (
          <li key={p.id}><a href={p.url} target="_blank" rel="noopener"><BrandIcon id={p.id} size={22} />{p.label}</a></li>
        ))}
      </ul>
    </div>
  )
}

export function VideoGrid({ videos, t, lang, feature = true }: Base & { videos: Video[]; feature?: boolean }) {
  return (
    <div className={`video-grid${feature ? ' has-feature' : ''}`}>
      {videos.map((v, i) => (
        <figure key={v.id} className="video">
          <YouTubeLite id={v.id} title={v.title} playLabel={t.videos.play} eager={i === 0} />
          <figcaption>
            <strong>{v.title}</strong>
            {v.date && <span>{formatDate(v.date, lang)}{v.views ? ` · ${new Intl.NumberFormat(lang === 'ku' ? 'tr' : lang).format(v.views)} ${t.videos.views}` : ''}</span>}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

export function Facts({ t }: { t: Dict }) {
  return (
    <dl className="facts">
      {t.bio.facts.map((f) => (
        <div key={f.label}><dt>{f.value.replace('+', '')}{f.value.endsWith('+') && <span className="plus">+</span>}</dt><dd>{f.label}</dd></div>
      ))}
    </dl>
  )
}

export function NewsGrid({ news, t, lang }: Base & { news: NewsItem[] }) {
  return (
    <div className="news-grid">
      {news.map((n) => (
        <Link key={n.id} href={`${href(lang, 'news')}/${n.id}`} className="news-card">
          <div className="news-img">
            {n.image && <Image src={n.image} alt="" fill sizes="(max-width: 720px) 100vw, 33vw" />}
          </div>
          <time dateTime={n.date}>{formatDate(n.date, lang)}</time>
          <h3>{n.title[lang]}</h3>
          <p>{n.body[lang]}</p>
          <span className="more-link">{t.news.read} <ArrowRight size={15} /></span>
        </Link>
      ))}
    </div>
  )
}

export function ManagerCard({ t }: { t: Dict }) {
  return (
    <div className="manager">
      <div className="manager-photo">
        <Image src={manager.photo} alt={manager.name} fill sizes="(max-width: 720px) 40vw, 220px" />
      </div>
      <div className="manager-body">
        <p className="eyebrow">{t.contact.role}</p>
        <h3 className="display">{manager.name}</h3>
        <p className="manager-phone"><a href={telUrl}>{manager.phone}</a></p>
        <div className="btn-row">
          <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noopener"><BrandIcon id="whatsapp" size={17} mono /> {t.contact.whatsapp}</a>
          <a className="btn btn-ghost" href={telUrl}><Phone size={16} /> {t.contact.call}</a>
        </div>
      </div>
    </div>
  )
}

export function SocialList({ t }: { t: Dict }) {
  return (
    <div className="social-list">
      <p className="eyebrow">{t.contact.follow}</p>
      <ul>
        {site.socials.map((s) => (
          <li key={s.id}>
            <a href={s.url} target="_blank" rel="noopener"><BrandIcon id={s.id} size={24} /><span>{s.label}</span><span className="muted">{s.handle}</span><ArrowUpRight size={16} /></a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ArtistJsonLd({ upcoming }: { upcoming: Concert[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: site.name,
    url: site.url,
    image: `${site.url}/og.jpg`,
    genre: 'Kurdish music',
    foundingLocation: 'Diyarbakır',
    sameAs: [...site.socials.map((s) => s.url), ...streamingPlatforms().map((p) => p.url)],
    event: upcoming.map((c) => ({
      '@type': 'MusicEvent',
      name: `Azad Bedran – ${c.city}`,
      startDate: c.time ? `${c.date}T${c.time}` : c.date,
      eventStatus: 'https://schema.org/EventScheduled',
      location: { '@type': 'Place', name: c.venue ?? c.city, address: { '@type': 'PostalAddress', streetAddress: c.address ?? undefined, addressLocality: c.city, addressCountry: c.country } },
      performer: { '@type': 'MusicGroup', name: site.name },
      ...(c.ticketUrl ? { offers: { '@type': 'Offer', url: c.ticketUrl } } : {}),
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
