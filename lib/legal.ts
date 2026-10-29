import type { Locale } from './i18n'
import { manager } from './site'

type Block = { h: string; p: string[] }

// Hinweis: Für ein vollständiges Impressum fehlt noch eine Postanschrift (bei Ferhat angefragt).
export const imprint: Record<Locale, Block[]> = {
  ku: [
    { h: 'Berpirsiyarê naverokê', p: ['Azad Bedran'] },
    { h: 'Rêveberî & booking', p: [`${manager.name} · ${manager.phone}`] },
    { h: 'Wêne û muzîk', p: ['Wêne, berg û tomarên dengî yên Azad Bedran in an jî bi destûra xwediyên mafan têne bikaranîn. Hemû maf parastî ne.'] },
  ],
  tr: [
    { h: 'İçerikten sorumlu', p: ['Azad Bedran'] },
    { h: 'Menajerlik & booking', p: [`${manager.name} · ${manager.phone}`] },
    { h: 'Fotoğraflar ve müzik', p: ['Fotoğraflar, kapaklar ve ses kayıtları Azad Bedran’a aittir veya hak sahiplerinin izniyle kullanılmaktadır. Tüm hakları saklıdır.'] },
  ],
  en: [
    { h: 'Responsible for content', p: ['Azad Bedran'] },
    { h: 'Management & booking', p: [`${manager.name} · ${manager.phone}`] },
    { h: 'Photos and music', p: ['Photos, artwork and recordings belong to Azad Bedran or are used with the rights holders’ permission. All rights reserved.'] },
  ],
  ru: [
    { h: 'Ответственный за содержание', p: ['Азад Бедран (Azad Bedran)'] },
    { h: 'Менеджмент и букинг', p: [`${manager.name} · ${manager.phone}`] },
    { h: 'Фото и музыка', p: ['Фотографии, обложки и записи принадлежат Азаду Бедрану или используются с разрешения правообладателей. Все права защищены.'] },
  ],
}

export const privacy: Record<Locale, Block[]> = {
  ku: [
    { h: 'Bi kurtî', p: ['Ev malper ti şopandin, reklam an analîtîk bikar nayne û ti daneyên kesane yên te naxwaze.'] },
    { h: 'Hosting', p: ['Malper li ser Vercel Inc. (DYA) tê weşandin. Ji bo ewlehî û xebatê, Vercel daneyên teknîkî yên wekî navnîşana IP, dem û rûpelên vekirî bi demkî tomar dike.'] },
    { h: 'Naveroka derve', p: ['Bergên albûman û pêşguhdariyên 30 çirkeyan ji serverên Apple tên barkirin; wêneyên vîdeoyan ji YouTubeê (Google). Bi vê yekê navnîşana IP ya te digihîje wan. Vîdeo bi xwe tenê piştî tikandina te bi youtube-nocookie.com tê barkirin.'] },
    { h: 'Cookie', p: ['Tenê cookieyek teknîkî tê bikaranîn heta ku malper vekirî ye (gihîştina bi şîfre). Ti cookieyên şopandinê tune ne.'] },
    { h: 'Têkilî', p: [`Ji bo pirsan: ${manager.name}, ${manager.phone}`] },
  ],
  tr: [
    { h: 'Kısaca', p: ['Bu site takip, reklam veya analiz araçları kullanmaz ve senden hiçbir kişisel veri istemez.'] },
    { h: 'Barındırma', p: ['Site Vercel Inc. (ABD) üzerinde yayınlanır. Güvenlik ve işletim için Vercel IP adresi, zaman ve açılan sayfalar gibi teknik verileri geçici olarak kaydeder.'] },
    { h: 'Harici içerikler', p: ['Albüm kapakları ve 30 saniyelik önizlemeler Apple sunucularından, video görselleri YouTube’dan (Google) yüklenir; bu sırada IP adresin bu sağlayıcılara iletilir. Videonun kendisi yalnızca tıkladığında youtube-nocookie.com üzerinden yüklenir.'] },
    { h: 'Çerezler', p: ['Site açılışına kadar yalnızca şifreli erişim için teknik bir çerez kullanılır. Takip çerezi yoktur.'] },
    { h: 'İletişim', p: [`Sorular için: ${manager.name}, ${manager.phone}`] },
  ],
  en: [
    { h: 'In short', p: ['This website uses no tracking, advertising or analytics and does not ask you for any personal data.'] },
    { h: 'Hosting', p: ['The site is hosted by Vercel Inc. (USA). For security and operation, Vercel temporarily logs technical data such as IP address, time and pages requested.'] },
    { h: 'External content', p: ['Album artwork and 30-second previews are loaded from Apple’s servers, video thumbnails from YouTube (Google); your IP address is transmitted to them in the process. A video itself only loads from youtube-nocookie.com after you click it.'] },
    { h: 'Cookies', p: ['Until launch, a single technical cookie is used for password access. There are no tracking cookies.'] },
    { h: 'Contact', p: [`For questions: ${manager.name}, ${manager.phone}`] },
  ],
  ru: [
    { h: 'Коротко', p: ['Сайт не использует отслеживание, рекламу или аналитику и не запрашивает у вас персональные данные.'] },
    { h: 'Хостинг', p: ['Сайт размещён у Vercel Inc. (США). Для безопасности и работы Vercel временно сохраняет технические данные: IP-адрес, время и открытые страницы.'] },
    { h: 'Внешний контент', p: ['Обложки и 30-секундные превью загружаются с серверов Apple, превью видео – с YouTube (Google); при этом ваш IP-адрес передаётся этим сервисам. Само видео загружается с youtube-nocookie.com только после нажатия.'] },
    { h: 'Cookie', p: ['До запуска сайта используется только один технический cookie для входа по паролю. Cookie для отслеживания нет.'] },
    { h: 'Контакт', p: [`По вопросам: ${manager.name}, ${manager.phone}`] },
  ],
}
