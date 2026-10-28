import Image from 'next/image'
import Link from 'next/link'
import YouTubeLite from './YouTubeLite'
import ConsentEmbed from './ConsentEmbed'
import GalleryGrid from './Gallery'
import Cover from './Cover'
import { ArrowRight, ArrowUpRight, Chat, Mail, Phone, Pin, Sun, Ticket } from './Icons'
import { dateParts, formatDate, type Dict, type Locale } from '@/lib/i18n'
import { href } from '@/lib/routes'
import { buyPlatforms, gallery, manager, site, streamingPlatforms, videos } from '@/lib/site'
import type { Concert, NewsItem, Release } from '@/lib/seed'

type Base = { t: Dict; lang: Locale }

export function SectionHead({ n, kicker, title, as = 'h2' }: { n?: string; kicker: string; title: string; as?: 'h1' | 'h2' }) {
  const H = as
  return (
    <header className="section-head">
      <p className="eyebrow">{n && <span className="num">{n}</span>} {kicker}</p>
      <H>{title}</H>
    </header>
  )
}

export function MoreLink({ to, label }: { to: string; label: string }) {
  return <Link className="link-arrow more-link" href={to}>{label} <ArrowRight size={14} /></Link>
}

export function PageIntro({ kicker, title }: { kicker: string; title: string }) {
  return (
    <section className="page-intro">
      <div className="page-intro-sun" aria-hidden><Sun size={640} /></div>
      <div className="container">
        <SectionHead kicker={kicker} title={title} as="h1" />
      </div>
    </section>
  )
}

const typeLabel = (r: Release, t: Dict) =>
  r.type === 'live' ? t.music.live : r.type === 'ep' ? t.music.ep : r.type === 'album' ? t.music.album : t.music.single

const fallbackListen = () => streamingPlatforms().find((p) => p.id === 'deezer')!.url

/* ---------- Concerts ---------- */

export function NextShowCard({ next, t, lang }: Base & { next?: Concert }) {
  return (
    <aside className="next-show reveal" aria-label={t.next.label}>
      <p className="next-label"><span className="pulse" />{t.next.label}</p>
      {next ? (
        <div className="next-body">
          <div className="next-date">
            <span className="day">{dateParts(next.date, lang).day}</span>
            <span className="mon">{dateParts(next.date, lang).month}<br />{dateParts(next.date, lang).year}</span>
          </div>
          <div className="next-place">
            <strong>{next.city}</strong>
            <span>{next.venue}{next.time ? ` · ${next.time}` : ''}</span>
            {next.demo && <em className="demo-badge">{t.demo}</em>}
          </div>
          {next.ticketUrl && !next.soldOut ? (
            <a className="btn btn-gold btn-sm" href={next.ticketUrl} target="_blank" rel="noopener"><Ticket size={16} /> {t.next.tickets}</a>
          ) : next.soldOut ? <span className="sold-out">{t.concerts.soldOut}</span> : null}
        </div>
      ) : (
        <div className="next-empty">
          <p>{t.next.soon}</p>
          <a href={site.socials[0].url} target="_blank" rel="noopener" className="link-arrow">{t.next.follow} <ArrowUpRight size={14} /></a>
        </div>
      )}
    </aside>
  )
}

function GigRow({ c, t, lang, highlight, past }: Base & { c: Concert; highlight?: boolean; past?: boolean }) {
  const d = dateParts(c.date, lang)
  return (
    <li className={`gig${highlight ? ' is-next' : ''}`}>
      <time dateTime={c.date} className="gig-date">
        <span className="day">{d.day}</span>
        <span className="mon">{d.monthShort} {d.year}</span>
      </time>
      <div className="gig-place">
        <strong>{c.city}</strong>
        <span><Pin size={13} /> {c.venue}{c.time && !past ? ` · ${c.time}` : ''}</span>
      </div>
      <span className="gig-country">{c.country}</span>
      {c.demo && <em className="demo-badge">{t.demo}</em>}
      <div className="gig-action">
        {past ? null : c.soldOut ? <span className="sold-out">{t.concerts.soldOut}</span> : c.ticketUrl ? (
          <a className={`btn btn-sm ${highlight ? 'btn-gold' : 'btn-line'}`} href={c.ticketUrl} target="_blank" rel="noopener"><Ticket size={15} /> {t.concerts.tickets}</a>
        ) : null}
      </div>
    </li>
  )
}

export function UpcomingList({ upcoming, t, lang }: Base & { upcoming: Concert[] }) {
  return upcoming.length ? (
    <ol className="gig-list">{upcoming.map((c, i) => <GigRow key={c.id} c={c} t={t} lang={lang} highlight={i === 0} />)}</ol>
  ) : <p className="empty">{t.concerts.none}</p>
}

export function PastList({ past, t, lang }: Base & { past: Concert[] }) {
  return <ol className="gig-list is-past">{past.map((c) => <GigRow key={c.id} c={c} t={t} lang={lang} past />)}</ol>
}

/* ---------- News ---------- */

