-- Neon / Postgres schema for azadbedran.com

create table if not exists concerts (
  id          serial primary key,
  date        date not null,
  time        time,
  city        text not null,
  venue       text not null,
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
  body_ku     text not null default '',
  body_tr     text not null default '',
  body_en     text not null default '',
  image_url   text,
  link_url    text,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists concerts_date_idx on concerts (date);
create index if not exists news_date_idx on news (date desc);
