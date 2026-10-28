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

## Wo was gepflegt wird

| Was | Wo |
| --- | --- |
| Konzerte (kommende + vergangene) | Neon, Tabelle `concerts` |
| News (3 Sprachen) | Neon, Tabelle `news` |
| Alben/Singles inkl. Original-Cover | automatisch von Deezer, sonst Apple Music/iTunes (alle 6 h), Fallback `lib/seed.ts` |
| Texte, Bio, Menü (3 Sprachen) | `lib/i18n.ts` |
| Social-Links, Plattformen, Manager, Videos, Galerie | `lib/site.ts` |
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

Keine externen Schriften (selbst gehostet), keine Cookies. YouTube-, Deezer- und Spotify-Player werden erst nach Klick geladen (Zwei-Klick-Lösung).
