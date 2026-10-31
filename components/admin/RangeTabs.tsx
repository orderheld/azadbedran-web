import Link from 'next/link'
import { rangeKeys, type Range } from '@/lib/analytics/store'

const labels: Record<string, string> = { today: 'Heute', yesterday: 'Gestern', '7d': '7 Tage', '30d': '30 Tage', '90d': '90 Tage', '12m': '12 Monate' }

export default function RangeTabs({ range, base, extra = '' }: { range: Range; base: string; extra?: string }) {
  return (
    <nav className="tabs" aria-label="Zeitraum">
      {rangeKeys.map((k) => (
        <Link key={k} href={`${base}?r=${k}${extra}`} className={range.key === k ? 'is-active' : undefined} aria-current={range.key === k ? 'page' : undefined}>
          {labels[k]}
        </Link>
      ))}
    </nav>
  )
}
