import {
  compactPageData,
  filterHomePosts
} from '@/themes/danbouru/lib/pageData'

const hidden = { title: 'hidden', category: '图库', slug: 'article/hidden' }
const visible = { title: 'visible', category: '日记', slug: 'article/visible' }
const config = {
  DANBOURU_GALLERY_CATEGORIES: ['图库'],
  DANBOURU_HOME_HIDDEN_CATEGORIES: []
}

test('filters hidden home posts before pagination without changing the catalog', () => {
  const catalog = [hidden, visible]
  expect(filterHomePosts(catalog, config).slice(0, 1)).toEqual([visible])
  expect(catalog).toEqual([hidden, visible])
  const props = {
    NOTION_CONFIG: config,
    posts: catalog,
    allNavPages: catalog,
    latestPosts: catalog,
    allLinkPages: []
  }
  compactPageData(props, { home: true })
  for (const key of ['posts', 'allNavPages', 'latestPosts'])
    expect(props[key]).toEqual([visible])
  expect(JSON.stringify(props)).not.toContain('article/hidden')
})

test('keeps only referenced UUID links from the article, previews and notice', () => {
  const articleId = '12345678-1234-4321-abcd-123456789abc'
  const noticeId = '87654321-4321-1234-abcd-987654321abc'
  const props = {
    post: {
      blockMap: { link: `/${articleId.replace(/-/g, '')}` },
      title: 'body'
    },
    notice: { blockMap: { link: noticeId } },
    allNavPages: [hidden, visible],
    allLinkPages: [
      {
        short_id: '4321-abcd-123456789abc',
        href: '/linked',
        title: 'unnecessary'
      },
      { id: noticeId, short_id: '1234-abcd-987654321abc', href: '/notice' },
      { short_id: '9999-abcd-000000000000', href: '/unrelated' }
    ],
    prev: visible,
    next: hidden,
    recommendPosts: [visible]
  }
  const post = props.post
  compactPageData(props)
  expect(props.allNavPages).toEqual([])
  expect(props.allLinkPages.map(p => p.href)).toEqual(['/linked', '/notice'])
  expect(props.allLinkPages[0]).not.toHaveProperty('title')
  expect(props.post).toBe(post)
  expect(props.prev).toBe(visible)
  expect(props.next).toBe(hidden)
  expect(props.recommendPosts).toEqual([visible])
})

test('preserves a minimal random-post list only when explicitly enabled', () => {
  const props = { allNavPages: [hidden, visible] }
  compactPageData(props, { randomMenu: true })
  expect(props.allNavPages).toEqual([
    { slug: hidden.slug },
    { slug: visible.slug }
  ])
})
