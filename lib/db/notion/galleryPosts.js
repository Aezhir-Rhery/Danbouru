import BLOG from '@/blog.config'
import { galleryEnabled } from '@/themes/danbouru/lib/gallery'
import { fetchNotionPageBlocks } from './getPostBlocks'
import { mapImgUrl } from './mapImage'

export function isGalleryPage(props, taxonomy) {
  return (
    (props.NOTION_CONFIG?.THEME || BLOG.THEME) === 'danbouru' &&
    galleryEnabled(props.NOTION_CONFIG, taxonomy)
  )
}

export function firstContentImage(recordMap, pageId) {
  const blocks = recordMap?.block || {}
  const read = id => {
    const entry =
      blocks[id] ||
      blocks[
        Object.keys(blocks).find(
          key => key.replace(/-/g, '') === id.replace(/-/g, '')
        )
      ]
    return entry?.value?.value || entry?.value
  }
  const visited = new Set()
  const walk = id => {
    if (visited.has(id)) return null
    visited.add(id)
    const block = read(id)
    if (!block) return null
    if (block.type === 'image') {
      const source =
        block.properties?.source?.[0]?.[0] || block.format?.display_source
      if (source) return mapImgUrl(source, block)
    }
    if (
      id !== pageId &&
      ['page', 'collection_view', 'collection_view_page'].includes(block.type)
    )
      return null
    for (const child of block.content || []) {
      const image = walk(child)
      if (image) return image
    }
    return null
  }
  return walk(pageId)
}

export async function addGalleryImages(props) {
  const posts = props.posts.map(post => ({ ...post }))
  for (let offset = 0; offset < posts.length; offset += 4) {
    await Promise.all(
      posts.slice(offset, offset + 4).map(async post => {
        post.galleryImage = ''
        if (post.password) return
        try {
          const map = await fetchNotionPageBlocks(post.id, 'gallery', {
            cacheVersion: post.lastEditedDate
          })
          post.galleryImage = firstContentImage(map, post.id) || ''
        } catch (error) {
          console.warn('[Gallery] 首图读取失败:', post.id, error.message)
        }
      })
    )
  }
  props.posts = posts
}
