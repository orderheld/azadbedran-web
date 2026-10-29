import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Azad Bedran',
    short_name: 'Azad Bedran',
    description: 'Azad Bedran – Malpera fermî · Official website',
    start_url: '/ku',
    display: 'standalone',
    background_color: '#0f0a07',
    theme_color: '#0f0a07',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }
}
