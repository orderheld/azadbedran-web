import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/bodoni-moda/opsz.css'
import '@fontsource-variable/manrope'
import '@fontsource/playfair-display/cyrillic-700.css'
import './globals.css'
import NotFoundView from '@/components/NotFoundView'

export const metadata: Metadata = {
  title: '404 – Azad Bedran',
  description: 'Rûpel nehat dîtin · Sayfa bulunamadı · Page not found · Страница не найдена',
  robots: { index: false, follow: true },
}
export const viewport: Viewport = { themeColor: '#0f0a07', colorScheme: 'dark' }

export default function GlobalNotFound() {
  return (
    <html lang="ku">
      <body>
        <NotFoundView standalone />
      </body>
    </html>
  )
}
