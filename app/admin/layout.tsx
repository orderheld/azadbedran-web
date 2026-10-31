import type { Metadata, Viewport } from 'next'
import './admin.css'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Admin · Azad Bedran' },
  robots: { index: false, follow: false, nocache: true },
}
export const viewport: Viewport = { themeColor: '#1d2327' }

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="adm">{children}</body>
    </html>
  )
}
