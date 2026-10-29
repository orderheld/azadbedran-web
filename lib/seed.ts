// Startinhalte. Werden in die Neon-Datenbank übernommen (npm run db:setup)
// und dienen als Fallback, solange keine Datenbank verbunden ist.

export type Concert = {
  id: number
  date: string // YYYY-MM-DD (Ortszeit)
  time: string | null // HH:MM, Einlass/Beginn laut Veranstalter
  city: string
  venue: string | null // null = Ort noch nicht bekannt gegeben
  address: string | null
  country: string // ISO-Code
  ticketUrl: string | null
  phone: string | null // Reservierung, falls kein Online-Ticket
  poster: string | null
  soldOut: boolean
}

export type NewsItem = {
  id: number
  date: string
  title: { ku: string; tr: string; en: string; ru: string }
  body: { ku: string; tr: string; en: string; ru: string }
  image: string | null
  link: string | null
}

const tour = '/images/poster-kasim-2026.jpg'

// Quellen: Tourplakat „Kasım Konserleri“ und Veranstalterplakat St. Petersburg (von Ferhat, 29.10.2026),
// biletsirasi.com/konser/azad-bedran und izmir.art (abgerufen 28.10.2026)
export const seedConcerts: Concert[] = [
  { id: 11, date: '2026-11-15', time: '19:00', city: 'Sankt Petersburg', venue: 'Skazka Vostoka „1001 ночь“', address: 'Lesnoy prospekt 48', country: 'RU', ticketUrl: null, phone: '+7 981 717-60-62', poster: '/images/poster-st-petersburg-2026.jpg', soldOut: false },
  { id: 12, date: '2026-11-27', time: null, city: 'Paris', venue: null, address: null, country: 'FR', ticketUrl: null, phone: null, poster: tour, soldOut: false },
  { id: 13, date: '2026-11-28', time: null, city: 'Reims', venue: null, address: null, country: 'FR', ticketUrl: null, phone: null, poster: tour, soldOut: false },
  { id: 14, date: '2026-11-29', time: null, city: 'Kiel', venue: null, address: null, country: 'DE', ticketUrl: null, phone: null, poster: tour, soldOut: false },

  { id: 1, date: '2026-01-10', time: '21:30', city: 'Amed / Diyarbakır', venue: 'Sezai Karakoç Kültür ve Kongre Merkezi', address: null, country: 'TR', ticketUrl: null, phone: null, poster: null, soldOut: false },
  { id: 8, date: '2025-12-14', time: '20:00', city: 'Köln', venue: 'Sartory Säle', address: 'Friesenstraße 44–48', country: 'DE', ticketUrl: null, phone: null, poster: null, soldOut: false },
  { id: 2, date: '2025-12-06', time: '21:30', city: 'İstanbul', venue: 'Trump Sahne', address: null, country: 'TR', ticketUrl: null, phone: null, poster: null, soldOut: false },
  { id: 3, date: '2025-11-21', time: '22:00', city: 'Adana', venue: 'Yaşar Kemal Kültür Merkezi', address: null, country: 'TR', ticketUrl: null, phone: null, poster: null, soldOut: false },
  { id: 4, date: '2025-10-25', time: '22:00', city: 'Bursa', venue: 'BAOB Sahne', address: null, country: 'TR', ticketUrl: null, phone: null, poster: null, soldOut: false },
  { id: 5, date: '2025-06-20', time: '22:00', city: 'Êlih / Batman', venue: 'Batman İl Kültür Merkezi', address: null, country: 'TR', ticketUrl: null, phone: null, poster: null, soldOut: false },
  { id: 6, date: '2025-06-18', time: '22:00', city: 'Sêrt / Siirt', venue: 'Av. Tahir Elçi Konferans Salonu', address: null, country: 'TR', ticketUrl: null, phone: null, poster: null, soldOut: false },
  { id: 9, date: '2025-03-18', time: null, city: 'Colemêrg / Hakkari', venue: 'Newroz 2025', address: null, country: 'TR', ticketUrl: null, phone: null, poster: null, soldOut: false },
  { id: 10, date: '2025-03-17', time: null, city: 'Erdîş / Erciş (Wan)', venue: 'Newroz 2025', address: null, country: 'TR', ticketUrl: null, phone: null, poster: null, soldOut: false },
  { id: 7, date: '2024-09-26', time: '20:00', city: 'İzmir', venue: 'Nazım Hikmet Kültür Merkezi', address: null, country: 'TR', ticketUrl: null, phone: null, poster: null, soldOut: false },
]

