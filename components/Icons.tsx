type P = { size?: number }
const base = (size = 18) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true })

export const ArrowUpRight = ({ size }: P) => (<svg {...base(size)}><path d="M7 17 17 7M8 7h9v9" /></svg>)
export const ArrowRight = ({ size }: P) => (<svg {...base(size)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>)
export const Play = ({ size }: P) => (<svg {...base(size)} fill="currentColor" stroke="none"><path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10.4-6.5a.8.8 0 0 0 0-1.4L9.2 4.8A.8.8 0 0 0 8 5.5Z" /></svg>)
export const Ticket = ({ size }: P) => (<svg {...base(size)}><path d="M3 9V7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a3 3 0 0 0 0 6v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a3 3 0 0 0 0-6Z" /><path d="M14 6v12" strokeDasharray="2 2" /></svg>)
export const Phone = ({ size }: P) => (<svg {...base(size)}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>)
export const Chat = ({ size }: P) => (<svg {...base(size)}><path d="M3 20.5 4.4 16A8.5 8.5 0 1 1 8 19.6Z" /><path d="M9 10.5c.5 2 2 3.5 4.5 4.5l1.2-1.2 1.8.8" /></svg>)
export const Mail = ({ size }: P) => (<svg {...base(size)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6 8.5-6" /></svg>)
export const Pin = ({ size }: P) => (<svg {...base(size)}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>)
export const Menu = ({ size }: P) => (<svg {...base(size)}><path d="M4 8h16M4 16h16" /></svg>)
export const Close = ({ size }: P) => (<svg {...base(size)}><path d="M6 6l12 12M18 6 6 18" /></svg>)
export const Sun = ({ size = 520 }: P) => (
  <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden fill="none" stroke="currentColor" strokeWidth=".5">
    <circle cx="100" cy="100" r="34" />
    <circle cx="100" cy="100" r="40" strokeDasharray="1 3" />
    {Array.from({ length: 21 }, (_, i) => {
      const a = (i / 21) * Math.PI * 2
      const x1 = 100 + Math.cos(a) * 48, y1 = 100 + Math.sin(a) * 48
      const x2 = 100 + Math.cos(a) * 96, y2 = 100 + Math.sin(a) * 96
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
    })}
  </svg>
)
