import LiveBoard from '@/components/admin/LiveBoard'
import { Card, DbNotice, PageHead } from '@/components/admin/ui'

export const metadata = { title: 'Live' }

export default function Live() {
  return (
    <>
      <PageHead title="Live" sub="Wer gerade auf der Website ist. Aktualisiert sich alle 5 Sekunden." />
      <DbNotice />
      <Card><LiveBoard /></Card>
    </>
  )
}
