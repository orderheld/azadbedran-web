export const locales = ['ku', 'tr', 'en', 'ru'] as const
export type Locale = (typeof locales)[number]

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v)

export const localeNames: Record<Locale, string> = { ku: 'Kurmancî', tr: 'Türkçe', en: 'English', ru: 'Русский' }
export const htmlLang: Record<Locale, string> = { ku: 'ku', tr: 'tr', en: 'en', ru: 'ru' }

const months: Record<Locale, string[]> = {
  ku: ['Rêbendan', 'Reşemî', 'Adar', 'Avrêl', 'Gulan', 'Pûşper', 'Tîrmeh', 'Gelawêj', 'Rezber', 'Kewçêr', 'Sermawez', 'Berfanbar'],
  tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
}

const weekdays: Record<Locale, string[]> = {
  ku: ['Yekşem', 'Duşem', 'Sêşem', 'Çarşem', 'Pêncşem', 'În', 'Şemî'],
  tr: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  ru: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
}

export function dateParts(iso: string, locale: Locale) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  const month = months[locale][m - 1]
  const weekday = weekdays[locale][new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
  return { day: String(d).padStart(2, '0'), month, monthShort: month.slice(0, 3), year: String(y), weekday }
}

export function formatDate(iso: string, locale: Locale) {
  const p = dateParts(iso, locale)
  return `${Number(p.day)} ${p.month} ${p.year}`
}

export const countries: Record<string, Record<Locale, string>> = {
  TR: { ku: 'Tirkiye', tr: 'Türkiye', en: 'Türkiye', ru: 'Турция' },
  RU: { ku: 'Rûsya', tr: 'Rusya', en: 'Russia', ru: 'Россия' },
  FR: { ku: 'Fransa', tr: 'Fransa', en: 'France', ru: 'Франция' },
  DE: { ku: 'Almanya', tr: 'Almanya', en: 'Germany', ru: 'Германия' },
  CH: { ku: 'Swîsre', tr: 'İsviçre', en: 'Switzerland', ru: 'Швейцария' },
  AT: { ku: 'Awistirya', tr: 'Avusturya', en: 'Austria', ru: 'Австрия' },
  NL: { ku: 'Holenda', tr: 'Hollanda', en: 'Netherlands', ru: 'Нидерланды' },
  BE: { ku: 'Belçîka', tr: 'Belçika', en: 'Belgium', ru: 'Бельгия' },
  SE: { ku: 'Swêd', tr: 'İsveç', en: 'Sweden', ru: 'Швеция' },
  GB: { ku: 'Brîtanya', tr: 'Birleşik Krallık', en: 'United Kingdom', ru: 'Великобритания' },
  AM: { ku: 'Ermenistan', tr: 'Ermenistan', en: 'Armenia', ru: 'Армения' },
  KZ: { ku: 'Qazaxistan', tr: 'Kazakistan', en: 'Kazakhstan', ru: 'Казахстан' },
  IQ: { ku: 'Iraq', tr: 'Irak', en: 'Iraq', ru: 'Ирак' },
}
export const countryName = (code: string, l: Locale) => countries[code]?.[l] ?? code

// Quellen der Biografie (abgerufen 29.10.2026)
export const bioSources = [
  { label: 'Bernamegeh – “Azad Bedran kimdir?”', url: 'https://www.bernamegeh.com/azad-bedran-kimdir' },
  { label: 'Hunersam – Azad Bedran', url: 'https://hunersam.com.tr/azadbedran' },
  { label: 'bianet – “We have gotten hungry for freedom” (01.10.2018)', url: 'https://bianet.org/english/art/201264-new-composition-by-selahattin-demirtas-we-get-hungry-for-freedom' },
  { label: 'Medgündem – “Kürt sanatçısı Azad Bedran: Sanat hakikatin arayışıdır” (16.03.2018)', url: 'https://www.medgundem.com/kurt-sanatcisi-azad-bedransanat-hakikatin-arayisidir' },
  { label: 'Kurdevents – Azad Bedran', url: 'https://kurdevents.com/ku/sanatci/bedran-azad/' },
  { label: 'Yeni Yaşam – Newroz 2025 (13.03.2025)', url: 'https://yeniyasamgazetesi9.com/newrozda-sahne-alacak-sanatcilar-belli-oldu/' },
  { label: 'Sartory Köln – Azad Bedran live (14.12.2025)', url: 'https://sartory.de/event/art-records-gmbh-5/' },
  { label: 'Skazka Vostoka “1001 ночь” – Azad Bedran (15.11.2026)', url: 'https://skazkavostokaspb.ru/2026/10/10/azad-bedran-%d0%b2%d1%8b%d1%81%d1%82%d1%83%d0%bf%d0%b8%d1%82-%d0%b2-%d1%80%d0%b5%d1%81%d1%82%d0%be%d1%80%d0%b0%d0%bd%d0%b5-%d1%81%d0%ba%d0%b0%d0%b7%d0%ba%d0%b0-%d0%b2%d0%be%d1%81%d1%82%d0%be/' },
  { label: 'Apple Music – discography', url: 'https://music.apple.com/artist/azad-bedran/1116072473' },
  { label: 'Shazam – Azad Bedran', url: 'https://www.shazam.com/artist/azad-bedran/1116072473' },
]

