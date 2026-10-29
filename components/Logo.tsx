import { logoPaths } from '@/lib/logo-paths'

export default function Logo({ variant = 'small', className, title = 'Azad Bedran' }: { variant?: 'stacked' | 'horizontal' | 'small'; className?: string; title?: string }) {
  const p = logoPaths[variant]
  return (
    <svg className={className} viewBox={p.viewBox} role="img" aria-label={title} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d={p.d} />
    </svg>
  )
}
