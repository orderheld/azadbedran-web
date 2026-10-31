import Link from 'next/link'
import { Card, DbNotice, Flash, PageHead, dateOnly } from '@/components/admin/ui'
import { adminNews } from '@/lib/admin/data'

export const metadata = { title: 'News' }

export default async function News({ searchParams }: PageProps<'/admin/news'>) {
  const { ok } = await searchParams
  const news = await adminNews()
  return (
    <>
      <PageHead title="News" sub="Beiträge in vier Sprachen. Fehlt eine Übersetzung, wird Englisch bzw. Kurmancî gezeigt.">
        <Link href="/admin/news/neu" className="btn btn-primary">+ Neuer Beitrag</Link>
      </PageHead>
      <Flash ok={ok} />
      <DbNotice />
      <Card>
        <table className="tbl">
          <thead><tr><th>Bild</th><th>Titel</th><th>Datum</th><th>Sprachen</th><th>Status</th></tr></thead>
          <tbody>
            {news.map((n) => (
              <tr key={n.id}>
                <td>{n.image_url ? <img src={n.image_url} alt="" className="thumb-sm" /> : <span className="thumb-sm is-empty" />}</td>
                <td><Link href={`/admin/news/${n.id}`}><b>{n.title_ku}</b></Link><br /><small className="muted">{n.title_tr}</small></td>
                <td>{dateOnly(n.date)}</td>
                <td>{(['ku', 'tr', 'en', 'ru'] as const).map((l) => <span key={l} className={`lang-dot${n[`title_${l}`] && n[`body_${l}`] ? ' is-on' : ''}`}>{l}</span>)}</td>
                <td>{n.published ? <span className="tag tag-ok">Online</span> : <span className="tag">Entwurf</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  )
}
