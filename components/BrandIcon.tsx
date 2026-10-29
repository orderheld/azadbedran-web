import { brands } from '@/lib/brand-icons'

// Marks that are black in the brand guide are drawn in cream on the dark site.
const onDark: Record<string, string> = { tidal: '#f3e6d3', x: '#f3e6d3' }

export default function BrandIcon({ id, size = 20, mono = false }: { id: string; size?: number; mono?: boolean }) {
  const b = brands[id]
  if (!b) return null
  const color = mono ? 'currentColor' : onDark[id] ?? b.hex
  if (b.svg48) {
    return (
      <svg className="brand-icon" width={size} height={size} viewBox="0 0 48 48" aria-hidden style={mono ? undefined : { color }} strokeWidth={4.2}
        dangerouslySetInnerHTML={{ __html: b.svg48 }} />
    )
  }
  return (
    <svg className="brand-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden fill={color}><path d={b.path} /></svg>
  )
}
