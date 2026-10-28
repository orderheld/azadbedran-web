import Image from 'next/image'

const palettes = [
  ['#5b2416', '#170d09'],
  ['#6d4a17', '#1b130a'],
  ['#1f4430', '#0b140f'],
  ['#3b2b55', '#120e1a'],
  ['#5a1a22', '#160a0c'],
  ['#21424f', '#0b1418'],
]

function hash(s: string) {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

export default function Cover({ title, src, sizes, priority }: { title: string; src: string | null; sizes: string; priority?: boolean }) {
  if (src) return <Image src={src} alt={title} fill sizes={sizes} priority={priority} className="cover-img" />
  const [a, b] = palettes[hash(title) % palettes.length]
  return (
    <div className="cover-fallback" style={{ background: `radial-gradient(120% 90% at 30% 20%, ${a}, ${b})` }}>
      <span className="cover-artist">Azad Bedran</span>
      <span className="cover-title">{title}</span>
    </div>
  )
}