const cover = (path: string) => `https://is1-ssl.mzstatic.com/image/thumb/${path}/1000x1000bb.jpg`

// Nur belegte Ereignisse: Veröffentlichungsdaten laut Apple Music, Konzerte laut Plakat.
export const seedNews: NewsItem[] = [
  {
    id: 5,
    date: '2026-10-29',
    title: { ku: 'Konserên Mijdarê: Rûsya, Fransa, Almanya', tr: 'Kasım konserleri: Rusya, Fransa, Almanya', en: 'November concerts: Russia, France, Germany', ru: 'Ноябрьские концерты: Россия, Франция, Германия' },
    body: {
      ku: 'Azad Bedran di Mijdarê de li çar bajaran derdikeve ser sahneyê: 15ê Mijdarê li Sankt Petersburgê, 27ê li Parîsê, 28ê li Reimsê û 29ê li Kielê. Konsera Sankt Petersburgê li Restoran „Skazka Vostoka – 1001 Noç“ (Lesnoy prospekt 48) ye, deriyên salonê saet 19:00an vedibin; ji bo cih rezervekirinê: +7 981 717-60-62 an +7 812 295-31-05. Cih û bilêtên Parîs, Reims û Kielê dê di demeke nêzîk de werin ragihandin.',
      tr: 'Azad Bedran kasımda dört şehirde sahnede: 15 Kasım St. Petersburg, 27 Kasım Paris, 28 Kasım Reims ve 29 Kasım Kiel. St. Petersburg konseri Restoran „Skazka Vostoka – 1001 Noç“ta (Lesnoy prospekt 48); kapılar 19:00’da açılıyor, rezervasyon: +7 981 717-60-62 veya +7 812 295-31-05. Paris, Reims ve Kiel için mekân ve bilet bilgileri yakında duyurulacak.',
      en: 'Azad Bedran plays four cities in November: St. Petersburg on 15 November, Paris on the 27th, Reims on the 28th and Kiel on the 29th. The St. Petersburg show is at Restaurant “Skazka Vostoka – 1001 Nights” (Lesnoy prospekt 48), doors at 7 pm, reservations on +7 981 717-60-62 or +7 812 295-31-05. Venues and tickets for Paris, Reims and Kiel will be announced soon.',
      ru: 'В ноябре Азад Бедран выступит в четырёх городах: 15 ноября в Санкт-Петербурге, 27-го в Париже, 28-го в Реймсе и 29-го в Киле. Концерт в Санкт-Петербурге пройдёт в ресторане «Сказка Востока 1001 Ночь» (Лесной проспект, 48), сбор гостей в 19:00, бронирование столов: +7 981 717-60-62 или +7 812 295-31-05. Площадки и билеты в Париже, Реймсе и Киле будут объявлены в ближайшее время.',
    },
    image: tour,
    link: null,
  },
  {
    id: 1,
    date: '2026-10-08',
    title: { ku: 'Single ya nû: “Ez Dînim”', tr: 'Yeni single: “Ez Dînim”', en: 'New single: “Ez Dînim”', ru: 'Новый сингл «Ez Dînim»' },
    body: {
      ku: 'Strana nû ya Azad Bedran “Ez Dînim” ji 8ê Cotmeha 2026an ve li ser hemû platformên muzîkê ye. Li vir guhdarî bike û platforma xwe hilbijêre.',
      tr: 'Azad Bedran’ın yeni şarkısı “Ez Dînim” 8 Ekim 2026’dan beri tüm dijital platformlarda. Buradan dinleyebilir, platformunu seçebilirsin.',
      en: 'Azad Bedran’s new single “Ez Dînim” has been out on every streaming platform since 8 October 2026. Listen here and pick your platform.',
      ru: 'Новый сингл Азада Бедрана «Ez Dînim» доступен на всех стриминговых платформах с 8 октября 2026 года. Слушайте здесь и выбирайте свою платформу.',
    },
    image: cover('Music221/v4/14/1a/7a/141a7adc-6a72-b5e9-5963-83662ed966a6/artwork.jpg'),
    link: null,
  },
  {
    id: 2,
    date: '2026-09-24',
    title: { ku: 'Bi Suleyman re: “Tu Çîrokek Bê Hempa”', tr: 'Suleyman ile: “Tu Çîrokek Bê Hempa”', en: 'With Suleyman: “Tu Çîrokek Bê Hempa”', ru: 'С Сулейманом: «Tu Çîrokek Bê Hempa»' },
    body: {
      ku: 'Azad Bedran û Suleyman strana hevpar “Tu Çîrokek Bê Hempa” di 24ê Îlona 2026an de weşandin.',
      tr: 'Azad Bedran ve Suleyman’ın birlikte seslendirdiği “Tu Çîrokek Bê Hempa” 24 Eylül 2026’da yayımlandı.',
      en: 'Azad Bedran and Suleyman released their joint single “Tu Çîrokek Bê Hempa” on 24 September 2026.',
      ru: 'Азад Бедран и Сулейман выпустили совместный сингл «Tu Çîrokek Bê Hempa» 24 сентября 2026 года.',
    },
    image: cover('Music221/v4/76/c3/62/76c3628a-f6ff-0843-650f-a132bd0931e6/artwork.jpg'),
    link: null,
  },
  {
    id: 3,
    date: '2026-07-31',
    title: { ku: 'Albûma zindî: “Evîna Azad (Live)”', tr: 'Canlı albüm: “Evîna Azad (Live)”', en: 'Live album: “Evîna Azad (Live)”', ru: 'Концертный альбом «Evîna Azad (Live)»' },
    body: {
      ku: '13 stran, bi enerjiya sahneyê: albûma zindî “Evîna Azad (Live)” di 31ê Tîrmeha 2026an de derket – di nav de “Zindan” jî heye, strana wî ya herî naskirî.',
      tr: 'Sahnenin enerjisiyle 13 şarkı: canlı albüm “Evîna Azad (Live)” 31 Temmuz 2026’da çıktı – aralarında en bilinen şarkısı “Zindan” da var.',
      en: 'Thirteen songs with the energy of the stage: the live album “Evîna Azad (Live)” came out on 31 July 2026, including “Zindan”, his best-known song.',
      ru: 'Тринадцать песен с энергией сцены: концертный альбом «Evîna Azad (Live)» вышел 31 июля 2026 года – в том числе «Zindan», его самая известная песня.',
    },
    image: cover('Music211/v4/33/ed/4c/33ed4cd1-1a2c-babb-770a-113d900bf9a5/cover.jpg'),
    link: null,
  },
  {
    id: 4,
    date: '2026-03-26',
    title: { ku: 'Ji bo Amedsporê: “Amedspor Geliyor”', tr: 'Amedspor için: “Amedspor Geliyor”', en: 'For Amedspor: “Amedspor Geliyor”', ru: 'Для «Амедспора»: «Amedspor Geliyor»' },
    body: {
      ku: 'Piştî “Aşk Amedspor”, Azad Bedran di 26ê Adara 2026an de strana nû “Amedspor Geliyor” ji bo tîma Amedê weşand.',
      tr: '“Aşk Amedspor”un ardından Azad Bedran, 26 Mart 2026’da Amed takımı için yeni şarkısı “Amedspor Geliyor”u yayımladı.',
      en: 'Following “Aşk Amedspor”, Azad Bedran released a new anthem for the Amed club, “Amedspor Geliyor”, on 26 March 2026.',
      ru: 'Вслед за «Aşk Amedspor» Азад Бедран 26 марта 2026 года выпустил новый гимн для клуба из Амеда – «Amedspor Geliyor».',
    },
    image: cover('Music221/v4/23/7f/e5/237fe520-49e6-3dd3-d5dd-abc61512280a/cover.jpg'),
    link: null,
  },
]
