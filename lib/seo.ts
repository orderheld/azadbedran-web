import type { Locale } from './i18n'

type Entry = { title: string; description: string }
type Page = 'music' | 'concerts' | 'videos' | 'gallery' | 'news' | 'contact'

// Titel und Beschreibungen für Google und Link-Vorschauen (WhatsApp, Instagram, Facebook, X)
export const seo: Record<Locale, Record<Page, Entry> & { upcoming: string }> = {
  ku: {
    music: { title: 'Muzîk – Albûm û Single', description: 'Hemû albûm û singleyên Azad Bedran: Evîna Azad (Live), Paytexta Evînê, Rêwiyên Şad û stranên nû. Pêşdîtinan guhdarî bike û li Spotify, Apple Music, YouTube Music û Deezer veke.' },
    concerts: { title: 'Konser û Bilêt', description: 'Konserên Azad Bedran: dîrok, cih, bilêt û rezervasyon.' },
    videos: { title: 'Vîdeo û Klîp', description: 'Klîp, performansên zindî û konserên Azad Bedran ji kanala fermî ya YouTubeê.' },
    gallery: { title: 'Wêne', description: 'Wêneyên fermî yên Azad Bedran: portre, studyo û sahne.' },
    news: { title: 'Nûçe', description: 'Nûçeyên Azad Bedran: stranên nû, albûm û konser.' },
    contact: { title: 'Booking û Têkilî', description: 'Ji bo konser, dawet, festîval û pirsên çapemeniyê: rêveberê Azad Bedran Ozan Kızılkar, bi telefon an WhatsApp.' },
    upcoming: 'Konserên bê',
  },
  tr: {
    music: { title: 'Müzik – Albümler ve Single’lar', description: 'Azad Bedran’ın tüm albüm ve single’ları: Evîna Azad (Live), Paytexta Evînê, Rêwiyên Şad ve yeni şarkılar. Önizlemeleri dinleyin; Spotify, Apple Music, YouTube Music ve Deezer’da açın.' },
    concerts: { title: 'Konserler ve Biletler', description: 'Azad Bedran konserleri: tarihler, mekânlar, biletler ve rezervasyon.' },
    videos: { title: 'Videolar ve Klipler', description: 'Azad Bedran’ın resmî YouTube kanalından klipler, canlı performanslar ve konser kayıtları.' },
    gallery: { title: 'Fotoğraflar', description: 'Azad Bedran’ın resmî fotoğrafları: portre, stüdyo ve sahne.' },
    news: { title: 'Haberler', description: 'Azad Bedran’dan haberler: yeni şarkılar, albümler ve konserler.' },
    contact: { title: 'Booking ve İletişim', description: 'Konser, düğün, festival ve basın talepleri için: Azad Bedran’ın menajeri Ozan Kızılkar, telefon veya WhatsApp ile.' },
    upcoming: 'Yaklaşan konserler',
  },
  en: {
    music: { title: 'Music – Albums & Singles', description: 'All albums and singles by Azad Bedran: Evîna Azad (Live), Paytexta Evînê, Rêwiyên Şad and new songs. Play previews and open them on Spotify, Apple Music, YouTube Music and Deezer.' },
    concerts: { title: 'Concerts & Tickets', description: 'Azad Bedran concerts: dates, venues, tickets and reservations.' },
    videos: { title: 'Videos & Music Videos', description: 'Music videos, live performances and concert recordings by Azad Bedran from his official YouTube channel.' },
    gallery: { title: 'Photos', description: 'Official photos of Azad Bedran: portraits, studio and stage.' },
    news: { title: 'News', description: 'News from Azad Bedran: new songs, albums and concerts.' },
    contact: { title: 'Booking & Contact', description: 'For concerts, weddings, festivals and press: Azad Bedran’s manager Ozan Kızılkar, by phone or WhatsApp.' },
    upcoming: 'Upcoming',
  },
  ru: {
    music: { title: 'Музыка – альбомы и синглы', description: 'Все альбомы и синглы Азада Бедрана: Evîna Azad (Live), Paytexta Evînê, Rêwiyên Şad и новые песни. Слушайте превью и открывайте их в Spotify, Apple Music, YouTube Music и Deezer.' },
    concerts: { title: 'Концерты и билеты', description: 'Концерты Азада Бедрана: даты, площадки, билеты и бронирование.' },
    videos: { title: 'Видео и клипы', description: 'Клипы, живые выступления и концертные записи Азада Бедрана с официального YouTube-канала.' },
    gallery: { title: 'Фотографии', description: 'Официальные фотографии Азада Бедрана: портреты, студия и сцена.' },
    news: { title: 'Новости', description: 'Новости Азада Бедрана: новые песни, альбомы и концерты.' },
    contact: { title: 'Букинг и контакты', description: 'Концерты, свадьбы, фестивали и пресса: менеджер Азада Бедрана Озан Кызылкар, по телефону или в WhatsApp.' },
    upcoming: 'Ближайшие',
  },
}

export const ogLocale: Record<Locale, string> = { ku: 'ku_TR', tr: 'tr_TR', en: 'en_US', ru: 'ru_RU' }
export const ogImage = (lang: Locale) => ({ url: `/og/${lang}.jpg`, width: 1200, height: 630, alt: 'Azad Bedran' })

export const shareLabels: Record<Locale, { share: string; copied: string }> = {
  ku: { share: 'Parve bike', copied: 'Girêdan hat kopîkirin' },
  tr: { share: 'Paylaş', copied: 'Bağlantı kopyalandı' },
  en: { share: 'Share', copied: 'Link copied' },
  ru: { share: 'Поделиться', copied: 'Ссылка скопирована' },
}
