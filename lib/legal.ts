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
    { h: 'Bi kurtî', p: ['Ev malper reklam an şopandina ji aliyê partiyên sêyem ve bikar nayne û ti daneyên kesane yên te naxwaze. Ji bo statîstîka ziyaretvanan amûreke me ya xwe heye, bê cookie û bê tomarkirina navnîşana IP.'] },
    { h: 'Hosting', p: ['Malper li ser Vercel Inc. (DYA) tê weşandin. Ji bo ewlehî û xebatê, Vercel daneyên teknîkî yên wekî navnîşana IP, dem û rûpelên vekirî bi demkî tomar dike.'] },
    { h: 'Statîstîka ziyaretvanan', p: ['Ji bo ku em bizanin kîjan rûpel û girêdan têne bikaranîn, em daneyên teknîkî yên anonîm tomar dikin: rûpela vekirî, girêdanên ku tên tikandin, malpera ku tu jê hatî, welat û bajar (ji navnîşana IP tê derxistin, lê navnîşana IP nayê tomarkirin), cureyê cîhazê, gerok û pergala xebitandinê. Ji bo jimartinê kodeke anonîm tê bikaranîn ku her roj diguhere û nikare vegere ser kesekî. Ti cookie nayên danîn û dane ji partiyên sêyem re nayên dayîn. Dane li Neon (serverên YE) têne hilanîn û piştî herî zêde 25 mehan têne jêbirin.'] },
    { h: 'Naveroka derve', p: ['Bergên albûman û pêşguhdariyên 30 çirkeyan ji serverên Apple tên barkirin; wêneyên vîdeoyan ji YouTubeê (Google). Bi vê yekê navnîşana IP ya te digihîje wan. Vîdeo bi xwe tenê piştî tikandina te bi youtube-nocookie.com tê barkirin.'] },
    { h: 'Cookie', p: ['Tenê cookieyek teknîkî tê bikaranîn heta ku malper vekirî ye (gihîştina bi şîfre). Ti cookieyên şopandinê tune ne.'] },
    { h: 'Têkilî', p: [`Ji bo pirsan: ${manager.name}, ${manager.phone}`] },
  ],
  tr: [
    { h: 'Kısaca', p: ['Bu site reklam veya üçüncü taraf takip araçları kullanmaz ve senden hiçbir kişisel veri istemez. Ziyaretçi istatistiği için çerezsiz ve IP adresi kaydetmeyen kendi aracımızı kullanıyoruz.'] },
    { h: 'Barındırma', p: ['Site Vercel Inc. (ABD) üzerinde yayınlanır. Güvenlik ve işletim için Vercel IP adresi, zaman ve açılan sayfalar gibi teknik verileri geçici olarak kaydeder.'] },
    { h: 'Ziyaretçi istatistiği', p: ['Hangi sayfaların ve bağlantıların kullanıldığını görmek için anonim teknik veriler kaydediyoruz: açılan sayfa, tıklanan bağlantılar, geldiğin site, ülke ve şehir (IP adresinden çıkarılır, IP adresi kaydedilmez), cihaz türü, tarayıcı ve işletim sistemi. Sayım için her gün değişen ve kişiye geri götürülemeyen anonim bir kod kullanılır. Çerez kullanılmaz, veriler üçüncü taraflarla paylaşılmaz. Veriler Neon’da (AB sunucuları) saklanır ve en geç 25 ay sonra silinir.'] },
    { h: 'Harici içerikler', p: ['Albüm kapakları ve 30 saniyelik önizlemeler Apple sunucularından, video görselleri YouTube’dan (Google) yüklenir; bu sırada IP adresin bu sağlayıcılara iletilir. Videonun kendisi yalnızca tıkladığında youtube-nocookie.com üzerinden yüklenir.'] },
    { h: 'Çerezler', p: ['Site açılışına kadar yalnızca şifreli erişim için teknik bir çerez kullanılır. Takip çerezi yoktur.'] },
    { h: 'İletişim', p: [`Sorular için: ${manager.name}, ${manager.phone}`] },
  ],
  en: [
    { h: 'In short', p: ['This website uses no advertising or third-party tracking and does not ask you for any personal data. For visitor statistics we use our own cookie-free tool that does not store IP addresses.'] },
    { h: 'Hosting', p: ['The site is hosted by Vercel Inc. (USA). For security and operation, Vercel temporarily logs technical data such as IP address, time and pages requested.'] },
    { h: 'Visitor statistics', p: ['To see which pages and links are used, we record anonymous technical data: the page opened, links clicked, the site you came from, country and city (derived from your IP address, which is not stored), device type, browser and operating system. Visitors are counted with an anonymous code that changes every day and cannot be traced back to a person. No cookies are set and no data is shared with third parties. The data is stored with Neon (EU servers) and deleted after 25 months at the latest.'] },
    { h: 'External content', p: ['Album artwork and 30-second previews are loaded from Apple’s servers, video thumbnails from YouTube (Google); your IP address is transmitted to them in the process. A video itself only loads from youtube-nocookie.com after you click it.'] },
    { h: 'Cookies', p: ['Until launch, a single technical cookie is used for password access. There are no tracking cookies.'] },
    { h: 'Contact', p: [`For questions: ${manager.name}, ${manager.phone}`] },
  ],
  ru: [
    { h: 'Коротко', p: ['Сайт не использует рекламу и сторонние системы отслеживания и не запрашивает у вас персональные данные. Для статистики посещений мы используем собственный инструмент без cookie и без сохранения IP-адресов.'] },
    { h: 'Хостинг', p: ['Сайт размещён у Vercel Inc. (США). Для безопасности и работы Vercel временно сохраняет технические данные: IP-адрес, время и открытые страницы.'] },
    { h: 'Статистика посещений', p: ['Чтобы понимать, какие страницы и ссылки используются, мы сохраняем анонимные технические данные: открытую страницу, нажатые ссылки, сайт, с которого вы пришли, страну и город (определяются по IP-адресу, сам IP-адрес не сохраняется), тип устройства, браузер и операционную систему. Для подсчёта используется анонимный код, который меняется каждый день и не позволяет установить личность. Cookie не устанавливаются, данные не передаются третьим лицам. Данные хранятся у Neon (серверы в ЕС) и удаляются не позднее чем через 25 месяцев.'] },
    { h: 'Внешний контент', p: ['Обложки и 30-секундные превью загружаются с серверов Apple, превью видео – с YouTube (Google); при этом ваш IP-адрес передаётся этим сервисам. Само видео загружается с youtube-nocookie.com только после нажатия.'] },
    { h: 'Cookie', p: ['До запуска сайта используется только один технический cookie для входа по паролю. Cookie для отслеживания нет.'] },
    { h: 'Контакт', p: [`По вопросам: ${manager.name}, ${manager.phone}`] },
  ],
}
