import Link from 'next/link'
import { Card, DbNotice, Flash, PageHead, langLabel } from '@/components/admin/ui'
import { flatten, keyLabel, sectionOf, textSections } from '@/lib/admin/texts'
import { getTextOverrides } from '@/lib/content'
import { getDict, isLocale, locales, type Locale } from '@/lib/i18n'
import { hasDb } from '@/lib/db'
import { resetText, saveTexts } from '../../actions'

export const metadata = { title: 'Texte & Bio' }

export default async function Texts({ searchParams }: PageProps<'/admin/texte'>) {
  const sp = await searchParams
  const lang: Locale = typeof sp.lang === 'string' && isLocale(sp.lang) ? sp.lang : 'ku'
  const section = typeof sp.section === 'string' && textSections.some((s) => s.id === sp.section) ? sp.section : 'bio'
  const ro = !hasDb()
  const defaults = flatten(getDict(lang))
  const reference = lang === 'tr' ? null : flatten(getDict('tr'))
  const overrides = await getTextOverrides(lang)
  const keys = Object.keys(defaults).filter((k) => sectionOf(k) === section)
  const changedIn = (id: string) => Object.keys(overrides).filter((k) => sectionOf(k) === id).length
  const info = textSections.find((s) => s.id === section)!

  return (
    <>
      <PageHead title="Texte & Bio" sub="Alle festen Texte der Website in vier Sprachen. Geänderte Felder sind markiert und lassen sich jederzeit auf das Original zurücksetzen." />
      <Flash ok={sp.ok} />
      <DbNotice />
      <nav className="tabs" aria-label="Sprache">
        {locales.map((l) => (
          <Link key={l} href={`/admin/texte?lang=${l}&section=${section}`} className={l === lang ? 'is-active' : undefined}>{langLabel[l]}</Link>
        ))}
      </nav>
      <div className="texts">
        <nav className="subnav" aria-label="Bereich">
          {textSections.map((s) => (
            <Link key={s.id} href={`/admin/texte?lang=${lang}&section=${s.id}`} className={s.id === section ? 'is-active' : undefined}>
              {s.label}{changedIn(s.id) ? <span className="badge">{changedIn(s.id)}</span> : null}
            </Link>
          ))}
        </nav>
        <Card title={`${info.label} · ${langLabel[lang]}`}>
          {info.hint && <p className="hint">{info.hint}</p>}
          <form action={saveTexts} className="text-form">
            <input type="hidden" name="lang" value={lang} />
            <input type="hidden" name="section" value={section} />
            {keys.map((k) => {
              const value = overrides[k] ?? defaults[k]
              const long = defaults[k].length > 70
              const changed = k in overrides
              return (
                <div key={k} className={`field text-field${changed ? ' is-changed' : ''}`}>
                  <label htmlFor={`t-${k}`} className="field-label">
                    {keyLabel(k)} {changed && <span className="tag tag-warn">geändert</span>}
                  </label>
                  {long ? (
                    <textarea id={`t-${k}`} name={`t:${k}`} defaultValue={value} rows={Math.min(14, Math.ceil(defaults[k].length / 90) + 1)} disabled={ro} dir="auto" />
                  ) : (
                    <input id={`t-${k}`} name={`t:${k}`} defaultValue={value} disabled={ro} dir="auto" />
                  )}
                  <div className="text-meta">
                    {reference && <small className="muted" title="Türkische Fassung als Hilfe">TR: {reference[k]}</small>}
                    {changed && (
                      <button className="linklike" formAction={resetText} name="key" value={k} disabled={ro}>Original wiederherstellen</button>
                    )}
                  </div>
                </div>
              )
            })}
            <div className="sticky-save">
              <button className="btn btn-primary" type="submit" disabled={ro}>Änderungen speichern</button>
            </div>
          </form>
        </Card>
      </div>
    </>
  )
}
