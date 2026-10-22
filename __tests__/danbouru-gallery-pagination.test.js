import { getStaticProps as categoryFirst } from '@/pages/category/[category]'
import { getStaticProps as categoryNext, getStaticPaths as categoryPaths } from '@/pages/category/[category]/page/[page]'
import { getStaticProps as tagFirst } from '@/pages/tag/[tag]'
import { getStaticProps as tagNext, getStaticPaths as tagPaths } from '@/pages/tag/[tag]/page/[page]'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'

jest.mock('@/lib/db/SiteDataApi', () => ({ fetchGlobalAllData: jest.fn() }))
jest.mock('@/themes/theme', () => ({ DynamicLayout: () => null }))
jest.mock('@/lib/config', () => ({ siteConfig: (key, fallback) => fallback }))

const category = 'この行為は禁じられています'
const config = { THEME: 'danbouru', DANBOURU_GALLERY_TAGS: ['art'] }
beforeEach(() => {
  fetchGlobalAllData.mockImplementation(async () => ({
    NOTION_CONFIG: config,
    categoryOptions: [{ name: category }], tagOptions: [{ name: 'art' }],
    allPages: Array.from({ length: 49 }, (_, i) => ({
      id: String(i), publishDate: i, type: 'Post', status: 'Published',
      category, tags: ['art'], pageCover: `${i}.jpg`
    }))
  }))
})

test.each([
  ['category', categoryFirst, categoryNext, { category }],
  ['tag', tagFirst, tagNext, { tag: 'art' }]
])('%s gallery returns distinct pages of 24 and preserves the full count', async (_, first, next, params) => {
  const results = await Promise.all([
    first({ params, locale: 'zh-CN' }),
    next({ params: { ...params, page: '2' }, locale: 'zh-CN' }),
    next({ params: { ...params, page: '3' }, locale: 'zh-CN' })
  ])
  expect(results.map(r => r.props.posts.length)).toEqual([24, 24, 1])
  expect(results.every(r => r.props.postCount === 49 && r.props.galleryMode)).toBe(true)
  expect(new Set(results.flatMap(r => r.props.posts.map(p => p.id))).size).toBe(49)
  expect(results[0].props.posts[0].galleryImage).toBe('48.jpg')
})

test('builds category and tag routes using 24 articles per gallery page', async () => {
  expect((await categoryPaths()).paths).toHaveLength(3)
  expect((await tagPaths()).paths).toHaveLength(3)
})
