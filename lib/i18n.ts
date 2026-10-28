export const locales = ['ku', 'tr', 'en'] as const
export type Locale = (typeof locales)[number]

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v)

export const localeNames: Record<Locale, string> = { ku: 'Kurmancî', tr: 'Türkçe', en: 'English' }
export const htmlLang: Record<Locale, string> = { ku: 'ku', tr: 'tr', en: 'en' }

const months: Record<Locale, string[]> = {
  ku: ['Rêbendan', 'Reşemî', 'Adar', 'Avrêl', 'Gulan', 'Pûşper', 'Tîrmeh', 'Gelawêj', 'Rezber', 'Kewçêr', 'Sermawez', 'Berfanbar'],
  tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
}

export function dateParts(iso: string, locale: Locale) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  const month = months[locale][m - 1]
  return { day: String(d).padStart(2, '0'), month, monthShort: month.slice(0, 3), year: String(y) }
}

export function formatDate(iso: string, locale: Locale) {
  const p = dateParts(iso, locale)
  return locale === 'en' ? `${p.month} ${Number(p.day)}, ${p.year}` : `${Number(p.day)} ${p.month} ${p.year}`
}

const ku = {
  more: { news: 'Hemû nûçe', concerts: 'Hemû konser', music: 'Hemû muzîk', bio: 'Biyografiya tevahî', videos: 'Hemû vîdeo', gallery: 'Galeriya tevahî', back: 'Vegere nûçeyan' },
  home: 'Destpêk',
  meta: {
    title: 'Azad Bedran – Malpera Fermî',
    description: 'Azad Bedran – stranbêj û muzîkjenê kurd. Muzîk, vîdeo, konser, nûçe û têkilî.',
  },
  nav: { news: 'Nûçe', music: 'Muzîk', videos: 'Vîdeo', bio: 'Biyografî', gallery: 'Wêne', concerts: 'Konser', contact: 'Têkilî' },
  hero: {
    eyebrow: 'Stranbêj · Muzîkjen',
    tagline: 'Stranên kurdî, ji kevneşopiyê heta îro.',
    listen: 'Guhdarî bike',
    watch: 'Vîdeoyan temaşe bike',
  },
  next: {
    label: 'Konsera bê',
    tickets: 'Bilêt bikire',
    soon: 'Konserên nû di demeke nêzîk de tên ragihandin.',
    follow: 'Azad bişopîne',
    doors: 'Destpêk',
  },
  ticker: 'Niha li ser hemû platforman',
  news: { kicker: 'Nûçe', title: 'Tiştên herî nû', more: 'Zêdetir' },
  music: {
    kicker: 'Muzîk',
    title: 'Diskografî',
    latest: 'Berhema herî nû',
    albums: 'Albûm',
    singles: 'Single',
    tracks: 'stran',
    album: 'Albûm',
    single: 'Single',
    ep: 'EP',
    live: 'Albûma zindî',
    listen: 'Guhdarî bike',
    preview: 'Pêşdîtin',
    previewText: 'Stranên herî populer ên Azad rasterast li vir guhdarî bike.',
  },
  embed: {
    load: 'Lîstikvan bar bike',
    notice: 'Dema ku tu bar dikî, daneyên te ji %s re têne şandin.',
  },
  stream: {
    kicker: 'Guhdarî & abone',
    title: 'Azad bişopîne',
    text: 'Li ser platforma xwe ya bijare Azad bişopîne û tu stranek nû ji dest nede.',
    subscribe: 'Li YouTubeê abone bibe',
  },
  buy: {
    kicker: 'Bikire',
    title: 'Muzîkê bikire',
    text: 'Stranan bi awayê dîjîtal bikire û rasterast piştgiriyê bide hunermend.',
  },
  videos: { kicker: 'Vîdeo', title: 'Klîp & performansên zindî', more: 'Hemû vîdeo li ser YouTubeê', play: 'Lê bide' },
  bio: {
    kicker: 'Biyografî',
    title: 'Dengek ji Sêwregê',
    paragraphs: [
      'Azad Bedran li Sêwrega Rihayê hat dinyayê. Dibistana seretayî û lîseyê li Amedê xwend.',
      'Di deh saliya xwe de li Navenda Çandê ya Dîcle-Firatê dest bi perwerdeya saz û dengê kir. Ji wê rojê ve muzîk bû beşek ji jiyana wî ya rojane.',
      'Sala 2016an albûma xwe ya solo ya yekem, “Rêwiyên Şad”, weşand. Bi strana “Wayê Wayê” (2019) û stranên din, li ser YouTubeê gihîşt bi milyonan guhdaran.',
      'Piştî albûmên “Evîna Azad” û “Paytexta Evînê” (2023), sala 2026an albûma zindî “Evîna Azad (Live)” derket. Azad îro li Amedê dijî û karên xwe yên hunerî li wir didomîne.',
    ],
    facts: [
      { value: '2016', label: 'Albûma yekem' },
      { value: '4', label: 'Albûm' },
      { value: '10+', label: 'Single' },
      { value: 'Amed', label: 'Bajarê wî' },
    ],
  },
  gallery: { kicker: 'Wêne', title: 'Galerî', placeholder: 'Wêne', close: 'Bigire' },
  concerts: {
    kicker: 'Konser',
    title: 'Li ser sahneyê',
    upcoming: 'Konserên bê',
    past: 'Konserên berê',
    tickets: 'Bilêt',
    soldOut: 'Bilêt neman',
    none: 'Niha konsereke plankirî tune ye. Di demeke nêzîk de dîrokên nû.',
  },
  contact: {
    kicker: 'Têkilî',
    title: 'Booking & pirs',
    text: 'Ji bo konser, dawet, festîval û pirsên çapemeniyê ji kerema xwe re rasterast bi menajerê Azad re têkilî daynin.',
    role: 'Menajer',
    call: 'Telefon bike',
    whatsapp: 'WhatsApp',
    email: 'E-name',
    follow: 'Li ser medyaya civakî',
  },
  footer: { rights: 'Hemû maf parastî ne.', imprint: 'Impressum', privacy: 'Nepenî', back: 'Vegere' },
  demo: 'MÎNAK',
}

