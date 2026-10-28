import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://cdn-images.dzcdn.net/**'),
      new URL('https://e-cdns-images.dzcdn.net/**'),
      new URL('https://i.ytimg.com/**'),
      { protocol: 'https', hostname: '*.mzstatic.com' },
    ],
  },
}

export default nextConfig
