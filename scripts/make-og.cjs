// Erzeugt die Vorschaubilder für WhatsApp, Instagram, Facebook, X und Google (public/og/<lang>.jpg).
// Aufruf: node scripts/make-og.cjs
const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')
const os = require('os')

const root = path.join(__dirname, '..')
const file = (p) => 'file://' + path.join(root, p)
const copy = {
  ku: { kicker: 'Stranbêj · Stranivîs · Amed', line: 'Malpera fermî', concerts: 'Konser û Bilêt' },
  tr: { kicker: 'Şarkıcı · Söz yazarı · Amed', line: 'Resmî web sitesi', concerts: 'Konserler ve Biletler' },
  en: { kicker: 'Singer · Songwriter · Amed', line: 'Official website', concerts: 'Concerts & Tickets' },
  ru: { kicker: 'Певец · Автор песен · Амед', line: 'Официальный сайт', concerts: 'Концерты и билеты' },
}
// Konzert-Vorschau: aktuelles Tourplakat rechts. Bei neuer Tour Plakat tauschen und Skript neu ausführen.
const poster = 'public/images/poster-kasim-2026.jpg'

const html = ({ kicker, line }, variant = 'home') => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Bodoni; src: url(${file('node_modules/@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-opsz-normal.woff2')}); font-weight: 400 900; }
@font-face { font-family: Manrope; src: url(${file('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')}); font-weight: 200 800; }
@font-face { font-family: Manrope; src: url(${file('node_modules/@fontsource-variable/manrope/files/manrope-cyrillic-wght-normal.woff2')}); font-weight: 200 800; unicode-range: U+0400-045F; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #0f0a07; overflow: hidden; position: relative; font-family: Manrope; }
.photo { position: absolute; top: 0; bottom: 0; left: 380px; right: -40px; background: url(${file('public/images/azad-studio.jpg')}) 50% 22% / cover; }
.shade { position: absolute; inset: 0; background: linear-gradient(90deg, #0f0a07 0%, #0f0a07 33%, rgba(15,10,7,.72) 39%, rgba(15,10,7,.3) 50%, rgba(15,10,7,0) 62%), linear-gradient(0deg, rgba(15,10,7,.55), transparent 35%); }
.text { position: absolute; left: 72px; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; width: 560px; }
.kicker { color: #e0a35e; font-weight: 700; font-size: 22px; letter-spacing: .16em; text-transform: uppercase; }
h1 { font-family: Bodoni; font-weight: 700; font-variation-settings: 'opsz' 11; color: #f3e6d3; font-size: 108px; line-height: .95; margin: 22px 0 26px; }
.rule { width: 120px; height: 2px; background: #a8683f; margin-bottom: 24px; }
.line { color: #f0e3d0; font-size: 30px; font-weight: 600; }
.url { color: #c2af99; font-size: 22px; font-weight: 600; margin-top: 10px; letter-spacing: .04em; }
.poster { position: absolute; right: 90px; top: 50%; height: 520px; transform: translateY(-50%) rotate(2deg); border-radius: 10px; box-shadow: 0 30px 80px rgba(0,0,0,.7); }
.glow { position: absolute; inset: 0; background: radial-gradient(45% 70% at 78% 50%, rgba(168,104,63,.45), transparent 70%); }
</style></head><body>${variant === 'home' ? '<div class="photo"></div><div class="shade"></div>' : `<div class="glow"></div><img class="poster" src="${file(poster)}">`}
<div class="text"><p class="kicker">${kicker}</p><h1>AZAD<br>BEDRAN</h1><div class="rule"></div><p class="line">${line}</p><p class="url">azadbedran.com</p></div></body></html>`

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  for (const [lang, c] of Object.entries(copy)) {
    const tmp = path.join(os.tmpdir(), `og-${lang}.html`)
    fs.writeFileSync(tmp, html(c))
    await page.goto('file://' + tmp, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: path.join(root, `public/og/${lang}.jpg`), type: 'jpeg', quality: 86 })
    fs.writeFileSync(tmp, html({ ...c, line: c.concerts }, 'concerts'))
    await page.goto('file://' + tmp, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: path.join(root, `public/og/concerts-${lang}.jpg`), type: 'jpeg', quality: 86 })
  }
  await browser.close()
})()
