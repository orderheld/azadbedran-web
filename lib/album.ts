// Neues Album „Vegerîn“ (2026). Erscheint Lied für Lied auf YouTube, noch nicht auf Apple Music / Spotify / Deezer.
// Quellen: offizieller YouTube-Kanal @Azadbedranoffical (Videobeschreibungen, abgerufen 02.11.2026),
// Instagram-Story von @azadbedran zu „Kes pê Nizane“ (von Ferhat, 02.11.2026).
// Nur „Kes pê Nizane“ ist auf YouTube ausdrücklich als „Strana 4. ya albûma Vegerîn“ beschriftet;
// die Lieder 1–3 sind die drei Videos, die im Wochentakt davor erschienen sind (Bestätigung durch Ferhat).

import type { Locale } from './i18n'

export type Credit = { role: 'lyrics' | 'music' | 'both' | 'arr'; name: string }
export type AlbumTrack = { n: number; title: string; date: string; youtube: string; credits: Credit[] }

export const vegerin = {
  title: 'Vegerîn',
  year: '2026',
  image: '/images/vegerin/RAB_GAXsMwQ.jpg', // Vorschaubild des offiziellen Videos „Kes pê Nizane“
  tracks: [
    { n: 1, title: 'Şam Şekire', date: '2026-10-08', youtube: 'oB18IGVYEvM', credits: [{ role: 'both', name: 'Mustafa Gazi (Seyda)' }, { role: 'arr', name: 'Ömer İçener' }] },
    { n: 2, title: 'Ax Welat', date: '2026-10-16', youtube: '3kyIIcoxAKE', credits: [{ role: 'lyrics', name: 'Berîvan Zînzal' }, { role: 'music', name: 'Azad Bedran' }, { role: 'arr', name: 'Azad Yılmaz' }] },
    { n: 3, title: 'Tu Gulaminî', date: '2026-10-23', youtube: 'acAZYC43d3g', credits: [{ role: 'both', name: 'Mamoste Sedran' }, { role: 'arr', name: 'Serkan Tanık' }] },
    { n: 4, title: 'Kes pê Nizane', date: '2026-11-02', youtube: 'RAB_GAXsMwQ', credits: [{ role: 'both', name: 'Rezan Koç' }, { role: 'arr', name: 'Serkan Tanık' }] },
  ] as AlbumTrack[],
}

export const latestAlbumTrack = () => vegerin.tracks.reduce((a, b) => (b.date > a.date ? b : a))
export const youtubeUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`

export const albumText: Record<Locale, {
  kicker: string
  newSingle: string
  lead: (track: string, n: number, by: string) => string
  released: string
  track: (n: number) => string
  roles: Record<Credit['role'], string>
  watch: string
  play: string
}> = {
  ku: {
    kicker: 'Albûma nû',
    newSingle: 'Strana nû',
    lead: (track, n, by) => `Albûma nû ya Azad Bedran “Vegerîn” stran bi stran derdikeve. Strana ${n}. “${track}” niha li YouTubeê ye – gotin û muzîk ji ${by}.`,
    released: 'Stranên ku heta niha derketine',
    track: (n) => `Strana ${n}.`,
    roles: { lyrics: 'Gotin', music: 'Muzîk', both: 'Gotin & muzîk', arr: 'Aranje' },
    watch: 'Li YouTubeê temaşe bike',
    play: 'Lê bide',
  },
  tr: {
    kicker: 'Yeni albüm',
    newSingle: 'Yeni şarkı',
    lead: (track, n, by) => `Azad Bedran’ın yeni albümü “Vegerîn” şarkı şarkı yayımlanıyor. Albümün ${n}. şarkısı “${track}” şimdi YouTube’da – söz ve müzik: ${by}.`,
    released: 'Şimdiye kadar yayımlanan şarkılar',
    track: (n) => `${n}. şarkı`,
    roles: { lyrics: 'Söz', music: 'Müzik', both: 'Söz & müzik', arr: 'Aranje' },
    watch: 'YouTube’da izle',
    play: 'İzle',
  },
  en: {
    kicker: 'New album',
    newSingle: 'New song',
    lead: (track, n, by) => `Azad Bedran’s new album “Vegerîn” is being released song by song. Track ${n}, “${track}”, is out now on YouTube – lyrics and music by ${by}.`,
    released: 'Released so far',
    track: (n) => `Track ${n}`,
    roles: { lyrics: 'Lyrics', music: 'Music', both: 'Lyrics & music', arr: 'Arrangement' },
    watch: 'Watch on YouTube',
    play: 'Play',
  },
  ru: {
    kicker: 'Новый альбом',
    newSingle: 'Новая песня',
    lead: (track, n, by) => `Новый альбом Азада Бедрана «Vegerîn» выходит песня за песней. ${n}-я песня альбома, «${track}», уже на YouTube – слова и музыка: ${by}.`,
    released: 'Уже вышли',
    track: (n) => `Песня ${n}`,
    roles: { lyrics: 'Слова', music: 'Музыка', both: 'Слова и музыка', arr: 'Аранжировка' },
    watch: 'Смотреть на YouTube',
    play: 'Смотреть',
  },
}
