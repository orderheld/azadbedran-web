# azadbedran.com

Offizielle Website von Azad Bedran. Next.js 16 (App Router), dreisprachig (Kurmancî `/ku`, Türkçe `/tr`, English `/en`), Inhalte aus Neon Postgres, Hosting auf Vercel, Domain bei cyon.

## Lokal starten

```bash
npm install
cp .env.example .env.local   # DATABASE_URL eintragen (optional)
npm run dev                  # http://localhost:3000
```

Ohne `DATABASE_URL` läuft die Seite mit den Startdaten aus `lib/seed.ts`.
Mit `SHOW_DEMO_CONTENT=1` erscheinen Beispiel-Konzerte (markiert mit DEMO/MÎNAK/ÖRNEK), nur für Vorschauen.

## Admin-Bereich

Unter **`/admin`** (z. B. https://azadbedran.com/admin) gibt es ein Dashboard im Stil von WordPress:

- **Dashboard**: Live-Besucher, Kennzahlen der letzten 7 Tage, nächste Konzerte, neueste News, Systemstatus
- **Statistik**: Live, Besucher (Seiten, Einstiegsseiten, Herkunft, UTM-Kampagnen, Länder, Städte, Geräte, Browser/Apps, Betriebssysteme, Sprache, Verweildauer, Absprungrate) und Link-Klicks (Anzahl, Seite, Herkunft, Land, Gerät)
- **Inhalte**: Konzerte, News (4 Sprachen), Musik (Apple-Veröffentlichungen ausblenden), Videos, Galerie (Upload, Reihenfolge, Bildtext), Texte & Bio (alle Texte aus `lib/i18n.ts` überschreibbar), Medien
- **Einstellungen & SEO**: Status der Konfiguration, Links zu Sitemap, Search Console, PageSpeed, Statistik zurücksetzen

Einrichtung: in Vercel `ADMIN_PASSWORD` (mind. 8 Zeichen) setzen, Neon verbinden, neu deployen, dann unter `/admin` auf „Datenbank einrichten“ klicken (alternativ `npm run db:setup`; beides kann gefahrlos wiederholt werden).

Die Statistik ist selbst gebaut (`components/Analytics.tsx`, `app/api/t`): keine Cookies, keine gespeicherten IP-Adressen, Besucher werden über einen täglich wechselnden Hash gezählt. Land/Stadt kommen aus den Vercel-Geo-Headern. Eigene Besuche mit Admin-Anmeldung werden nicht gezählt, Bots werden ausgefiltert.

Lokal testen mit normalem Postgres: `DATABASE_URL=postgres://postgres@localhost:5432/azad` (wird automatisch erkannt).

## Wo was gepflegt wird

| Was | Wo |
| --- | --- |
| Konzerte (kommende + vergangene) | Admin → Konzerte (Neon, Tabelle `concerts`) |
| News (4 Sprachen) | Admin → News (Tabelle `news`) |
| Alben/Singles inkl. Original-Cover | automatisch von Deezer, sonst Apple Music/iTunes (alle 6 h), Fallback `lib/seed.ts` |
| Texte, Bio, Menü (4 Sprachen) | `lib/i18n.ts`, Änderungen über Admin → Texte & Bio (Tabelle `texts`) |
| Videos, Galerie | Admin → Videos / Galerie (Tabellen `videos`, `gallery`; ohne Datenbank `lib/curated-videos.ts`, `lib/site.ts`) |
| Social-Links, Plattformen, Manager | `lib/site.ts` |
| Fotos | `public/images/`, `public/gallery/` |

Neuer Konzerttermin in Neon (SQL-Editor):

```sql
insert into concerts (date, time, city, venue, country, ticket_url)
values ('2026-12-20', '21:00', 'Amed / Diyarbakır', 'Sezai Karakoç Kültür ve Kongre Merkezi', 'TR', 'https://...');
```

Der nächste Termin erscheint automatisch oben im Hero und hervorgehoben in der Konzertliste. Nach dem Datum wandert er von selbst zu „Vergangene Konzerte“.

## Deployment

1. **Neon**: In Vercel unter *Storage → Neon* eine Datenbank anlegen (setzt `DATABASE_URL` automatisch), Region Frankfurt (`eu-central-1`).
2. Tabellen + Startdaten anlegen: `DATABASE_URL=... npm run db:setup`
3. **Vercel**: Repository importieren, Framework „Next.js“, Env `NEXT_PUBLIC_SITE_URL=https://azadbedran.com`.
4. **cyon (DNS)**: Im my.cyon-Panel für azadbedran.com
   - `A`-Record `@` → `76.76.21.21`
   - `CNAME` `www` → `cname.vercel-dns.com`
   (Werte vor dem Umstellen in Vercel unter *Domains* prüfen, Vercel zeigt die aktuellen an.)
   E-Mail (MX) bleibt bei cyon.

## Datenschutz

Keine externen Schriften (selbst gehostet), keine Tracking-Cookies, eigene anonyme Statistik ohne IP-Speicherung. YouTube-, Deezer- und Spotify-Player werden erst nach Klick geladen (Zwei-Klick-Lösung).
