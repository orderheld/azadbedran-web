// Startinhalte. Werden in die Neon-Datenbank übernommen (npm run db:setup)
// und dienen als Fallback, solange keine Datenbank verbunden ist.

export type Concert = {
  id: number
  date: string // YYYY-MM-DD (Ortszeit)
  time: string | null // HH:MM
  city: string
  venue: string
  country: string
  ticketUrl: string | null
  soldOut: boolean
  demo?: boolean
}

export type NewsItem = {
  id: number
  date: string
  title: { ku: string; tr: string; en: string }
  body: { ku: string; tr: string; en: string }
  image: string | null
  link: string | null
  demo?: boolean
}

export type Release = {
  title: string
  date: string
  type: 'album' | 'single' | 'ep' | 'live'
  tracks: number | null
  cover: string | null
  link: string | null
  feat?: string
}

// Quellen: biletsirasi.com/konser/azad-bedran, izmir.art (abgerufen 28.10.2026)
export const seedConcerts: Concert[] = [
  { id: 1, date: '2026-01-10', time: '21:30', city: 'Amed / Diyarbakır', venue: 'Sezai Karakoç Kültür ve Kongre Merkezi', country: 'TR', ticketUrl: 'https://biletsirasi.com/r/419344', soldOut: false },
  { id: 2, date: '2025-12-06', time: '21:30', city: 'İstanbul', venue: 'Trump Sahne', country: 'TR', ticketUrl: 'https://biletsirasi.com/r/360852', soldOut: false },
  { id: 3, date: '2025-11-21', time: '22:00', city: 'Adana', venue: 'Yaşar Kemal Kültür Merkezi', country: 'TR', ticketUrl: 'https://biletsirasi.com/r/339994', soldOut: false },
  { id: 4, date: '2025-10-25', time: '22:00', city: 'Bursa', venue: 'BAOB Sahne', country: 'TR', ticketUrl: 'https://biletsirasi.com/r/275423', soldOut: false },
  { id: 5, date: '2025-06-20', time: '22:00', city: 'Êlih / Batman', venue: 'Batman İl Kültür Merkezi', country: 'TR', ticketUrl: 'https://biletsirasi.com/r/9476', soldOut: false },
  { id: 6, date: '2025-06-18', time: '22:00', city: 'Sêrt / Siirt', venue: 'Av. Tahir Elçi Konferans Salonu', country: 'TR', ticketUrl: 'https://biletsirasi.com/r/9723', soldOut: false },
  { id: 7, date: '2024-09-26', time: '20:00', city: 'İzmir', venue: 'Nazım Hikmet Kültür Merkezi', country: 'TR', ticketUrl: null, soldOut: false },

  // Nur sichtbar mit SHOW_DEMO_CONTENT=1 – zeigt, wie kommende Termine aussehen.
  { id: 901, date: '2026-12-19', time: '21:00', city: 'Amed / Diyarbakır', venue: 'Demo Venue', country: 'TR', ticketUrl: '#', soldOut: false, demo: true },
  { id: 902, date: '2027-01-23', time: '20:00', city: 'Köln', venue: 'Demo Venue', country: 'DE', ticketUrl: '#', soldOut: false, demo: true },
  { id: 903, date: '2027-02-13', time: '20:00', city: 'Zürich', venue: 'Demo Venue', country: 'CH', ticketUrl: null, soldOut: true, demo: true },
]

