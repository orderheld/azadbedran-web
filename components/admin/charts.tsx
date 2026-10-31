import type { Point, Row } from '@/lib/analytics/store'

const nf = new Intl.NumberFormat('de-CH')
export const fmt = (n: number) => nf.format(n)

function tickLabel(t: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
    const [, m, d] = t.split('-')
    return `${Number(d)}.${Number(m)}.`
  }
  if (/^\d{4}-\d{2}$/.test(t)) {
    const [y, m] = t.split('-')
    return `${['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'][Number(m) - 1]} ${y.slice(2)}`
  }
  return t
}

// Besucher pro Zeiteinheit (eine Reihe, Balken). Tooltip zeigt Besucher und Seitenaufrufe.
export function VisitorChart({ points }: { points: Point[] }) {
  const max = Math.max(1, ...points.map((p) => p.visitors))
  const nice = niceMax(max)
  const every = Math.ceil(points.length / 12)
  return (
    <figure className="vchart" aria-label="Besucher im Zeitverlauf">
      <div className="vchart-grid" aria-hidden>
        {[1, 0.5, 0].map((f) => (
          <span key={f} style={{ bottom: `${f * 100}%` }}>{fmt(Math.round(nice * f))}</span>
        ))}
      </div>
      <div className="vchart-bars">
        {points.map((p, i) => (
          <div key={p.t} className="vchart-col" tabIndex={0}>
            <div className="vchart-bar" style={{ height: `${(p.visitors / nice) * 100}%` }} />
            <div className="vchart-tip" role="tooltip">
              <b>{tickLabel(p.t)}</b>
              <span>{fmt(p.visitors)} Besucher</span>
              <span>{fmt(p.pageviews)} Seitenaufrufe</span>
            </div>
            <span className="vchart-x" aria-hidden>{i % every === 0 ? tickLabel(p.t) : ''}</span>
          </div>
        ))}
      </div>
      <table className="sr-only">
        <thead><tr><th>Zeit</th><th>Besucher</th><th>Seitenaufrufe</th></tr></thead>
        <tbody>{points.map((p) => <tr key={p.t}><td>{p.t}</td><td>{p.visitors}</td><td>{p.pageviews}</td></tr>)}</tbody>
      </table>
    </figure>
  )
}

function niceMax(n: number) {
  const pow = 10 ** Math.floor(Math.log10(n))
  const steps = [1, 2, 2.5, 5, 10]
  return (steps.find((s) => s * pow >= n) ?? 10) * pow
}

// Rangliste mit Anteilsbalken
export function BarList({ rows, label = (k: string) => k, valueLabel = 'Besucher', href, empty = 'Noch keine Daten' }: {
  rows: Row[]
  label?: (k: string) => React.ReactNode
  valueLabel?: string
  href?: (k: string) => string | null
  empty?: string
}) {
  if (!rows.length) return <p className="empty">{empty}</p>
  const max = Math.max(...rows.map((r) => r.visitors))
  return (
    <table className="barlist">
      <thead>
        <tr><th scope="col">&nbsp;</th><th scope="col" className="num">{valueLabel}</th><th scope="col" className="num">Aufrufe</th></tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const link = href?.(r.key)
          return (
            <tr key={r.key}>
              <td>
                <span className="barlist-bar" style={{ width: `${(r.visitors / max) * 100}%` }} aria-hidden />
                <span className="barlist-label">{link ? <a href={link}>{label(r.key)}</a> : label(r.key)}</span>
              </td>
              <td className="num">{fmt(r.visitors)}</td>
              <td className="num muted">{fmt(r.count)}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export function Kpi({ label, value, prev, format = fmt, invert }: { label: string; value: number; prev?: number; format?: (n: number) => string; invert?: boolean }) {
  let delta: React.ReactNode = null
  if (prev !== undefined) {
    if (prev === 0) delta = value ? <span className="kpi-delta">neu</span> : null
    else {
      const d = Math.round(((value - prev) / prev) * 100)
      const good = invert ? d < 0 : d > 0
      delta = <span className={`kpi-delta ${d === 0 ? '' : good ? 'is-up' : 'is-down'}`}>{d > 0 ? '▲' : d < 0 ? '▼' : '='} {Math.abs(d)} %</span>
    }
  }
  return (
    <div className="kpi">
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{format(value)}</p>
      {delta}
    </div>
  )
}
