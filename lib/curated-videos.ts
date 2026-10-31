export type CuratedVideo = { id: string; title: string; date: string | null; views: number | null; live?: boolean }

// Videos vom offiziellen Kanal (geprüft am 29.10.2026: Titel, Kanal und Datum je Video-Seite)
export const curatedVideos: CuratedVideo[] = [
  { id: 'VZn3rkqh3fo', title: 'Evîna Azad (Konser)', date: '2026-02-27', views: null, live: true },
  { id: 'QjVfjl1WZSQ', title: 'Aşk Amedspor', date: '2026-02-19', views: null },
  { id: 'X3v4Kf8eqrU', title: 'Ka Berxêmin', date: '2025-10-22', views: null },
  { id: 'cnc8kazmikw', title: 'Bêhna Bihuşt', date: '2025-05-23', views: null },
  { id: 'RyvXQT1Qawk', title: 'Wayê Wayê (Amed Konser)', date: '2025-04-30', views: null, live: true },
  { id: 'S7aEHWX9S_s', title: 'Nav Bexça Dil', date: '2025-03-19', views: null },
  { id: '99FHK_kU_VI', title: 'Eva Dinya Pir Mezine (Konser)', date: '2025-02-24', views: null, live: true },
  { id: 'T1hJUjF4T8w', title: 'Çavênte Welatêmine', date: '2024-11-19', views: null },
  { id: 'rnWBZ_zcIU4', title: 'Rêwîyên Şad (Konser)', date: '2024-09-16', views: null, live: true },
  { id: 'Zi8O9otMccI', title: 'Bi Xêr Hatî', date: '2024-08-10', views: null },
  { id: '-S1OrYqfP4E', title: 'Behna Te Dikim Dayê (Konser)', date: '2023-11-04', views: null, live: true },
  { id: 'egq65dfRCE8', title: 'Wayê Wayê', date: '2022-11-24', views: null },
  { id: 'lPwpPGc5nvU', title: 'Paytexta Evînê (Albûm)', date: '2022-08-22', views: null },
  { id: '1X9jHJ6obCo', title: 'Dilaname', date: '2022-05-31', views: null },
  { id: '1zvC29-Y3Dk', title: 'Haydi Amedspor', date: '2022-05-06', views: null },
  { id: 'S3TXj9NVLrs', title: 'Paytexta Evînê', date: '2022-05-02', views: null },
  { id: 'HVeayn2-1Go', title: 'Govend & Halay (Zindî)', date: '2022-03-30', views: null, live: true },
  { id: 'Q3msL9cGb5Q', title: 'Oxir Be', date: '2021-07-16', views: null },
  { id: 'zLv7-xd8ckQ', title: 'Cejna We Pîroz (Newroza Wanê 2021)', date: '2021-03-24', views: null, live: true },
  { id: 'YF-NBRgKH1A', title: 'Were Canê (Ji Bo Xalê Seyitxan)', date: '2021-02-28', views: null },
  { id: 'f8mhHLCT6K4', title: 'Hîve', date: '2020-08-11', views: null },
  { id: '797KSMidXWw', title: 'Ez Nisêbin Tu Qamişlo', date: '2019-10-17', views: null },
  { id: '9qnivjfZOgU', title: 'Leyla (bi Svetlana re)', date: '2018-12-20', views: null },
  { id: 'Ob7TMB3GTyU', title: 'Ki Zava', date: '2017-06-21', views: null },
]