const ku = {
  meta: {
    title: 'Azad Bedran – Malpera Fermî',
    description: 'Azad Bedran – stranbêj, stranivîs û sazbendê kurd ji Amedê. Muzîk, vîdeo, konser, nûçe û têkilî.',
  },
  nav: { music: 'Muzîk', concerts: 'Konser', videos: 'Vîdeo', bio: 'Jiyan', gallery: 'Wêne', news: 'Nûçe', contact: 'Têkilî' },
  home: 'Destpêk',
  skip: 'Here naverokê',
  menu: 'Menû',
  close: 'Bigire',
  hero: {
    kicker: 'Stranbêj · Stranivîs · Amed',
    tagline: 'Stranên kurdî, ji kevneşopiyê heta îro.',
    listen: 'Guhdarî bike',
    concerts: 'Konser',
    nextShow: 'Konsera bê',
  },
  player: {
    preview: 'Pêşguhdarî',
    play: 'Lêxe',
    pause: 'Rawestîne',
    next: 'Ya din',
    prev: 'Ya berê',
    close: 'Bigire',
    full: 'Strana tevahî',
    hint: 'Pêşguhdariya 30 çirkeyan. Strana tevahî li ser platforma xwe guhdarî bike.',
    none: 'Ji bo vê stranê pêşguhdarî tune.',
  },
  choose: { title: 'Platforma xwe hilbijêre', stream: 'Guhdarî bike', buy: 'Bikire', open: 'Li ku guhdarî bikim?' },
  music: {
    kicker: 'Muzîk',
    title: 'Diskografî',
    latest: 'Berhema herî nû',
    out: 'Niha li ser hemû platforman',
    albums: 'Albûm',
    singles: 'Single',
    all: 'Hemû',
    tracks: 'stran',
    album: 'Albûm',
    live: 'Albûma zindî',
    single: 'Single',
    with: 'bi',
    feat: 'bi beşdariya',
    tracklist: 'Lîsteya stranan',
    count: (n: number) => `${n} berhem`,
    platforms: 'Li ser platforman',
    platformsText: 'Hemû stranên Azad Bedran li ser platformên mezin ên muzîkê ne.',
    more: 'Hemû muzîk',
    source: 'Daneyên diskografiyê: Apple Music (bixweber tên nûkirin).',
  },
  videos: {
    kicker: 'Vîdeo',
    title: 'Klîp & performans',
    play: 'Lê bide',
    more: 'Hemû vîdeo li ser YouTubeê',
    subscribe: 'Li YouTubeê bibe abone',
    views: 'temaşe',
    fromChannel: 'Rasterast ji kanala fermî ya YouTubeê.',
  },
  concerts: {
    kicker: 'Konser',
    title: 'Li ser sahneyê',
    upcoming: 'Konserên bê',
    past: 'Konserên berê',
    next: 'Konsera bê',
    tickets: 'Bilêt',
    ticketsSoon: 'Bilêt: di demeke nêzîk de',
    reserve: 'Rezervasyon',
    venueTba: 'Cih dê were ragihandin',
    doors: 'Derî vedibin',
    soldOut: 'Bilêt qediyan',
    daysLeft: (n: number) => (n === 0 ? 'Îro' : n === 1 ? 'Sibê' : `${n} roj maye`),
    none: 'Niha konserên nû nehatine ragihandin. Ji bo nûçeyan Azad li ser Instagramê bişopîne.',
    poster: 'Afîş',
    more: 'Hemû konser',
    info: 'Agahiyên zêdetir',
    booking: 'Ji bo konser û dawetan',
  },
  bio: {
    kicker: 'Jiyan',
    title: 'Biyografî',
    lead: 'Dengek ji Amedê: ji koroya zarokan a Navenda Çandê ya Dicle Firatê heta sahneyên Ewropa û Rûsyayê.',
    more: 'Biyografiya tevahî',
    facts: [
      { value: '1993', label: 'Li Sêwregê hatiye dinyayê' },
      { value: '2016', label: 'Albûma yekem' },
      { value: '4', label: 'Albûm' },
      { value: '50+', label: 'Berhem li ser platforman' },
    ],
    sections: [
      {
        h: 'Ji Sêwregê heta Amedê',
        p: [
          'Azad Bedran stranbêj, stranivîs û sazbendekî kurd e ku navê wî bi Amedê re tê nasîn. Ew di 2ê Reşemiya 1993an de li Sêwrega Rihayê hatiye dinyayê. Beşek ji zarokatiya wî li Tarsûsê derbas bûye; paşê malbata wî li Amedê bi cih bûye – bajarê ku muzîka wî lê gihaye.',
        ],
      },
      {
        h: 'Destpêka muzîkê',
        p: [
          'Di deh saliya xwe de li Navenda Çandê ya Dicle Firatê ya li Amedê dest bi perwerdeya saz û deng kir. Di koroya zarokan Koma Kulîlkên Me de stran got; paşê bû solîst û sazbendê Koma Nûjiyanê, ku li gelek konser û festîvalan derket ser sahneyê.',
          'Mamosteyên wî yên pêşîn Farqîn Azad û Bülent Turan bûn; di nav hunermendên ku bandor li wî kirine de Aram Tigran, Meryem Xan, Hozan Serhad, Eyşe Şan, Mizgîn û Ahmet Kaya hene. Strana xwe ya yekem, “Ax Çiyao”, bi Farqîn Azad, Bülent Turan û Xanemir re tomar kir; di 2012an de bi Hozan Diyar re duet kir. Ew hîn jî li Navenda Çandê ya Dicle Firatê dixebite.',
        ],
      },
      {
        h: 'Albûma yekem û “Aç Kaldık Özgürlüğe”',
        p: [
          'Di 2016an de albûma wî ya yekem a solo, Rêwiyên Şad, bi 14 stranan ji labela Kom Müzikê derket. Albûm stranên gelêrî yên anonîm û berhemên wî bi xwe digihîne hev û bi Hozan Comerd, Farqîn Azad û Xalê Seyitxan re duet tê de hene. Di 2018an de strana “Aç Kaldık Özgürlüğe” – ku Selahattin Demirtaş li girtîgeha Edirneyê nivîsandibû – bi dengê xwe tomar kir; klîpa wê di 1ê Kewçêra 2018an de hate weşandin.',
        ],
      },
      {
        h: 'Zindan û mîlyonan guhdar',
        p: [
          'Di 2019an de “Zindan” û “Ez Nisêbin Tu Qamişlo” li YouTubeê gihîştin mîlyonan guhdaran. “Zindan” heta îro strana wî ya herî zêde li ser Shazamê tê naskirin.',
        ],
      },
      {
        h: 'Diskografî',
        p: [
          'Ji 2021ê vir ve Azad Bedran bi rêkûpêk stranên nû diweşîne – ji “Wayê Wayê” û “Ki Zava” heta “Çavênte Welatêmine”, “Bêhna Bihuşt”, “Nîno” û “Bargiran” bi Berfîn Mamedova re. Di 2023an de du albûm derketin: Evîna Azad û Paytexta Evînê. Ji bo klûbên futbolê Amedspor û Cizrespor jî stran gotin. Îro li ser platformên dîjîtal zêdetirî 50 berhemên wî hene.',
        ],
      },
      {
        h: 'Li ser sahneyê',
        p: [
          'Azad Bedran li Amed, Stenbol, Adana, Bursa, Êlih, Sêrt û Îzmîrê konser dane; li derveyî welat jî li Ewropa, Rûsya, Ermenistan û Qazaxistanê derketiye ser sahneyê. Di Newroza 2025an de li Erdîşa Wanê û li Colemêrgê stran gotin, û di 14ê Berfanbara 2025an de li Kolnê (Almanya) di salona Sartoryê de konser da. Di Tîrmeha 2026an de albûma zindî Evîna Azad (Live) bi 13 stranan derket. Di Sermawezê 2026an de li Sankt Petersburg, Parîs, Reims û Kielê konser dide.',
        ],
      },
    ],
    timelineTitle: 'Rêwîtî',
    timeline: [
      { year: '1993', text: 'Li Sêwrega Rihayê tê dinyayê' },
      { year: '2016', text: 'Albûma yekem: Rêwiyên Şad' },
      { year: '2018', text: '“Aç Kaldık Özgürlüğe”' },
      { year: '2019', text: '“Zindan” û “Ez Nisêbin Tu Qamişlo” digihîjin mîlyonan' },
      { year: '2023', text: 'Albûmên Evîna Azad û Paytexta Evînê' },
      { year: '2025', text: 'Newroz li Erdîş û Colemêrgê; konser li Êlih, Sêrt, Bursa, Adana, Stenbol û Kolnê' },
      { year: '2026', text: 'Evîna Azad (Live) û konser li Rûsya, Fransa û Almanyayê' },
    ],
    quote: 'Huner lêgerîna rastiyê ye.',
    sources: 'Çavkanî',
  },
  gallery: { kicker: 'Wêne', title: 'Galerî', more: 'Hemû wêne' },
  news: { kicker: 'Nûçe', title: 'Nûçe', more: 'Hemû nûçe', back: 'Vegere nûçeyan', read: 'Bixwîne' },
  contact: {
    kicker: 'Têkilî',
    title: 'Booking & têkilî',
    text: 'Ji bo konser, dawet, festîval û pirsên çapemeniyê rasterast bi rêveberê Azad re têkilî daynin.',
    role: 'Rêveber',
    call: 'Telefon bike',
    whatsapp: 'WhatsApp',
    follow: 'Azad bişopîne',
  },
  platforms: 'Li ser platforman guhdarî bike',
  footer: { rights: 'Hemû maf parastî ne.', imprint: 'Impressum', privacy: 'Nepenî', back: 'Vegere' },
}

