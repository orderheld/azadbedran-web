import { getDiscography } from '@/lib/music'
import { getVideos } from '@/lib/videos'

export const revalidate = 3600

// Kurzer Gesundheitscheck der Live-Datenquellen (Apple, Deezer, YouTube)
export async function GET() {
  const [releases, { videos, live }] = await Promise.all([getDiscography(), getVideos()])
  const head = (url: string) => fetch(url, { method: 'HEAD', cache: 'no-store' }).then((r) => `${r.status} ${r.headers.get('content-type')}`, (e) => `ERR ${e.message}`)
  const sample = releases.slice(0, 3)
  const checks = {
    covers: await Promise.all(sample.map((r) => head(`${r.art}/600x600bb.jpg`))),
    previews: await Promise.all(sample.map((r) => (r.songs[0]?.preview ? head(r.songs[0].preview) : 'none'))),
    thumbs: await Promise.all(videos.slice(0, 4).map((v) => head(`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`))),
    feed: await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=UCGd0Bur3OfTZibdHr_o26Zg`, { cache: 'no-store' }).then((r) => `${r.status}`, (e) => `ERR ${e.message}`),
  }
  return Response.json({
    checks,
    releases: releases.length,
    withPreview: releases.filter((r) => r.songs.some((s) => s.preview)).length,
    withDeezerLink: releases.filter((r) => r.deezerUrl).length,
    latest: releases.slice(0, 3).map((r) => ({ title: r.title, date: r.date, preview: r.songs[0]?.preview ?? null, cover: `${r.art}/600x600bb.jpg` })),
    youtubeFeed: live,
    videos: videos.map((v) => `${v.id} ${v.title}`),
  })
}
