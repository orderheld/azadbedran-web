import { getDiscography } from '@/lib/music'
import { getVideos } from '@/lib/videos'

export const revalidate = 3600

// Kurzer Gesundheitscheck der Live-Datenquellen (Apple, Deezer, YouTube)
export async function GET() {
  const [releases, { videos, live }] = await Promise.all([getDiscography(), getVideos()])
  return Response.json({
    releases: releases.length,
    withPreview: releases.filter((r) => r.songs.some((s) => s.preview)).length,
    withDeezerLink: releases.filter((r) => r.deezerUrl).length,
    latest: releases.slice(0, 3).map((r) => ({ title: r.title, date: r.date, preview: r.songs[0]?.preview ?? null, cover: `${r.art}/600x600bb.jpg` })),
    youtubeFeed: live,
    videos: videos.map((v) => `${v.id} ${v.title}`),
  })
}
