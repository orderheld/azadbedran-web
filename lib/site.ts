// Zentrale Einstellungen der Website. Alles, was mit TODO markiert ist, bitte vor dem Livegang ersetzen.

export const site = {
  name: 'Azad Bedran',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://azadbedran.com',

  // Lokale Fotos in /public/images ablegen. null = elegante Platzhalter / Bild von Deezer.
  heroImage: '/images/hero.jpg' as string | null, // Querformat, ideal mind. 2400 px breit
  portraitImage: '/images/portrait.jpg' as string | null, // Hochformat 4:5

  deezerArtistId: '10396480',
  appleArtistId: '1116072473',
  spotifyArtistId: '', // TODO: Spotify-Artist-ID eintragen (aus open.spotify.com/artist/<ID>)

  socials: [
    { id: 'instagram', label: 'Instagram', handle: '@azadbedran', url: 'https://www.instagram.com/azadbedran/' },
    { id: 'youtube', label: 'YouTube', handle: '@Azadbedranoffical', url: 'https://www.youtube.com/@Azadbedranoffical' },
    { id: 'facebook', label: 'Facebook', handle: 'azadbedran', url: 'https://www.facebook.com/azadbedran/' },
    { id: 'x', label: 'X', handle: '@azadbedran', url: 'https://x.com/azadbedran' },
  ],

  youtubeSubscribeUrl: 'https://www.youtube.com/@Azadbedranoffical?sub_confirmation=1',
}

export type Platform = { id: string; label: string; url: string }

export function streamingPlatforms(): Platform[] {
  return [
    {
      id: 'spotify',
      label: 'Spotify',
      url: site.spotifyArtistId
        ? `https://open.spotify.com/artist/${site.spotifyArtistId}`
        : 'https://open.spotify.com/search/Azad%20Bedran/artists',
    },
    { id: 'apple', label: 'Apple Music', url: `https://music.apple.com/artist/azad-bedran/${site.appleArtistId}` },
    { id: 'youtube-music', label: 'YouTube Music', url: 'https://music.youtube.com/channel/UCGd0Bur3OfTZibdHr_o26Zg' },
    { id: 'deezer', label: 'Deezer', url: `https://www.deezer.com/artist/${site.deezerArtistId}` },
    { id: 'tidal', label: 'TIDAL', url: 'https://tidal.com/browse/artist/7842088' },
    { id: 'amazon', label: 'Amazon Music', url: 'https://music.amazon.com/search/Azad%20Bedran' },
  ]
}

export function buyPlatforms(): Platform[] {
  return [
    { id: 'itunes', label: 'iTunes Store', url: `https://music.apple.com/artist/azad-bedran/${site.appleArtistId}` },
    { id: 'amazon', label: 'Amazon', url: 'https://www.amazon.com/s?k=Azad+Bedran&i=digital-music' },
    { id: 'qobuz', label: 'Qobuz', url: 'https://www.qobuz.com/us-en/search?q=Azad%20Bedran' },
  ]
}

export const manager = {
  name: 'Ozan Kızılkar',
  photo: null as string | null, // z. B. '/images/ozan-kizilkar.jpg' (quadratisch)
  phone: '+90 539 545 24 76',
  email: 'management@azadbedran.com', // TODO: echte Adresse
}

export const videos = [
  { id: 'egq65dfRCE8', title: 'Wayê Wayê' },
  { id: 'QjVfjl1WZSQ', title: 'Aşk Amedspor' },
  { id: 'W5h52CcRZhY', title: 'Partizan (Akustîk)' },
]

// Galerie: Dateien in /public/gallery legen und hier eintragen. Leere Einträge werden als Platzhalter gezeigt.
export const gallery: { src: string | null; alt: string }[] = [
  { src: '/gallery/azad-warm.jpg', alt: 'Azad Bedran' },
  { src: '/gallery/azad-portrait-close.jpg', alt: 'Azad Bedran – Porträt' },
  { src: '/gallery/azad-studio-wide.jpg', alt: 'Azad Bedran im Studio' },
  { src: '/gallery/azad-leather.jpg', alt: 'Azad Bedran' },
]