export type Dict = typeof ku

const tr: Dict = {
  meta: {
    title: 'Azad Bedran – Resmî Web Sitesi',
    description: 'Azad Bedran – Amedli Kürt şarkıcı, söz yazarı ve bağlama sanatçısı. Müzik, videolar, konserler, haberler ve iletişim.',
  },
  nav: { music: 'Müzik', concerts: 'Konserler', videos: 'Videolar', bio: 'Biyografi', gallery: 'Galeri', news: 'Haberler', contact: 'İletişim' },
  home: 'Ana sayfa',
  skip: 'İçeriğe geç',
  menu: 'Menü',
  close: 'Kapat',
  hero: {
    kicker: 'Şarkıcı · Söz yazarı · Amed',
    tagline: 'Gelenekten bugüne Kürtçe şarkılar.',
    listen: 'Dinle',
    concerts: 'Konserler',
    nextShow: 'Sıradaki konser',
  },
  player: {
    preview: 'Önizleme',
    play: 'Oynat',
    pause: 'Duraklat',
    next: 'Sonraki',
    prev: 'Önceki',
    close: 'Kapat',
    full: 'Şarkının tamamı',
    hint: '30 saniyelik önizleme. Şarkının tamamını dilediğin platformda dinle.',
    none: 'Bu şarkı için önizleme yok.',
  },
  choose: { title: 'Platformunu seç', stream: 'Dinle', buy: 'Satın al', open: 'Nerede dinlemek istersin?' },
  music: {
    kicker: 'Müzik',
    title: 'Diskografi',
    latest: 'Yeni çıkan',
    out: 'Şimdi tüm platformlarda',
    albums: 'Albümler',
    singles: 'Single’lar',
    all: 'Tümü',
    tracks: 'şarkı',
    album: 'Albüm',
    live: 'Canlı albüm',
    single: 'Single',
    with: 'ile',
    feat: 'konuk:',
    tracklist: 'Şarkı listesi',
    count: (n: number) => `${n} yayın`,
    platforms: 'Platformlarda',
    platformsText: 'Azad Bedran’ın tüm şarkıları büyük müzik platformlarında.',
    more: 'Tüm müzik',
    source: 'Diskografi verileri: Apple Music (otomatik güncellenir).',
  },
  videos: {
    kicker: 'Videolar',
    title: 'Klipler & performanslar',
    play: 'Oynat',
    more: 'Tüm videolar YouTube’da',
    subscribe: 'YouTube’da abone ol',
    views: 'izlenme',
    fromChannel: 'Doğrudan resmî YouTube kanalından.',
  },
  concerts: {
    kicker: 'Konserler',
    title: 'Sahnede',
    upcoming: 'Yaklaşan konserler',
    past: 'Geçmiş konserler',
    next: 'Sıradaki konser',
    tickets: 'Bilet',
    ticketsSoon: 'Biletler yakında',
    reserve: 'Rezervasyon',
    venueTba: 'Mekân yakında açıklanacak',
    doors: 'Kapı açılışı',
    soldOut: 'Tükendi',
    daysLeft: (n: number) => (n === 0 ? 'Bugün' : n === 1 ? 'Yarın' : `${n} gün kaldı`),
    none: 'Şu an duyurulmuş yeni konser yok. Duyurular için Azad’ı Instagram’da takip et.',
    poster: 'Afiş',
    more: 'Tüm konserler',
    info: 'Daha fazla bilgi',
    booking: 'Konser ve düğünler için',
  },
  bio: {
    kicker: 'Biyografi',
    title: 'Biyografi',
    lead: 'Amed’den bir ses: Dicle Fırat Kültür Merkezi’nin çocuk korosundan Avrupa ve Rusya sahnelerine.',
    more: 'Biyografinin tamamı',
    facts: [
      { value: '1993', label: 'Siverek’te doğdu' },
      { value: '2016', label: 'İlk albüm' },
      { value: '4', label: 'Albüm' },
      { value: '50+', label: 'Dijital yayın' },
    ],
    sections: [
      {
        h: 'Siverek’ten Amed’e',
        p: [
          'Azad Bedran, adı Amed (Diyarbakır) ile özdeşleşmiş Kürt şarkıcı, söz yazarı ve bağlama sanatçısıdır. 2 Şubat 1993’te Şanlıurfa’nın Siverek ilçesinde doğdu. Çocukluğunun bir bölümü Tarsus’ta geçti; ardından ailesi, müziğinin şekillendiği şehir Diyarbakır’a yerleşti.',
        ],
      },
      {
        h: 'Müziğe ilk adımlar',
        p: [
          'On yaşında Diyarbakır’daki Dicle Fırat Kültür Merkezi’nde bağlama ve ses eğitimi almaya başladı. Koma Kulîlkên Me çocuk korosunda şarkı söyledi, ardından birçok konser ve festivalde sahne alan Koma Nûjiyan grubunun solisti ve bağlamacısı oldu.',
          'İlk hocaları Farqîn Azad ve Bülent Turan’dı; etkilendiği isimler arasında Aram Tigran, Meryem Xan, Hozan Serhad, Eyşe Şan, Mizgîn ve Ahmet Kaya var. İlk şarkısı “Ax Çiyao”yu Farqîn Azad, Bülent Turan ve Xanemir ile kaydetti; 2012’de Hozan Diyar ile düet yaptı. Bugün hâlâ Dicle Fırat Kültür Merkezi’nde çalışıyor.',
        ],
      },
      {
        h: 'İlk albüm ve “Aç Kaldık Özgürlüğe”',
        p: [
          '2016’da ilk solo albümü Rêwiyên Şad, 14 şarkıyla Kom Müzik etiketinden çıktı. Albüm anonim halk şarkılarını kendi eserleriyle buluşturuyor; Hozan Comerd, Farqîn Azad ve Xalê Seyitxan ile düetler içeriyor. 2018’de Selahattin Demirtaş’ın Edirne Cezaevi’nde yazdığı “Aç Kaldık Özgürlüğe” şarkısını seslendirdi; klibi 1 Ekim 2018’de yayımlandı.',
        ],
      },
      {
        h: 'Zindan ve milyonlarca dinleyici',
        p: [
          '2019’da “Zindan” ve “Ez Nisêbin Tu Qamişlo” YouTube’da milyonlarca dinleyiciye ulaştı. “Zindan” bugün hâlâ Shazam’da en çok tanınan şarkısı.',
        ],
      },
      {
        h: 'Diskografi',
        p: [
          '2021’den bu yana düzenli olarak yeni şarkılar yayımlıyor: “Wayê Wayê” ve “Ki Zava”dan “Çavênte Welatêmine”, “Bêhna Bihuşt”, “Nîno” ve Berfîn Mamedova ile “Bargiran”a kadar. 2023’te iki albüm geldi: Evîna Azad ve Paytexta Evînê. Amedspor ve Cizrespor için de şarkılar seslendirdi. Bugün dijital platformlarda 50’yi aşkın yayını bulunuyor.',
        ],
      },
      {
        h: 'Sahnede',
        p: [
          'Diyarbakır, İstanbul, Adana, Bursa, Batman, Siirt ve İzmir’de konserler verdi; yurt dışında Avrupa, Rusya, Ermenistan ve Kazakistan’da sahneye çıktı. Newroz 2025’te Van Erciş ve Hakkari’de sahne aldı; 14 Aralık 2025’te Köln’de (Almanya) Sartory salonunda konser verdi. Temmuz 2026’da 13 şarkılık canlı albümü Evîna Azad (Live) yayımlandı. Kasım 2026’da St. Petersburg, Paris, Reims ve Kiel’de konserleri var.',
        ],
      },
    ],
    timelineTitle: 'Yolculuk',
    timeline: [
      { year: '1993', text: 'Şanlıurfa Siverek’te doğdu' },
      { year: '2016', text: 'İlk albüm: Rêwiyên Şad' },
      { year: '2018', text: '“Aç Kaldık Özgürlüğe”' },
      { year: '2019', text: '“Zindan” ve “Ez Nisêbin Tu Qamişlo” milyonlara ulaştı' },
      { year: '2023', text: 'Evîna Azad ve Paytexta Evînê albümleri' },
      { year: '2025', text: 'Erciş ve Hakkari’de Newroz; Batman, Siirt, Bursa, Adana, İstanbul ve Köln konserleri' },
      { year: '2026', text: 'Evîna Azad (Live) ve Rusya, Fransa, Almanya konserleri' },
    ],
    quote: 'Sanat hakikatin arayışıdır.',
    sources: 'Kaynaklar',
  },
  gallery: { kicker: 'Fotoğraflar', title: 'Galeri', more: 'Tüm fotoğraflar' },
  news: { kicker: 'Haberler', title: 'Haberler', more: 'Tüm haberler', back: 'Haberlere dön', read: 'Oku' },
  contact: {
    kicker: 'İletişim',
    title: 'Booking & iletişim',
    text: 'Konser, düğün, festival ve basın talepleri için doğrudan Azad’ın menajeriyle iletişime geçin.',
    role: 'Menajer',
    call: 'Ara',
    whatsapp: 'WhatsApp',
    follow: 'Azad’ı takip et',
  },
  platforms: 'Platformlarda dinle',
  footer: { rights: 'Tüm hakları saklıdır.', imprint: 'Künye', privacy: 'Gizlilik', back: 'Geri' },
}

