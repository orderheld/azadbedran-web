import type { Locale } from './i18n'

export const pages = ['music', 'concerts', 'videos', 'bio', 'gallery', 'news', 'contact'] as const
export type PageKey = (typeof pages)[number]

const slugs: Record<PageKey, string> = {
  music: 'music',
  concerts: 'concerts',
  videos: 'videos',
  bio: 'biography',
  gallery: 'gallery',
  news: 'news',
  contact: 'contact',
}

export const href = (lang: Locale, page?: PageKey) => (page ? `/${lang}/${slugs[page]}` : `/${lang}`)
