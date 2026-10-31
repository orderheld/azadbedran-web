'use client'
import { useState } from 'react'

const labels: Record<string, string> = { ku: 'Kurmancî', tr: 'Türkçe', en: 'English', ru: 'Русский' }

// Alle Sprachen bleiben im Formular (werden mitgesendet), sichtbar ist jeweils eine
export default function LangTabs({ panels, filled }: { panels: Record<string, React.ReactNode>; filled?: Record<string, boolean> }) {
  const langs = Object.keys(panels)
  const [active, setActive] = useState(langs[0])
  return (
    <div className="langtabs">
      <div className="tabs" role="tablist">
        {langs.map((l) => (
          <button key={l} type="button" role="tab" aria-selected={active === l} className={active === l ? 'is-active' : undefined} onClick={() => setActive(l)}>
            {labels[l] ?? l}{filled && !filled[l] ? ' ○' : ''}
          </button>
        ))}
      </div>
      {langs.map((l) => (
        <div key={l} role="tabpanel" hidden={active !== l}>{panels[l]}</div>
      ))}
    </div>
  )
}