const en: Dict = {
  meta: {
    title: 'Azad Bedran – Official Website',
    description: 'Azad Bedran – Kurdish singer, songwriter and saz player from Amed. Music, videos, concerts, news and booking.',
  },
  nav: { music: 'Music', concerts: 'Concerts', videos: 'Videos', bio: 'Biography', gallery: 'Gallery', news: 'News', contact: 'Contact' },
  home: 'Home',
  skip: 'Skip to content',
  menu: 'Menu',
  close: 'Close',
  hero: {
    kicker: 'Singer · Songwriter · Amed',
    tagline: 'Kurdish song, from tradition to today.',
    listen: 'Listen',
    concerts: 'Concerts',
    nextShow: 'Next show',
  },
  player: {
    preview: 'Preview',
    play: 'Play',
    pause: 'Pause',
    next: 'Next',
    prev: 'Previous',
    close: 'Close',
    full: 'Full song',
    hint: '30-second preview. Listen to the full song on your platform.',
    none: 'No preview available for this song.',
  },
  choose: { title: 'Choose your platform', stream: 'Stream', buy: 'Buy', open: 'Where do you want to listen?' },
  music: {
    kicker: 'Music',
    title: 'Discography',
    latest: 'Latest release',
    out: 'Out now on all platforms',
    albums: 'Albums',
    singles: 'Singles',
    all: 'All',
    tracks: 'tracks',
    album: 'Album',
    live: 'Live album',
    single: 'Single',
    with: 'with',
    feat: 'feat.',
    tracklist: 'Tracklist',
    count: (n: number) => `${n} releases`,
    platforms: 'On every platform',
    platformsText: 'Every Azad Bedran song is on the major music platforms.',
    more: 'All music',
    source: 'Discography data: Apple Music (updated automatically).',
  },
  videos: {
    kicker: 'Videos',
    title: 'Music videos & performances',
    play: 'Play',
    more: 'All videos on YouTube',
    subscribe: 'Subscribe on YouTube',
    views: 'views',
    fromChannel: 'Straight from the official YouTube channel.',
  },
  concerts: {
    kicker: 'Concerts',
    title: 'On stage',
    upcoming: 'Upcoming',
    past: 'Past concerts',
    next: 'Next show',
    tickets: 'Tickets',
    ticketsSoon: 'Tickets soon',
    reserve: 'Reservations',
    venueTba: 'Venue to be announced',
    doors: 'Doors',
    soldOut: 'Sold out',
    daysLeft: (n: number) => (n === 0 ? 'Tonight' : n === 1 ? 'Tomorrow' : `${n} days to go`),
    none: 'No new dates announced right now. Follow Azad on Instagram for announcements.',
    poster: 'Poster',
    more: 'All concerts',
    info: 'More info',
    booking: 'For concerts and weddings',
  },
  bio: {
    kicker: 'Biography',
    title: 'Biography',
    lead: 'A voice from Amed: from the children’s choir of the Dicle Fırat Culture Centre to stages across Europe and Russia.',
    more: 'Full biography',
    facts: [
      { value: '1993', label: 'Born in Siverek' },
      { value: '2016', label: 'Debut album' },
      { value: '4', label: 'Albums' },
      { value: '50+', label: 'Releases' },
    ],
    sections: [
      {
        h: 'From Siverek to Amed',
        p: [
          'Azad Bedran is a Kurdish singer, songwriter and saz player whose name is closely tied to Amed (Diyarbakır). He was born on 2 February 1993 in Siverek, in the province of Şanlıurfa. He spent part of his childhood in Tarsus before his family settled in Diyarbakır – the city where his music took shape.',
        ],
      },
      {
        h: 'First steps',
        p: [
          'At the age of ten he began saz and vocal training at the Dicle Fırat Culture Centre in Diyarbakır. He sang in the children’s choir Koma Kulîlkên Me and later became lead singer and saz player of the group Koma Nûjiyan, which performed at many concerts and festivals.',
          'His first teachers were Farqîn Azad and Bülent Turan; among his influences he names Aram Tigran, Meryem Xan, Hozan Serhad, Eyşe Şan, Mizgîn and Ahmet Kaya. He recorded his first song, “Ax Çiyao”, with Farqîn Azad, Bülent Turan and Xanemir, and in 2012 sang a duet with Hozan Diyar. He still works at the Dicle Fırat Culture Centre today.',
        ],
      },
      {
        h: 'Debut album and “Aç Kaldık Özgürlüğe”',
        p: [
          'In 2016 his debut solo album Rêwiyên Şad was released with 14 songs on the Kom Müzik label. It pairs anonymous folk songs with his own compositions and features duets with Hozan Comerd, Farqîn Azad and Xalê Seyitxan. In 2018 he recorded “Aç Kaldık Özgürlüğe”, a song Selahattin Demirtaş had written in Edirne prison; the video was published on 1 October 2018.',
        ],
      },
      {
        h: 'Zindan and millions of listeners',
        p: [
          'In 2019 “Zindan” and “Ez Nisêbin Tu Qamişlo” reached millions of listeners on YouTube. To this day “Zindan” is his most-Shazamed song.',
        ],
      },
      {
        h: 'Discography',
        p: [
          'Since 2021 he has released new music regularly – from “Wayê Wayê” and “Ki Zava” to “Çavênte Welatêmine”, “Bêhna Bihuşt”, “Nîno” and “Bargiran” with Berfîn Mamedova. Two albums followed in 2023: Evîna Azad and Paytexta Evînê. He has also recorded songs for the football clubs Amedspor and Cizrespor. Today more than 50 of his releases are available on the digital platforms.',
        ],
      },
      {
        h: 'On stage',
        p: [
          'Azad Bedran has played concerts in Diyarbakır, Istanbul, Adana, Bursa, Batman, Siirt and İzmir, and has performed abroad in Europe, Russia, Armenia and Kazakhstan. At Newroz 2025 he sang in Erciş (Van) and Hakkari, and on 14 December 2025 he played the Sartory hall in Cologne, Germany. In July 2026 he released the 13-track live album Evîna Azad (Live). In November 2026 he plays St. Petersburg, Paris, Reims and Kiel.',
        ],
      },
    ],
    timelineTitle: 'Journey',
    timeline: [
      { year: '1993', text: 'Born in Siverek, Şanlıurfa' },
      { year: '2016', text: 'Debut album: Rêwiyên Şad' },
      { year: '2018', text: '“Aç Kaldık Özgürlüğe”' },
      { year: '2019', text: '“Zindan” and “Ez Nisêbin Tu Qamişlo” reach millions' },
      { year: '2023', text: 'Albums Evîna Azad and Paytexta Evînê' },
      { year: '2025', text: 'Newroz in Erciş and Hakkari; concerts in Batman, Siirt, Bursa, Adana, Istanbul and Cologne' },
      { year: '2026', text: 'Evîna Azad (Live) and shows in Russia, France and Germany' },
    ],
    quote: 'Art is the search for truth.',
    sources: 'Sources',
  },
  gallery: { kicker: 'Photos', title: 'Gallery', more: 'All photos' },
  news: { kicker: 'News', title: 'News', more: 'All news', back: 'Back to news', read: 'Read' },
  contact: {
    kicker: 'Contact',
    title: 'Booking & enquiries',
    text: 'For concerts, weddings, festivals and press enquiries, please contact Azad’s manager directly.',
    role: 'Manager',
    call: 'Call',
    whatsapp: 'WhatsApp',
    follow: 'Follow Azad',
  },
  platforms: 'Listen on',
  footer: { rights: 'All rights reserved.', imprint: 'Imprint', privacy: 'Privacy', back: 'Back' },
}

