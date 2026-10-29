// Diskografie laut Apple Music (Künstler-ID 1116072473), abgerufen am 29.10.2026.
// Dient als Grundlage; neue Veröffentlichungen kommen zur Laufzeit automatisch über die iTunes-API dazu.
// art = Pfad unter https://is1-ssl.mzstatic.com/image/thumb/ (Größe wird beim Ausliefern angehängt).

export type CatalogEntry = {
  id: number
  title: string
  date: string
  type: 'album' | 'live' | 'single'
  tracks: number
  art: string
  with?: string[]
  feat?: string
}

export const catalog: CatalogEntry[] = [
  {id: 6822165849, title: 'Ez Dînim', date: '2026-10-08', type: 'single', tracks: 1, art: 'Music221/v4/14/1a/7a/141a7adc-6a72-b5e9-5963-83662ed966a6/artwork.jpg'},
  {id: 6821473789, title: 'Tu Çîrokek Bê Hempa', date: '2026-09-24', type: 'single', tracks: 1, art: 'Music221/v4/76/c3/62/76c3628a-f6ff-0843-650f-a132bd0931e6/artwork.jpg', with: ['Suleyman']},
  {id: 6795990207, title: 'Evîna Azad (Live)', date: '2026-07-31', type: 'live', tracks: 13, art: 'Music211/v4/33/ed/4c/33ed4cd1-1a2c-babb-770a-113d900bf9a5/cover.jpg'},
  {id: 1894814735, title: 'Buk Û Zava Yê Me', date: '2026-04-19', type: 'single', tracks: 1, art: 'Music211/v4/dc/01/a9/dc01a964-05fd-c6e1-7c81-5a1322d166f7/cover.jpg'},
  {id: 1888170202, title: 'Amedspor Geliyor', date: '2026-03-26', type: 'single', tracks: 1, art: 'Music221/v4/23/7f/e5/237fe520-49e6-3dd3-d5dd-abc61512280a/cover.jpg'},
  {id: 1869378965, title: 'Bilbilek Xemgînim', date: '2026-01-15', type: 'single', tracks: 1, art: 'Music221/v4/e3/03/63/e3036348-13d3-d8fb-3f64-d350d120faa1/cover.jpg'},
  {id: 1858230485, title: 'Bargiran', date: '2025-12-01', type: 'single', tracks: 1, art: 'Music211/v4/5a/5a/87/5a5a8787-c91f-b0e0-b4ec-ce6c0272566c/cover.jpg', with: ['Berfîn Mamedova']},
  {id: 1848126083, title: 'Ka Berxêmin', date: '2025-10-23', type: 'single', tracks: 1, art: 'Music211/v4/38/c1/e1/38c1e170-0381-5241-3c28-73314f36c416/cover.jpg'},
  {id: 1829931653, title: 'Nîno', date: '2025-07-30', type: 'single', tracks: 1, art: 'Music221/v4/10/cc/d9/10ccd932-a485-fc6c-bf55-3a37d53d4ee3/cover.jpg'},
  {id: 1827920408, title: 'Oxir Be Ji Tere', date: '2025-07-18', type: 'single', tracks: 1, art: 'Music221/v4/7f/96/ce/7f96cea0-7ad0-72ff-3172-0f390009a09c/cover.jpg'},
  {id: 1816664294, title: 'Bêhna Bihuşt', date: '2025-05-24', type: 'single', tracks: 1, art: 'Music221/v4/b0/13/41/b0134106-c97d-72f0-2c4b-c4a607473387/cover.jpg'},
  {id: 1803367712, title: 'Nav Bexça Dil', date: '2025-03-20', type: 'single', tracks: 1, art: 'Music211/v4/6d/c1/c8/6dc1c826-4af0-30a8-f9fe-c3a743177736/cover.jpg'},
  {id: 1794342298, title: 'Potporî', date: '2025-02-02', type: 'single', tracks: 1, art: 'Music221/v4/13/5b/14/135b14c6-af51-1cb7-06aa-46ac3ea7d6fd/cover.jpg'},
  {id: 1781220637, title: 'Çavênte Welatêmine', date: '2024-11-22', type: 'single', tracks: 1, art: 'Music221/v4/5f/83/d6/5f83d6de-c74b-adea-9aef-a98d6400400a/cover.jpg'},
  {id: 1762781433, title: 'Bi Xêr Hatî', date: '2024-08-14', type: 'single', tracks: 1, art: 'Music211/v4/38/4c/12/384c125e-adcd-8e9a-459d-4a8a7f3c639b/cover.jpg'},
  {id: 1739102662, title: 'Dil Bide Mın', date: '2024-04-02', type: 'single', tracks: 1, art: 'Music211/v4/9a/ff/d4/9affd49c-cc12-43fd-0109-0aa143e8a466/cover.jpg'},
  {id: 1718118719, title: 'Bîramin Narî', date: '2023-11-23', type: 'single', tracks: 1, art: 'Music116/v4/a0/0d/c4/a00dc403-ae49-62ba-c5bf-812f960cea59/cover.jpg'},
  {id: 1715631468, title: 'Behna Te Dikim Dayê', date: '2023-11-08', type: 'single', tracks: 1, art: 'Music116/v4/a0/56/5c/a0565c3b-d357-1e63-739d-36bdc8dc1cb3/cover.jpg'},
  {id: 1714823464, title: 'Wê Şevê', date: '2023-10-29', type: 'single', tracks: 1, art: 'Music116/v4/72/98/8c/72988c3b-c8a0-8dc2-0e35-b07d02a22891/cover.jpg'},
  {id: 1711764403, title: 'Dilê Zagros', date: '2023-10-13', type: 'single', tracks: 1, art: 'Music126/v4/60/29/c0/6029c01f-c0d5-2428-696d-8028b186aa3b/cover.jpg'},
  {id: 1711764482, title: 'Were Canê', date: '2023-10-13', type: 'single', tracks: 1, art: 'Music116/v4/7d/5f/1a/7d5f1a9c-c9c7-251d-9710-4124ce1da307/cover.jpg'},
  {id: 1711764555, title: 'Adalıyız', date: '2023-10-13', type: 'single', tracks: 1, art: 'Music116/v4/80/de/ac/80deacb6-c008-cb6b-c2bc-e4bf23a3ae4a/cover.jpg'},
  {id: 1711764885, title: 'Siz Yanmayın', date: '2023-10-13', type: 'single', tracks: 1, art: 'Music116/v4/85/f4/66/85f46698-771a-4a31-c5d8-8bd9de9fc3e0/cover.jpg'},
  {id: 1711764856, title: 'Solzer', date: '2023-10-13', type: 'single', tracks: 1, art: 'Music116/v4/f9/51/d1/f951d15c-055f-f6a7-9cfd-4f756940037e/cover.jpg'},
  {id: 1711764814, title: 'Oxir Be', date: '2023-10-13', type: 'single', tracks: 1, art: 'Music116/v4/a1/2d/c3/a12dc3c6-262a-8472-0415-a14af1e68ca5/cover.jpg'},
  {id: 1711764460, title: 'Aç Kaldık özgürlüğe', date: '2023-10-13', type: 'single', tracks: 1, art: 'Music116/v4/d0/7b/42/d07b42ae-9500-7612-be52-15fea3dd8c13/cover.jpg', with: ['Selahattin Demirtaş']},
  {id: 1709931825, title: 'Em Tenêne', date: '2023-10-01', type: 'single', tracks: 1, art: 'Music116/v4/70/cf/99/70cf9953-0e8a-52f3-c70f-56de84c5cd25/cover.jpg'},
  {id: 1709930113, title: 'Katyusha Kurdish', date: '2023-10-01', type: 'single', tracks: 1, art: 'Music126/v4/ac/a8/58/aca858b4-ae74-4886-3a6d-30a66c3d6777/cover.jpg'},
  {id: 1709929445, title: 'Nofa', date: '2023-09-30', type: 'single', tracks: 1, art: 'Music116/v4/4b/70/cc/4b70cc99-eb63-4c22-6f21-e52c3dcddc5a/cover.jpg'},
  {id: 1709929664, title: 'Leyla', date: '2023-09-30', type: 'single', tracks: 1, art: 'Music126/v4/fc/fd/d4/fcfdd410-8ee9-f611-da98-9b0c945f909f/cover.jpg', with: ['Svetlana']},
  {id: 1709929711, title: 'Çavşîn', date: '2023-09-30', type: 'single', tracks: 1, art: 'Music116/v4/ec/8c/75/ec8c75f5-34f1-1594-59bb-fb7594f0dcca/cover.jpg'},
  {id: 1709932049, title: 'Evîndarim', date: '2023-09-30', type: 'single', tracks: 1, art: 'Music126/v4/62/31/8f/62318f29-bf5c-29b2-cba2-5e0dd326f5ae/cover.jpg'},
  {id: 1709931874, title: 'Xezale Xezale', date: '2023-09-30', type: 'single', tracks: 1, art: 'Music126/v4/21/cc/ed/21cced33-e8a2-5d17-8c00-d3369786cb3e/cover.jpg'},
  {id: 1709931793, title: 'Etuna Dilêmin', date: '2023-09-30', type: 'single', tracks: 1, art: 'Music116/v4/94/a0/c4/94a0c468-c9e2-7ab1-0a5b-c9f9537c0f60/cover.jpg'},
  {id: 1709929211, title: 'Ax Çiyao', date: '2023-09-30', type: 'single', tracks: 1, art: 'Music126/v4/99/01/d0/9901d09a-8ced-fd19-a90f-508a62fbb46f/cover.jpg'},
  {id: 1709929684, title: 'Heval', date: '2023-09-30', type: 'single', tracks: 1, art: 'Music116/v4/b9/d0/eb/b9d0ebc8-4e25-b31f-2ae4-9fa38cdd779f/cover.jpg'},
  {id: 1709932109, title: 'Xezala Min', date: '2023-09-30', type: 'single', tracks: 1, art: 'Music126/v4/21/8b/34/218b34cf-b569-9f6a-3860-94d8a54f2f72/cover.jpg', with: ['Dilbirîn Azîz']},
  {id: 1709929744, title: 'Newroze', date: '2023-09-30', type: 'single', tracks: 1, art: 'Music126/v4/a3/58/ee/a358ee6a-266b-b722-3f8b-883059559470/cover.jpg', with: ['Hozan Diyar']},
  {id: 1708872042, title: 'Bila Bê', date: '2023-09-24', type: 'single', tracks: 1, art: 'Music116/v4/ad/75/e3/ad75e327-57ad-f72a-5dd9-338ff10acfc0/cover.jpg'},
  {id: 1707842934, title: 'Paytexta Evînê', date: '2023-09-17', type: 'album', tracks: 10, art: 'Music126/v4/7f/8e/15/7f8e15a0-a418-9dfb-1ca5-69d08c4ee975/cover.jpg'},
  {id: 1707253008, title: 'Wayê Wayê', date: '2023-09-12', type: 'single', tracks: 1, art: 'Music126/v4/d3/16/b7/d316b729-3d56-56c3-a37b-3b88a61cc687/cover.jpg'},
  {id: 1707185220, title: 'Ez Nisêbin Tu Qamişlo', date: '2023-09-11', type: 'single', tracks: 1, art: 'Music126/v4/b6/e6/d3/b6e6d350-ed42-8ff4-81b3-d42a527cc32a/cover.jpg'},
  {id: 1707326404, title: 'Ki Zava', date: '2023-09-11', type: 'single', tracks: 1, art: 'Music126/v4/07/9f/17/079f17a8-2394-b7dd-e762-09567effe3c4/cover.jpg'},
  {id: 1706503757, title: 'Evîna Azad', date: '2023-09-07', type: 'album', tracks: 8, art: 'Music126/v4/d8/68/56/d86856ce-fc0f-d52c-0a93-f26443f23480/cover.jpg'},
  {id: 1666259356, title: 'Emekçiyiz', date: '2023-01-13', type: 'single', tracks: 1, art: 'Music113/v4/ef/f1/f5/eff1f551-9f27-30c9-c8c9-662fd2eb4fd2/cover.jpg', with: ['Selahattin Demirtaş', 'Dicle Fırat Korosu']},
  {id: 1623333246, title: 'Newroz', date: '2022-05-03', type: 'single', tracks: 1, art: 'Music122/v4/3a/8a/f8/3a8af8a9-1e3e-77b0-f2c7-e84aee817667/8682370085911_Cover.jpg'},
  {id: 1623215047, title: 'Rêwiyên Şad', date: '2022-05-03', type: 'single', tracks: 1, art: 'Music122/v4/fe/94/f1/fe94f122-8139-c8e0-7eb6-76c4ead3cc14/8682370085850_Cover.jpg'},
  {id: 1623332646, title: 'Eslixan', date: '2022-05-03', type: 'single', tracks: 1, art: 'Music116/v4/ae/1c/b0/ae1cb009-da1d-3012-f5f7-b386a03b0cc9/8682370085881_Cover.jpg'},
  {id: 1623332333, title: 'CizreSpor Marşı', date: '2022-05-03', type: 'single', tracks: 1, art: 'Music122/v4/f7/71/fd/f771fd2a-9c24-710e-a20f-07f9e6cb4f51/8682370085898_Cover.jpg'},
  {id: 1623333113, title: 'Aşk Amedspor', date: '2022-05-03', type: 'single', tracks: 1, art: 'Music122/v4/ed/c5/53/edc553ef-4b78-acb8-ad6c-055bb3287d22/8682370085843_Cover.jpg'},
  {id: 1623332909, title: 'Dayikamın', date: '2022-05-03', type: 'single', tracks: 1, art: 'Music112/v4/74/8a/96/748a9676-40df-a69d-f91a-6824a0df0ae5/8682370085904_Cover.jpg'},
  {id: 1623332900, title: 'Dur Bu', date: '2022-05-03', type: 'single', tracks: 1, art: 'Music112/v4/04/e2/f4/04e2f4ec-5841-ecaf-f7ac-335d79c9af76/8682370085874_Cover.jpg'},
  {id: 1605589157, title: 'Ez Dinim', date: '2022-01-15', type: 'single', tracks: 1, art: 'Music126/v4/57/4f/8b/574f8bc8-493e-a3c2-ebfd-f9d928af3c0d/cover.jpg'},
  {id: 1594421612, title: 'Eman Dılo', date: '2021-11-08', type: 'single', tracks: 1, art: 'Music126/v4/32/50/af/3250af0f-e92e-16b3-568e-29f9c76d12aa/cover.jpg', with: ['Erhan Çakar']},
  {id: 1589041570, title: 'Wayê Wayê', date: '2021-08-27', type: 'single', tracks: 1, art: 'Music115/v4/6b/80/2f/6b802f5d-c739-5ab3-a118-867fc0d33b2a/cover.jpg'},
  {id: 1560802211, title: 'Were Canê', date: '2021-03-25', type: 'single', tracks: 1, art: 'Music114/v4/75/3e/d0/753ed028-0c6c-3ced-2f76-951465185aab/cover.jpg', with: ['Farqin Azad'], feat: 'Seyitxanê Boyaxçi'},
  {id: 1116072397, title: 'Rêwiyên Şad', date: '2016-05-27', type: 'album', tracks: 14, art: 'Music60/v4/5b/d2/16/5bd216a2-b756-1a1c-2e41-eecc8c3ff05c/cover.jpg'},
]
