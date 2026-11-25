import { galleryNames, homeHiddenCategories } from './gallery'

export function filterHomePosts(posts, config) {
  const hidden = new Set(homeHiddenCategories(config))
  return posts?.filter(
    post => !galleryNames(post.category).some(name => hidden.has(name))
  )
}

// Run only at the serialization boundary, after feeds and article processing.
export function compactPageData(
  props,
  { home = false, randomMenu = false } = {}
) {
  const config = props.NOTION_CONFIG || {}
  if (home) {
    props.allNavPages = filterHomePosts(props.allNavPages, config) || []
    props.posts = filterHomePosts(props.posts, config) || []
    props.latestPosts = filterHomePosts(props.latestPosts, config) || []
  } else {
    props.allNavPages =
      randomMenu === true || randomMenu === 'true'
        ? (props.allNavPages || []).map(({ slug }) => ({ slug }))
        : []
  }

  // Notion UUID links need a mapping only for pages referenced by rendered blocks.
  const content = JSON.stringify([
    props.post?.blockMap,
    props.notice?.blockMap,
    ...(props.posts || []).map(post => post.blockMap)
  ])
    .replace(/-/g, '')
    .toLowerCase()
  props.allLinkPages = (props.allLinkPages || [])
    .filter(page => {
      const id = String(page.short_id || page.id || '')
        .replace(/-/g, '')
        .toLowerCase()
      return id.length >= 8 && content.includes(id)
    })
    .map(page =>
      Object.fromEntries(
        ['id', 'short_id', 'href']
          .filter(key => page[key] !== undefined)
          .map(key => [key, page[key]])
      )
    )
  return props
}
