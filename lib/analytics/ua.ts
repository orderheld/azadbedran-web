// Kleine User-Agent-Auswertung (Gerät, Browser, Betriebssystem), ohne externe Bibliothek

export const isBot = (ua: string) =>
  !ua || /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegrambot|preview|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|curl|wget|python|axios|node-fetch|vercel/i.test(ua)

export function parseUA(ua: string) {
  const device = /iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)
    ? 'Tablet'
    : /Mobi|iPhone|iPod|Android|Windows Phone|Opera Mini/i.test(ua)
      ? 'Handy'
      : 'Desktop'

  const os = /Windows NT/i.test(ua)
    ? 'Windows'
    : /iPhone|iPad|iPod/i.test(ua)
      ? 'iOS'
      : /Android/i.test(ua)
        ? 'Android'
        : /Mac OS X|Macintosh/i.test(ua)
          ? 'macOS'
          : /CrOS/i.test(ua)
            ? 'ChromeOS'
            : /Linux/i.test(ua)
              ? 'Linux'
              : 'Andere'

  const browser = /Instagram/i.test(ua)
    ? 'Instagram (App)'
    : /FBAN|FBAV|FB_IAB/i.test(ua)
      ? 'Facebook (App)'
      : /TikTok|musical_ly|BytedanceWebview/i.test(ua)
        ? 'TikTok (App)'
        : /SamsungBrowser/i.test(ua)
          ? 'Samsung Internet'
          : /YaBrowser/i.test(ua)
            ? 'Yandex'
            : /OPR\/|Opera/i.test(ua)
              ? 'Opera'
              : /Edg\//i.test(ua)
                ? 'Edge'
                : /Firefox|FxiOS/i.test(ua)
                  ? 'Firefox'
                  : /CriOS|Chrome\//i.test(ua)
                    ? 'Chrome'
                    : /Safari/i.test(ua)
                      ? 'Safari'
                      : 'Andere'

  return { device, os, browser }
}
