import CONFIG from '../config'
import { formatDateFmt } from '@/lib/utils/formatDate'

export const GALLERY_PAGE_SIZE = 24

export function paginateGalleryPosts(posts = [], page = 1) {
  const currentPage = Math.max(1, Number(page) || 1)
  return [...posts]
    .sort((a, b) => (b.publishDate || 0) - (a.publishDate || 0))
    .slice((currentPage - 1) * GALLERY_PAGE_SIZE, currentPage * GALLERY_PAGE_SIZE)
}

export function galleryEnabled(config = {}, taxonomy) {
  const names = value =>
    Array.isArray(value)
      ? value
      : typeof value === 'string'
        ? value
            .split(/[,，\n]/)
            .map(name => name.trim())
            .filter(Boolean)
        : []
  return Boolean(
    (taxonomy.category &&
      names(
        config.DANBOURU_GALLERY_CATEGORIES ?? CONFIG.DANBOURU_GALLERY_CATEGORIES
      ).includes(taxonomy.category)) ||
    (taxonomy.tag &&
      names(
        config.DANBOURU_GALLERY_TAGS ?? CONFIG.DANBOURU_GALLERY_TAGS
      ).includes(taxonomy.tag))
  )
}

export function groupGalleryPosts(posts = []) {
  const groups = {}
  const sorted = [...posts].sort(
    (a, b) => (b.publishDate || 0) - (a.publishDate || 0)
  )
  sorted.forEach(post => {
    const month = Number.isFinite(post.publishDate)
      ? formatDateFmt(post.publishDate, 'yyyy-MM')
      : post.date?.start_date?.slice(0, 7) || '日期未定'
    if (!groups[month]) groups[month] = []
    groups[month].push(post)
  })
  return groups
}