const ru: Dict = {
  meta: {
    title: 'Азад Бедран – официальный сайт',
    description: 'Азад Бедран – курдский певец, автор песен и исполнитель на сазе из Амеда (Диярбакыр). Музыка, видео, концерты, новости и контакты.',
  },
  nav: { music: 'Музыка', concerts: 'Концерты', videos: 'Видео', bio: 'Биография', gallery: 'Фото', news: 'Новости', contact: 'Контакты' },
  home: 'Главная',
  skip: 'К содержанию',
  menu: 'Меню',
  close: 'Закрыть',
  hero: {
    kicker: 'Певец · Автор песен · Амед',
    tagline: 'Курдская песня – от традиции до наших дней.',
    listen: 'Слушать',
    concerts: 'Концерты',
    nextShow: 'Ближайший концерт',
  },
  player: {
    preview: 'Превью',
    play: 'Играть',
    pause: 'Пауза',
    next: 'Далее',
    prev: 'Назад',
    close: 'Закрыть',
    full: 'Вся песня',
    hint: '30-секундное превью. Полную версию слушайте на своей платформе.',
    none: 'Для этой песни нет превью.',
  },
  choose: { title: 'Выберите платформу', stream: 'Слушать', buy: 'Купить', open: 'Где вы хотите слушать?' },
  music: {
    kicker: 'Музыка',
    title: 'Дискография',
    latest: 'Новый релиз',
    out: 'Уже на всех платформах',
    albums: 'Альбомы',
    singles: 'Синглы',
    all: 'Все',
    tracks: 'треков',
    album: 'Альбом',
    live: 'Концертный альбом',
    single: 'Сингл',
    with: 'с',
    feat: 'при участии',
    tracklist: 'Треклист',
    count: (n: number) => `${n} релизов`,
    platforms: 'На всех платформах',
    platformsText: 'Все песни Азада Бедрана доступны на крупнейших музыкальных платформах.',
    more: 'Вся музыка',
    source: 'Данные дискографии: Apple Music (обновляются автоматически).',
  },
  videos: {
    kicker: 'Видео',
    title: 'Клипы и выступления',
    play: 'Смотреть',
    more: 'Все видео на YouTube',
    subscribe: 'Подписаться на YouTube',
    views: 'просмотров',
    fromChannel: 'Напрямую с официального канала YouTube.',
  },
  concerts: {
    kicker: 'Концерты',
    title: 'На сцене',
    upcoming: 'Предстоящие концерты',
    past: 'Прошедшие концерты',
    next: 'Ближайший концерт',
    tickets: 'Билеты',
    ticketsSoon: 'Билеты скоро',
    reserve: 'Бронирование',
    venueTba: 'Место будет объявлено',
    doors: 'Сбор гостей',
    soldOut: 'Билеты проданы',
    daysLeft: (n: number) => (n === 0 ? 'Сегодня' : n === 1 ? 'Завтра' : `Через ${n} дн.`),
    none: 'Новые даты пока не объявлены. Следите за Азадом в Instagram.',
    poster: 'Афиша',
    more: 'Все концерты',
    info: 'Подробнее',
    booking: 'Концерты и свадьбы',
  },
  bio: {
    kicker: 'Биография',
    title: 'Биография',
    lead: 'Голос Амеда: от детского хора культурного центра «Дидже Фырат» до сцен Европы и России.',
    more: 'Полная биография',
    facts: [
      { value: '1993', label: 'Родился в Сивереке' },
      { value: '2016', label: 'Дебютный альбом' },
      { value: '4', label: 'Альбома' },
      { value: '50+', label: 'Релизов' },
    ],
    sections: [
      {
        h: 'От Сиверека до Амеда',
        p: [
          'Азад Бедран – курдский певец, автор песен и исполнитель на сазе, чьё имя тесно связано с Амедом (Диярбакыром). Он родился 2 февраля 1993 года в Сивереке (провинция Шанлыурфа). Часть детства провёл в Тарсусе, после чего семья обосновалась в Диярбакыре – городе, где сложилась его музыка.',
        ],
      },
      {
        h: 'Первые шаги',
        p: [
          'В десять лет он начал заниматься сазом и вокалом в культурном центре «Дидже Фырат» в Диярбакыре. Пел в детском хоре Koma Kulîlkên Me, затем стал солистом и сазистом группы Koma Nûjiyan, выступавшей на многих концертах и фестивалях.',
          'Его первыми учителями были Фаркин Азад и Бюлент Туран; среди повлиявших на него артистов он называет Арама Тиграна, Мерьем Хан, Хозана Серхада, Эйше Шан, Мизгин и Ахмета Кайю. Первую песню, «Ax Çiyao», он записал с Фаркином Азадом, Бюлентом Тураном и Ханемиром, а в 2012 году спел дуэтом с Хозаном Дияром. Он по-прежнему работает в культурном центре «Дидже Фырат».',
        ],
      },
      {
        h: 'Дебютный альбом и «Aç Kaldık Özgürlüğe»',
        p: [
          'В 2016 году на лейбле Kom Müzik вышел его первый сольный альбом Rêwiyên Şad из 14 песен. Альбом объединяет народные песни и его собственные композиции; в нём есть дуэты с Хозаном Комердом, Фаркином Азадом и Хале Сейитханом. В 2018 году он записал песню «Aç Kaldık Özgürlüğe», которую Селахаттин Демирташ написал в тюрьме Эдирне; клип был опубликован 1 октября 2018 года.',
        ],
      },
      {
        h: 'Zindan и миллионы слушателей',
        p: [
          'В 2019 году песни «Zindan» и «Ez Nisêbin Tu Qamişlo» собрали на YouTube миллионы слушателей. «Zindan» до сих пор его самая узнаваемая песня в Shazam.',
        ],
      },
      {
        h: 'Дискография',
        p: [
          'С 2021 года Азад Бедран регулярно выпускает новую музыку – от «Wayê Wayê» и «Ki Zava» до «Çavênte Welatêmine», «Bêhna Bihuşt», «Nîno» и «Bargiran» с Берфин Мамедовой. В 2023 году вышли два альбома: Evîna Azad и Paytexta Evînê. Он также записал песни для футбольных клубов «Амедспор» и «Джизреспор». Сегодня на цифровых платформах доступно более 50 его релизов.',
        ],
      },
      {
        h: 'На сцене',
        p: [
          'Азад Бедран выступал в Диярбакыре, Стамбуле, Адане, Бурсе, Батмане, Сиирте и Измире, а за рубежом – в Европе, России, Армении и Казахстане. На Новруз 2025 года он пел в Эрджише (Ван) и Хаккари, а 14 декабря 2025 года дал концерт в зале Sartory в Кёльне (Германия). В июле 2026 года вышел концертный альбом Evîna Azad (Live) из 13 песен. В ноябре 2026 года он выступает в Санкт-Петербурге, Париже, Реймсе и Киле.',
        ],
      },
    ],
    timelineTitle: 'Путь',
    timeline: [
      { year: '1993', text: 'Родился в Сивереке, Шанлыурфа' },
      { year: '2016', text: 'Дебютный альбом Rêwiyên Şad' },
      { year: '2018', text: '«Aç Kaldık Özgürlüğe»' },
      { year: '2019', text: '«Zindan» и «Ez Nisêbin Tu Qamişlo» – миллионы просмотров' },
      { year: '2023', text: 'Альбомы Evîna Azad и Paytexta Evînê' },
      { year: '2025', text: 'Новруз в Эрджише и Хаккари; концерты в Батмане, Сиирте, Бурсе, Адане, Стамбуле и Кёльне' },
      { year: '2026', text: 'Evîna Azad (Live) и концерты в России, Франции и Германии' },
    ],
    quote: 'Искусство – это поиск истины.',
    sources: 'Источники',
  },
  gallery: { kicker: 'Фото', title: 'Галерея', more: 'Все фото' },
  news: { kicker: 'Новости', title: 'Новости', more: 'Все новости', back: 'Назад к новостям', read: 'Читать' },
  contact: {
    kicker: 'Контакты',
    title: 'Букинг и контакты',
    text: 'По вопросам концертов, свадеб, фестивалей и прессы обращайтесь напрямую к менеджеру Азада.',
    role: 'Менеджер',
    call: 'Позвонить',
    whatsapp: 'WhatsApp',
    follow: 'Подписаться на Азада',
  },
  platforms: 'Слушать на',
  footer: { rights: 'Все права защищены.', imprint: 'Выходные данные', privacy: 'Конфиденциальность', back: 'Назад' },
}

const dictionaries: Record<Locale, Dict> = { ku, tr, en, ru }
export const getDict = (locale: Locale) => dictionaries[locale]