export const seedNews: NewsItem[] = [
  {
    id: 1,
    date: '2026-10-08',
    title: { ku: 'Single ya nû: “Ez Dînim”', tr: 'Yeni single: “Ez Dînim”', en: 'New single: “Ez Dînim”' },
    body: {
      ku: 'Strana nû ya Azad Bedran “Ez Dînim” ji 8ê Kewçêrê ve li ser hemû platformên muzîkê ye.',
      tr: 'Azad Bedran’ın yeni şarkısı “Ez Dînim” 8 Ekim’den beri tüm dijital platformlarda.',
      en: 'Azad Bedran’s new single “Ez Dînim” has been out on all streaming platforms since October 8.',
    },
    image: null,
    link: null,
  },
  {
    id: 2,
    date: '2026-09-24',
    title: { ku: 'Bi Suleyman re: “Tu Çîrokek Bê Hempa”', tr: 'Suleyman ile: “Tu Çîrokek Bê Hempa”', en: 'With Suleyman: “Tu Çîrokek Bê Hempa”' },
    body: {
      ku: 'Azad Bedran û Suleyman bi hev re strana “Tu Çîrokek Bê Hempa” weşandin.',
      tr: 'Azad Bedran ve Suleyman’ın birlikte seslendirdiği “Tu Çîrokek Bê Hempa” yayında.',
      en: 'Azad Bedran and Suleyman have released their joint single “Tu Çîrokek Bê Hempa”.',
    },
    image: null,
    link: null,
  },
  {
    id: 3,
    date: '2026-07-31',
    title: { ku: 'Albûma zindî: “Evîna Azad (Live)”', tr: 'Canlı albüm: “Evîna Azad (Live)”', en: 'Live album: “Evîna Azad (Live)”' },
    body: {
      ku: '13 stran bi enerjiya sahneyê: albûma zindî ya Azad Bedran niha li ser hemû platforman e.',
      tr: 'Sahnenin enerjisiyle 13 şarkı: Azad Bedran’ın canlı albümü tüm platformlarda.',
      en: '13 songs with all the energy of the stage: Azad Bedran’s live album is out now.',
    },
    image: null,
    link: null,
  },
  {
    id: 4,
    date: '2026-03-26',
    title: { ku: '“Amedspor Geliyor”', tr: '“Amedspor Geliyor”', en: '“Amedspor Geliyor”' },
    body: {
      ku: 'Strana nû ji bo Amedsporê: “Amedspor Geliyor” niha derket.',
      tr: 'Amedspor için yeni şarkı: “Amedspor Geliyor” yayında.',
      en: 'A new song for Amedspor: “Amedspor Geliyor” is out now.',
    },
    image: null,
    link: null,
  },
]

// Quelle: Deezer / Shazam (abgerufen 28.10.2026). Cover werden live von Deezer geladen.
export const seedReleases: Release[] = [
  { title: 'Ez Dînim', date: '2026-10-08', type: 'single', tracks: 1, cover: null, link: null },
  { title: 'Tu Çîrokek Bê Hempa', date: '2026-09-24', type: 'single', tracks: 1, cover: null, link: null, feat: 'Suleyman' },
  { title: 'Evîna Azad (Live)', date: '2026-07-31', type: 'live', tracks: 13, cover: null, link: null },
  { title: 'Buk Û Zava Yê Me', date: '2026-04-19', type: 'single', tracks: 1, cover: null, link: null },
  { title: 'Amedspor Geliyor', date: '2026-03-26', type: 'single', tracks: 1, cover: null, link: null },
  { title: 'Bilbilek Xemgînim', date: '2026-01-15', type: 'single', tracks: 1, cover: null, link: null },
  { title: 'Bargiran', date: '2025-12-01', type: 'single', tracks: 1, cover: null, link: null, feat: 'Berfîn Mamedova' },
  { title: 'Ka Berxêmin', date: '2025-10-23', type: 'single', tracks: 1, cover: null, link: null },
  { title: 'Nîno', date: '2025-07-30', type: 'single', tracks: 1, cover: null, link: null },
  { title: 'Oxir Be Ji Tere', date: '2025-07-18', type: 'single', tracks: 1, cover: null, link: null },
  { title: 'Bêhna Bihuşt', date: '2025-05-24', type: 'single', tracks: 1, cover: null, link: null },
  { title: 'Nav Bexça Dil', date: '2025-03-20', type: 'single', tracks: 1, cover: null, link: null },
  { title: 'Paytexta Evînê', date: '2023-09-17', type: 'album', tracks: 10, cover: null, link: null },
  { title: 'Evîna Azad', date: '2023-09-07', type: 'album', tracks: 8, cover: null, link: 'https://music.apple.com/album/ev%C3%AEna-azad/1706503757' },
  { title: 'Rêwiyên Şad', date: '2016-05-27', type: 'album', tracks: 14, cover: null, link: null },
]