export type Dict = typeof ku

const tr: Dict = {
  more: { news: 'Tüm haberler', concerts: 'Tüm konserler', music: 'Tüm müzik', bio: 'Biyografinin tamamı', videos: 'Tüm videolar', gallery: 'Tüm galeri', back: 'Haberlere dön' },
  home: 'Ana sayfa',
  meta: {
    title: 'Azad Bedran – Resmi Web Sitesi',
    description: 'Azad Bedran – Kürt şarkıcı ve müzisyen. Müzik, videolar, konserler, haberler ve iletişim.',
  },
  nav: { news: 'Haberler', music: 'Müzik', videos: 'Videolar', bio: 'Biyografi', gallery: 'Galeri', concerts: 'Konserler', contact: 'İletişim' },
  hero: {
    eyebrow: 'Şarkıcı · Müzisyen',
    tagline: 'Gelenekten bugüne Kürtçe şarkılar.',
    listen: 'Dinle',
    watch: 'Videoları izle',
  },
  next: {
    label: 'Sıradaki konser',
    tickets: 'Bilet al',
    soon: 'Yeni konser tarihleri yakında açıklanacak.',
    follow: 'Azad’ı takip et',
    doors: 'Başlangıç',
  },
  ticker: 'Şimdi tüm platformlarda',
  news: { kicker: 'Haberler', title: 'Son gelişmeler', more: 'Devamı' },
  music: {
    kicker: 'Müzik',
    title: 'Diskografi',
    latest: 'En yeni çalışma',
    albums: 'Albümler',
    singles: 'Single’lar',
    tracks: 'şarkı',
    album: 'Albüm',
    single: 'Single',
    ep: 'EP',
    live: 'Canlı albüm',
    listen: 'Dinle',
    preview: 'Ön dinleme',
    previewText: 'Azad’ın en sevilen şarkılarını doğrudan burada dinleyin.',
  },
  embed: {
    load: 'Oynatıcıyı yükle',
    notice: 'Yüklediğinizde verileriniz %s ile paylaşılır.',
  },
  stream: {
    kicker: 'Dinle & abone ol',
    title: 'Azad’ı takip et',
    text: 'En sevdiğin platformda Azad’ı takip et, hiçbir yeni şarkıyı kaçırma.',
    subscribe: 'YouTube’da abone ol',
  },
  buy: {
    kicker: 'Satın al',
    title: 'Müziği satın al',
    text: 'Şarkıları dijital olarak satın al ve sanatçıyı doğrudan destekle.',
  },
  videos: { kicker: 'Videolar', title: 'Klipler & canlı performanslar', more: 'Tüm videolar YouTube’da', play: 'Oynat' },
  bio: {
    kicker: 'Biyografi',
    title: 'Siverek’ten bir ses',
    paragraphs: [
      'Azad Bedran, Şanlıurfa’nın Siverek ilçesinde doğdu. İlk ve lise eğitimini Diyarbakır’da tamamladı.',
      'On yaşında Dicle Fırat Kültür Merkezi’nde bağlama ve ses eğitimi almaya başladı. O günden beri müzik hayatının ayrılmaz bir parçası.',
      '2016’da ilk solo albümü “Rêwiyên Şad”ı yayımladı. 2019’da çıkan “Wayê Wayê” ve diğer şarkılarıyla YouTube’da milyonlarca dinleyiciye ulaştı.',
      '2023’te “Evîna Azad” ve “Paytexta Evînê” albümlerinin ardından 2026’da canlı albümü “Evîna Azad (Live)” yayımlandı. Azad bugün Diyarbakır’da yaşıyor ve sanatsal çalışmalarını orada sürdürüyor.',
    ],
    facts: [
      { value: '2016', label: 'İlk albüm' },
      { value: '4', label: 'Albüm' },
      { value: '10+', label: 'Single' },
      { value: 'Amed', label: 'Yaşadığı şehir' },
    ],
  },
  gallery: { kicker: 'Fotoğraflar', title: 'Galeri', placeholder: 'Fotoğraf', close: 'Kapat' },
  concerts: {
    kicker: 'Konserler',
    title: 'Sahnede',
    upcoming: 'Yaklaşan konserler',
    past: 'Geçmiş konserler',
    tickets: 'Bilet',
    soldOut: 'Tükendi',
    none: 'Şu anda planlanmış bir konser yok. Yeni tarihler yakında.',
  },
  contact: {
    kicker: 'İletişim',
    title: 'Booking & talepler',
    text: 'Konser, düğün, festival ve basın talepleri için lütfen doğrudan Azad’ın menajeriyle iletişime geçin.',
    role: 'Menajer',
    call: 'Ara',
    whatsapp: 'WhatsApp',
    email: 'E-posta',
    follow: 'Sosyal medya',
  },
  footer: { rights: 'Tüm hakları saklıdır.', imprint: 'Künye', privacy: 'Gizlilik', back: 'Geri' },
  demo: 'ÖRNEK',
}

