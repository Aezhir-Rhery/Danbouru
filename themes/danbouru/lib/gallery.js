import CONFIG from '../config'
import { formatDateFmt } from '@/lib/utils/formatDate'

export const GALLERY_PAGE_SIZE = 24

export function paginateGalleryPosts(posts = [], page = 1) {
  const currentPage = Math.max(1, Number(page) || 1)
  return [...posts]
    .sort((a, b) => (b.publishDate || 0) - (a.publishDate || 0))
    .slice((currentPage - 1) * GALLERY_PAGE_SIZE, currentPage * GALLERY_PAGE_SIZE)
}

export function galleryNames(value) {
  if (Array.isArray(value)) {
    return [...new Set(value.filter(name => typeof name === 'string').map(name => name.trim()).filter(Boolean))]
  }
  if (typeof value !== 'string') return []
  const normalized = value.trim()
  try {
    const parsed = JSON.parse(normalized)
    if (Array.isArray(parsed)) return galleryNames(parsed)
  } catch (_) {
    // Accept common Notion text formats without evaluating configuration as code.
  }
  const list = normalized.replace(/^\s*\[/, '').replace(/\]\s*$/, '')
  return [...new Set(list.split(/[,，\n]/).map(name => name.trim().replace(/^["']|["']$/g, '').trim()).filter(Boolean))]
}

export function homeHiddenCategories(config = {}) {
  return [...new Set([
    ...galleryNames(config.DANBOURU_GALLERY_CATEGORIES ?? CONFIG.DANBOURU_GALLERY_CATEGORIES),
    ...galleryNames(config.DANBOURU_HOME_HIDDEN_CATEGORIES ?? CONFIG.DANBOURU_HOME_HIDDEN_CATEGORIES)
  ])]
}

export function galleryEnabled(config = {}, taxonomy) {
  return Boolean(
    (taxonomy.category &&
      galleryNames(
        config.DANBOURU_GALLERY_CATEGORIES ?? CONFIG.DANBOURU_GALLERY_CATEGORIES
      ).includes(taxonomy.category)) ||
    (taxonomy.tag &&
      galleryNames(
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