export function NewsGrid({ news, t, lang, featureFirst = true, latestCover }: Base & { news: NewsItem[]; featureFirst?: boolean; latestCover?: string | null }) {
  return (
    <div className="news-grid">
      {news.map((n, i) => {
        const d = dateParts(n.date, lang)
        const featured = featureFirst && i === 0
        return (
          <article key={n.id} className={`news-card${featured ? ' is-featured' : ''}`}>
            <Link href={`${href(lang, 'news')}/${n.id}`} className="news-media">
              {n.image ? <Image src={n.image} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" /> : (
                <Cover title={stripQuotes(n.title[lang])} src={featured ? latestCover ?? null : null} sizes="50vw" />
              )}
            </Link>
            <div className="news-body">
              <time dateTime={n.date}>{d.day} {d.month} {d.year}</time>
              <h3><Link href={`${href(lang, 'news')}/${n.id}`}>{n.title[lang]}</Link></h3>
              <p>{n.body[lang]}</p>
              <Link className="link-arrow" href={`${href(lang, 'news')}/${n.id}`}>{t.news.more} <ArrowRight size={14} /></Link>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export const stripQuotes = (s: string) => s.replace(/^[^“”"]*[“”"]|[“”"]$/g, '')

/* ---------- Music ---------- */

export function LatestRelease({ latest, t, lang, withPlayer = true }: Base & { latest: Release; withPlayer?: boolean }) {
  return (
    <div className="latest">
      <div className="latest-cover">
        <Cover title={latest.title} src={latest.cover} sizes="(max-width: 900px) 90vw, 440px" priority />
      </div>
      <div className="latest-info">
        <p className="eyebrow">{t.music.latest} · {typeLabel(latest, t)}</p>
        <h3 className="display-md">{latest.title}</h3>
        <p className="muted">{formatDate(latest.date, lang)}{latest.feat ? ` · feat. ${latest.feat}` : ''}</p>
        <div className="platform-row">
          {streamingPlatforms().map((p) => (
            <a key={p.id} className="pill" href={p.id === 'deezer' && latest.link ? latest.link : p.url} target="_blank" rel="noopener">
              {p.label} <ArrowUpRight size={13} />
            </a>
          ))}
        </div>
        {withPlayer && (
          <div className="preview">
            <p className="preview-title">{t.music.preview}</p>
            <p className="muted small">{t.music.previewText}</p>
            {site.spotifyArtistId ? (
              <ConsentEmbed src={`https://open.spotify.com/embed/artist/${site.spotifyArtistId}?theme=0`} title="Spotify" provider="Spotify" loadLabel={t.embed.load} notice={t.embed.notice} height={352} />
            ) : (
              <ConsentEmbed src={`https://widget.deezer.com/widget/dark/artist/${site.deezerArtistId}/top_tracks`} title="Deezer" provider="Deezer" loadLabel={t.embed.load} notice={t.embed.notice} height={300} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function AlbumGrid({ albums, t }: { albums: Release[]; t: Dict }) {
  return (
    <div className="album-grid">
      {albums.map((a) => (
        <a key={a.title} className="album" href={a.link ?? fallbackListen()} target="_blank" rel="noopener">
          <div className="album-cover"><Cover title={a.title} src={a.cover} sizes="(max-width: 720px) 50vw, 25vw" /></div>
          <h4>{a.title}</h4>
          <p className="muted small">{typeLabel(a, t)} · {a.date.slice(0, 4)}{a.tracks ? ` · ${a.tracks} ${t.music.tracks}` : ''}</p>
        </a>
      ))}
    </div>
  )
}

export function SingleGrid({ singles }: { singles: Release[] }) {
  return (
    <div className="single-grid">
      {singles.map((s) => (
        <a key={s.title} className="single" href={s.link ?? fallbackListen()} target="_blank" rel="noopener">
          <div className="single-cover"><Cover title={s.title} src={s.cover} sizes="72px" /></div>
          <div>
            <h4>{s.title}</h4>
            <p className="muted small">{s.feat ? `feat. ${s.feat} · ` : ''}{s.date.slice(0, 4)}</p>
          </div>
          <ArrowUpRight size={15} />
        </a>
      ))}
    </div>
  )
}

export function StreamBuyBand({ t }: { t: Dict }) {
  return (
    <section className="section band">
      <div className="container band-grid">
        <div className="band-card">
          <p className="eyebrow">{t.stream.kicker}</p>
          <h3 className="display-sm">{t.stream.title}</h3>
          <p className="muted">{t.stream.text}</p>
          <div className="platform-list">
            {streamingPlatforms().map((p) => (
              <a key={p.id} href={p.url} target="_blank" rel="noopener"><span>{p.label}</span><ArrowUpRight size={15} /></a>
            ))}
          </div>
          <a className="btn btn-red" href={site.youtubeSubscribeUrl} target="_blank" rel="noopener">{t.stream.subscribe}</a>
        </div>
        <div className="band-card">
          <p className="eyebrow">{t.buy.kicker}</p>
          <h3 className="display-sm">{t.buy.title}</h3>
          <p className="muted">{t.buy.text}</p>
          <div className="platform-list">
            {buyPlatforms().map((p) => (
              <a key={p.id} href={p.url} target="_blank" rel="noopener"><span>{p.label}</span><ArrowUpRight size={15} /></a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Videos ---------- */

export function VideoGrid({ t, limit }: { t: Dict; limit?: number }) {
  return (
    <div className="video-grid">
      {videos.slice(0, limit).map((v, i) => (
        <figure key={v.id} className={i === 0 ? 'is-featured' : ''}>
          <YouTubeLite id={v.id} title={v.title} playLabel={t.videos.play} />
          <figcaption>{v.title}</figcaption>
        </figure>
      ))}
    </div>
  )
}

/* ---------- Bio ---------- */

export function BioBlock({ t, portrait, full = true, moreHref }: { t: Dict; portrait: string | null; full?: boolean; moreHref?: string }) {
  const paragraphs = full ? t.bio.paragraphs : t.bio.paragraphs.slice(0, 2)
  return (
    <div className="bio">
      <div className="bio-portrait">
        {portrait ? <Image src={portrait} alt="Azad Bedran" fill sizes="(max-width: 900px) 90vw, 40vw" /> : (
          <div className="portrait-fallback"><Sun size={300} /><span>Azad Bedran</span></div>
        )}
      </div>
      <div>
        {!full && <SectionHead kicker={t.bio.kicker} title={t.bio.title} />}
        {full && <h2 className="display-md bio-title">{t.bio.title}</h2>}
        <div className="bio-text">
          {paragraphs.map((p, i) => <p key={i} className={i === 0 ? 'lead' : ''}>{p}</p>)}
        </div>
        {moreHref && <MoreLink to={moreHref} label={t.more.bio} />}
        {full && (
          <dl className="facts">
            {t.bio.facts.map((f) => <div key={f.label}><dt>{f.value}</dt><dd>{f.label}</dd></div>)}
          </dl>
        )}
      </div>
    </div>
  )
}

/* ---------- Gallery ---------- */

export function GalleryBlock({ t, limit }: { t: Dict; limit?: number }) {
  return <GalleryGrid items={gallery.slice(0, limit)} placeholder={t.gallery.placeholder} closeLabel={t.gallery.close} />
}

/* ---------- Contact ---------- */

export function ManagerCard({ t }: { t: Dict }) {
  const tel = manager.phone.replace(/[^+\d]/g, '')
  return (
    <div className="manager-card">
      <div className="manager-photo">
        {manager.photo ? <Image src={manager.photo} alt={manager.name} fill sizes="160px" /> : (
          <span>{manager.name.split(' ').map((w) => w[0]).join('')}</span>
        )}
      </div>
      <p className="eyebrow">{t.contact.role}</p>
      <h3 className="display-sm">{manager.name}</h3>
      <a className="manager-phone" href={`tel:${tel}`}>{manager.phone}</a>
      <div className="manager-actions">
        <a className="btn btn-gold" href={`tel:${tel}`}><Phone size={16} /> {t.contact.call}</a>
        <a className="btn btn-line" href={`https://wa.me/${tel.replace('+', '')}`} target="_blank" rel="noopener"><Chat size={16} /> {t.contact.whatsapp}</a>
        <a className="btn btn-line" href={`mailto:${manager.email}`}><Mail size={16} /> {t.contact.email}</a>
      </div>
      <p className="muted small">{manager.email}</p>
    </div>
  )
}

export function SocialList({ t }: { t: Dict }) {
  return (
    <>
      <h4 className="follow-head">{t.contact.follow}</h4>
      <ul className="social-list">
        {site.socials.map((s) => (
          <li key={s.id}><a href={s.url} target="_blank" rel="noopener"><span>{s.label}</span><span className="muted">{s.handle}</span><ArrowUpRight size={15} /></a></li>
        ))}
      </ul>
    </>
  )
}

/* ---------- SEO ---------- */

export function ArtistJsonLd({ upcoming, image }: { upcoming: Concert[]; image: string | null }) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MusicGroup',
        '@id': `${site.url}/#artist`,
        name: site.name,
        url: site.url,
        genre: ['Kurdish music', 'Folk', 'Pop'],
        image: image ?? undefined,
        sameAs: site.socials.map((s) => s.url),
      },
      ...upcoming.filter((c) => !c.demo).map((c) => ({
        '@type': 'MusicEvent',
        name: `${site.name} – ${c.city}`,
        startDate: c.time ? `${c.date}T${c.time}` : c.date,
        eventStatus: 'https://schema.org/EventScheduled',
        location: { '@type': 'Place', name: c.venue, address: { '@type': 'PostalAddress', addressLocality: c.city, addressCountry: c.country } },
        performer: { '@id': `${site.url}/#artist` },
        offers: c.ticketUrl ? { '@type': 'Offer', url: c.ticketUrl, availability: c.soldOut ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock' } : undefined,
      })),
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}
