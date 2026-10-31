-- Neon / Postgres schema for azadbedran.com

create table if not exists concerts (
  id          serial primary key,
  date        date not null,
  time        time,
  city        text not null,
  venue       text,
  address     text,
  phone       text,
  poster_url  text,
  country     text not null default 'TR',
  ticket_url  text,
  sold_out    boolean not null default false,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists news (
  id          serial primary key,
  date        date not null default current_date,
  title_ku    text not null,
  title_tr    text not null,
  title_en    text not null,
  title_ru    text,
  body_ku     text not null default '',
  body_tr     text not null default '',
  body_en     text not null default '',
  body_ru     text,
  image_url   text,
  link_url    text,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists concerts_date_idx on concerts (date);
create index if not exists news_date_idx on news (date desc);

-- Ergänzungen für bestehende Datenbanken
alter table concerts alter column venue drop not null;
alter table concerts add column if not exists address text;
alter table concerts add column if not exists phone text;
alter table concerts add column if not exists poster_url text;
alter table news add column if not exists title_ru text;
alter table news add column if not exists body_ru text;

-- ===== Admin-Bereich: weitere Inhalte =====

create table if not exists videos (
  id          serial primary key,
  youtube_id  text not null unique,
  title       text not null,
  date        date,
  live        boolean not null default false,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists gallery (
  id          serial primary key,
  src         text not null,
  width       int not null,
  height      int not null,
  alt         text,
  sort        int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Eigene Uploads (Bilder für Galerie, News, Konzertplakate)
create table if not exists media (
  id          serial primary key,
  name        text not null,
  mime        text not null,
  width       int,
  height      int,
  size        int not null,
  data        bytea not null,
  created_at  timestamptz not null default now()
);

-- Veröffentlichungen von Apple Music ausblenden
create table if not exists release_overrides (
  apple_id    bigint primary key,
  hidden      boolean not null default false,
  updated_at  timestamptz not null default now()
);

-- Geänderte Texte (überschreiben lib/i18n.ts), key = Pfad wie 'bio.sections.0.p.1'
create table if not exists texts (
  lang        text not null,
  key         text not null,
  value       text not null,
  updated_at  timestamptz not null default now(),
  primary key (lang, key)
);

-- ===== Eigene Besucherstatistik (ohne Cookies, ohne gespeicherte IP-Adressen) =====

create table if not exists analytics_events (
  id           bigserial primary key,
  ts           timestamptz not null default now(),
  type         text not null,          -- 'pageview' | 'click'
  visitor      text not null,          -- täglich wechselnder anonymer Hash
  pid          text,                   -- Seitenaufruf-ID (für Verweildauer)
  path         text not null,
  lang         text,
  referrer     text,                   -- Host der Herkunftsseite
  referrer_url text,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  country      text,
  region       text,
  city         text,
  device       text,
  browser      text,
  os           text,
  screen       text,
  target       text,                   -- Link-Ziel bei Klicks
  label        text,                   -- Link-Text bei Klicks
  external     boolean,
  duration     int                     -- Sekunden aktiv auf der Seite
);
create index if not exists analytics_ts_idx on analytics_events (ts desc);
create index if not exists analytics_type_ts_idx on analytics_events (type, ts desc);
create index if not exists analytics_pid_idx on analytics_events (pid);

create table if not exists analytics_live (
  visitor     text primary key,
  path        text not null,
  country     text,
  city        text,
  device      text,
  browser     text,
  os          text,
  referrer    text,
  first_seen  timestamptz not null default now(),
  last_seen   timestamptz not null default now()
);
