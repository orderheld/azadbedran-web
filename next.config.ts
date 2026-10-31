import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
]

// Fotos, Plakate und Vorschaubilder ändern sich selten: 1 Tag im Browser, danach im Hintergrund neu laden
const assetCache = [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Schema für „Datenbank einrichten“ im Admin-Bereich mitliefern
  outputFileTracingIncludes: { '/admin/**': ['./db/schema.sql'] },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      new URL('https://cdn-images.dzcdn.net/**'),
      new URL('https://e-cdns-images.dzcdn.net/**'),
      new URL('https://i.ytimg.com/**'),
      { protocol: 'https', hostname: '*.mzstatic.com' },
    ],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/images/:path*', headers: assetCache },
      { source: '/og/:path*', headers: assetCache },
      { source: '/brand/:path*', headers: assetCache },
      { source: '/(icon-192.png|icon-512.png|og.jpg)', headers: assetCache },
    ]
  },
}

export default nextConfig
