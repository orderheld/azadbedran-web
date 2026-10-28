import type { Locale } from './i18n'

export const pages = ['news', 'music', 'videos', 'bio', 'gallery', 'concerts', 'contact'] as const
export type PageKey = (typeof pages)[number]

const slugs: Record<PageKey, string> = {
  news: 'news',
  music: 'music',
  videos: 'videos',
  bio: 'biography',
  gallery: 'gallery',
  concerts: 'concerts',
  contact: 'contact',
}

export const href = (lang: Locale, page?: PageKey) => (page ? `/${lang}/${slugs[page]}` : `/${lang}`)
