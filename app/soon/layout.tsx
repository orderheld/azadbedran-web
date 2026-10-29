import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/bodoni-moda/opsz.css'
import '@fontsource-variable/manrope'
import '@fontsource/playfair-display/cyrillic-500.css'
import './soon.css'

export const metadata: Metadata = {
  title: 'Azad Bedran',
  description: 'Malpera fermî ya Azad Bedran – di demeke nêzîk de.',
  robots: { index: false, follow: false },
}
export const viewport: Viewport = { themeColor: '#0f0a07', colorScheme: 'dark' }

export default function SoonLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ku">
      <body>{children}</body>
    </html>
  )
}