const en: Dict = {
  more: { news: 'All news', concerts: 'All concerts', music: 'All music', bio: 'Full biography', videos: 'All videos', gallery: 'Full gallery', back: 'Back to news' },
  home: 'Home',
  meta: {
    title: 'Azad Bedran – Official Website',
    description: 'Azad Bedran – Kurdish singer and musician. Music, videos, concerts, news and contact.',
  },
  nav: { news: 'News', music: 'Music', videos: 'Videos', bio: 'Biography', gallery: 'Gallery', concerts: 'Concerts', contact: 'Contact' },
  hero: {
    eyebrow: 'Singer · Musician',
    tagline: 'Kurdish songs, from tradition to today.',
    listen: 'Listen now',
    watch: 'Watch videos',
  },
  next: {
    label: 'Next concert',
    tickets: 'Get tickets',
    soon: 'New concert dates will be announced soon.',
    follow: 'Follow Azad',
    doors: 'Start',
  },
  ticker: 'Out now on all platforms',
  news: { kicker: 'News', title: 'Latest updates', more: 'Read more' },
  music: {
    kicker: 'Music',
    title: 'Discography',
    latest: 'Latest release',
    albums: 'Albums',
    singles: 'Singles',
    tracks: 'tracks',
    album: 'Album',
    single: 'Single',
    ep: 'EP',
    live: 'Live album',
    listen: 'Listen',
    preview: 'Preview',
    previewText: 'Listen to Azad’s most popular songs right here.',
  },
  embed: {
    load: 'Load player',
    notice: 'Loading the player shares your data with %s.',
  },
  stream: {
    kicker: 'Listen & subscribe',
    title: 'Follow Azad',
    text: 'Follow Azad on your favourite platform and never miss a new song.',
    subscribe: 'Subscribe on YouTube',
  },
  buy: {
    kicker: 'Buy',
    title: 'Buy the music',
    text: 'Buy the songs digitally and support the artist directly.',
  },
  videos: { kicker: 'Videos', title: 'Clips & live performances', more: 'All videos on YouTube', play: 'Play' },
  bio: {
    kicker: 'Biography',
    title: 'A voice from Siverek',
    paragraphs: [
      'Azad Bedran was born in Siverek in the province of Şanlıurfa and went to primary and high school in Diyarbakır.',
      'At the age of ten he began training in bağlama and voice at the Dicle Fırat Cultural Centre. Music has been part of his everyday life ever since.',
      'In 2016 he released his first solo album, “Rêwiyên Şad”. With “Wayê Wayê” (2019) and other songs he reached millions of listeners on YouTube.',
      'The albums “Evîna Azad” and “Paytexta Evînê” followed in 2023, and the live album “Evîna Azad (Live)” in 2026. Azad lives and works in Diyarbakır.',
    ],
    facts: [
      { value: '2016', label: 'Debut album' },
      { value: '4', label: 'Albums' },
      { value: '10+', label: 'Singles' },
      { value: 'Amed', label: 'Home city' },
    ],
  },
  gallery: { kicker: 'Photos', title: 'Gallery', placeholder: 'Photo', close: 'Close' },
  concerts: {
    kicker: 'Concerts',
    title: 'On stage',
    upcoming: 'Upcoming',
    past: 'Past concerts',
    tickets: 'Tickets',
    soldOut: 'Sold out',
    none: 'No concerts scheduled right now. New dates coming soon.',
  },
  contact: {
    kicker: 'Contact',
    title: 'Booking & enquiries',
    text: 'For concerts, weddings, festivals and press enquiries, please contact Azad’s manager directly.',
    role: 'Manager',
    call: 'Call',
    whatsapp: 'WhatsApp',
    email: 'Email',
    follow: 'Social media',
  },
  footer: { rights: 'All rights reserved.', imprint: 'Imprint', privacy: 'Privacy', back: 'Back' },
  demo: 'DEMO',
}

const dictionaries: Record<Locale, Dict> = { ku, tr, en }
export const getDict = (locale: Locale) => dictionaries[locale]
