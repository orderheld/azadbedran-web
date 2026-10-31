// Texte der Website (lib/i18n.ts) für den Editor im Admin-Bereich

export function flatten(node: unknown, prefix = '', out: Record<string, string> = {}) {
  if (typeof node === 'string') out[prefix] = node
  else if (node && typeof node === 'object')
    for (const [k, v] of Object.entries(node)) flatten(v, prefix ? `${prefix}.${k}` : k, out)
  return out
}

export const textSections: { id: string; label: string; hint?: string }[] = [
  { id: 'bio', label: 'Biografie', hint: 'Einleitung, Kapitel, Zahlen und Zeitleiste der Biografie-Seite.' },
  { id: 'hero', label: 'Startseite oben' },
  { id: 'meta', label: 'Google & Teilen', hint: 'Titel und Beschreibung, die Google und WhatsApp/Instagram anzeigen.' },
  { id: 'contact', label: 'Kontakt' },
  { id: 'concerts', label: 'Konzerte' },
  { id: 'music', label: 'Musik' },
  { id: 'videos', label: 'Videos' },
  { id: 'nav', label: 'Menü' },
  { id: 'news', label: 'News' },
  { id: 'gallery', label: 'Galerie' },
  { id: 'player', label: 'Player' },
  { id: 'choose', label: 'Plattform-Auswahl' },
  { id: 'footer', label: 'Fußzeile' },
  { id: 'other', label: 'Sonstiges' },
]

// Lesbare Bezeichnung für einen Schlüssel wie 'bio.sections.2.p.0'
export function keyLabel(key: string) {
  const parts = key.split('.').slice(1)
  const names: Record<string, string> = {
    title: 'Titel', description: 'Beschreibung', kicker: 'Überzeile', lead: 'Einleitung', tagline: 'Slogan', text: 'Text',
    sections: 'Kapitel', h: 'Überschrift', p: 'Absatz', facts: 'Zahl', value: 'Wert', label: 'Beschriftung',
    timeline: 'Zeitleiste', year: 'Jahr', quote: 'Zitat', more: 'Link „Mehr“', timelineTitle: 'Titel Zeitleiste', sources: 'Quellen',
  }
  return parts.map((p) => (/^\d+$/.test(p) ? `${Number(p) + 1}` : names[p] ?? p)).join(' › ') || key
}

export const sectionOf = (key: string) => {
  const top = key.split('.')[0]
  return textSections.some((s) => s.id === top) ? top : 'other'
}
