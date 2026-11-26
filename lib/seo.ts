import type { Locale } from './i18n'

type Entry = { title: string; description: string }
type Page = 'music' | 'concerts' | 'videos' | 'gallery' | 'news' | 'contact'

// Titel und Beschreibungen für Google und Link-Vorschauen (WhatsApp, Instagram, Facebook, X)
export const seo: Record<Locale, Record<Page, Entry> & { upcoming: string }> = {
  ku: {
    music: { title: 'Muzîk – Albûm û Single', description: 'Albûm û singleyên Azad Bedran: albûma nû Vegerîn, Evîna Azad (Live), Paytexta Evînê û Rêwiyên Şad. Pêşguhdarî bike, li Spotify an YouTube veke.' },
    concerts: { title: 'Konser û Bilêt', description: 'Konserên Azad Bedran: dîrok, cih, bilêt û rezervasyon.' },
    videos: { title: 'Vîdeo û Klîp', description: 'Klîp, performansên zindî û konserên Azad Bedran ji kanala fermî ya YouTubeê, herwiha stranên albûma nû Vegerîn.' },
    gallery: { title: 'Wêne', description: 'Wêneyên fermî yên stranbêjê kurd Azad Bedran: portre, wêneyên studyoyê û dîmenên ji sahneyê. Li wêneyekê bitikîne da ku mezin bibe.' },
    news: { title: 'Nûçe', description: 'Nûçeyên herî nû yên Azad Bedran: stranên nû ji albûma Vegerîn, klîp, konser û derketinên li ser sahneyê.' },
    contact: { title: 'Booking û Têkilî', description: 'Ji bo konser, dawet, festîval û pirsên çapemeniyê: rêveberê Azad Bedran Ozan Kızılkar, bi telefon an WhatsApp.' },
    upcoming: 'Konserên bê',
  },
  tr: {
    music: { title: 'Müzik – Albümler ve Single’lar', description: 'Azad Bedran’ın albüm ve single’ları: yeni albüm Vegerîn, Evîna Azad (Live), Paytexta Evînê ve Rêwiyên Şad. Önizleme dinleyin, Spotify veya YouTube’da açın.' },
    concerts: { title: 'Konserler ve Biletler', description: 'Azad Bedran konserleri: tarihler, mekânlar, biletler ve rezervasyon.' },
    videos: { title: 'Videolar ve Klipler', description: 'Azad Bedran’ın resmî YouTube kanalından klipler, canlı performanslar ve konser kayıtları; yeni albüm Vegerîn’in şarkıları dahil.' },
    gallery: { title: 'Fotoğraflar', description: 'Kürt şarkıcı Azad Bedran’ın resmî fotoğrafları: portreler, stüdyo çekimleri ve sahneden kareler. Büyütmek için bir fotoğrafa dokunun.' },
    news: { title: 'Haberler', description: 'Azad Bedran’dan en son haberler: Vegerîn albümünden yeni şarkılar, klipler, konserler ve sahne performansları.' },
    contact: { title: 'Booking ve İletişim', description: 'Konser, düğün, festival ve basın talepleri için: Azad Bedran’ın menajeri Ozan Kızılkar, telefon veya WhatsApp ile.' },
    upcoming: 'Yaklaşan konserler',
  },
  en: {
    music: { title: 'Music – Albums & Singles', description: 'Albums and singles by Azad Bedran: the new album Vegerîn, Evîna Azad (Live), Paytexta Evînê and Rêwiyên Şad. Play previews and open them on Spotify or YouTube.' },
    concerts: { title: 'Concerts & Tickets', description: 'Azad Bedran concerts: dates, venues, tickets and reservations.' },
    videos: { title: 'Videos & Music Videos', description: 'Music videos, live performances and concert recordings by Azad Bedran from his official YouTube channel, including songs from the new album Vegerîn.' },
    gallery: { title: 'Photos', description: 'Official photos of Kurdish singer Azad Bedran: portraits, studio shots and moments on stage. Tap a photo to view it full size.' },
    news: { title: 'News', description: 'The latest from Azad Bedran: new songs from the album Vegerîn, music videos, concerts and live appearances.' },
    contact: { title: 'Booking & Contact', description: 'For concerts, weddings, festivals and press: Azad Bedran’s manager Ozan Kızılkar, by phone or WhatsApp.' },
    upcoming: 'Upcoming',
  },
  ru: {
    music: { title: 'Музыка – альбомы и синглы', description: 'Альбомы и синглы Азада Бедрана: новый альбом Vegerîn, Evîna Azad (Live), Paytexta Evînê и Rêwiyên Şad. Слушайте превью, открывайте в Spotify или YouTube.' },
    concerts: { title: 'Концерты и билеты', description: 'Концерты Азада Бедрана: даты, площадки, билеты и бронирование.' },
    videos: { title: 'Видео и клипы', description: 'Клипы, живые выступления и концертные записи Азада Бедрана с официального YouTube-канала, включая песни с нового альбома Vegerîn.' },
    gallery: { title: 'Фотографии', description: 'Официальные фотографии курдского певца Азада Бедрана: портреты, студийные снимки и кадры со сцены. Нажмите на фото, чтобы увеличить.' },
    news: { title: 'Новости', description: 'Последние новости Азада Бедрана: новые песни с альбома Vegerîn, клипы, концерты и выступления.' },
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
