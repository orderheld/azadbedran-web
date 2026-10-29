// Zentrale Angaben der Website. Quellen der Profil-Links: offizielle Konten, geprüft am 29.10.2026.

export const site = {
  name: 'Azad Bedran',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://azadbedran.com',

  deezerArtistId: '10396480',
  appleArtistId: '1116072473',
  spotifyArtistId: '6nf6LaxU7kzFoQmiWB9LFN',
  youtubeChannelId: 'UCGd0Bur3OfTZibdHr_o26Zg',

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
    { id: 'spotify', label: 'Spotify', url: `https://open.spotify.com/artist/${site.spotifyArtistId}` },
    { id: 'apple', label: 'Apple Music', url: `https://music.apple.com/artist/azad-bedran/${site.appleArtistId}` },
    { id: 'youtube-music', label: 'YouTube Music', url: `https://music.youtube.com/channel/${site.youtubeChannelId}` },
    { id: 'deezer', label: 'Deezer', url: `https://www.deezer.com/artist/${site.deezerArtistId}` },
    { id: 'amazon', label: 'Amazon Music', url: 'https://music.amazon.com/artists/B01FXZXKOO/azad-bedran' },
    { id: 'tidal', label: 'TIDAL', url: 'https://tidal.com/browse/artist/7842088' },
    { id: 'anghami', label: 'Anghami', url: 'https://play.anghami.com/artist/1129470' },
    { id: 'shazam', label: 'Shazam', url: `https://www.shazam.com/artist/azad-bedran/${site.appleArtistId}` },
  ]
}

export const manager = {
  name: 'Ozan Kızılkar',
  photo: '/images/ozan-kizilkar.jpg',
  phone: '+90 539 545 24 76',
}

export const whatsappUrl = `https://wa.me/${manager.phone.replace(/\D/g, '')}`
export const telUrl = `tel:${manager.phone.replace(/\s/g, '')}`

export const images = {
  hero: { src: '/images/azad-studio.jpg', width: 2400, height: 1350 },
  portrait: { src: '/images/azad-portrait-close.jpg', width: 1290, height: 1500 },
}

// Galerie: nur eigene, freigegebene Fotos (Freigabe durch Ferhat, 28.10.2026)
export const gallery = [
  { src: '/images/azad-studio.jpg', w: 2400, h: 1350 },
  { src: '/images/azad-live-stage.jpg', w: 463, h: 662 },
  { src: '/images/azad-portrait-close.jpg', w: 1290, h: 1500 },
  { src: '/images/azad-keffiyeh.jpg', w: 462, h: 663 },
  { src: '/images/azad-warm.jpg', w: 1500, h: 945 },
  { src: '/images/azad-leather.jpg', w: 447, h: 447 },
  { src: '/images/azad-blazer.jpg', w: 399, h: 501 },
]
