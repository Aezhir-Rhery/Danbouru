import {
  galleryEnabled,
  groupGalleryPosts,
  paginateGalleryPosts,
  galleryNames,
  homeHiddenCategories
} from '@/themes/danbouru/lib/gallery'
import {
  addGalleryImages,
  firstContentImage,
  isGalleryPage
} from '@/lib/db/notion/galleryPosts'
import { fetchNotionPageBlocks } from '@/lib/db/notion/getPostBlocks'

import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import BlogGallery from '@/themes/danbouru/components/BlogGallery'

jest.mock('@/components/SmartLink', () => {
  return function MockLink({ children, ...props }) {
    return <a {...props}>{children}</a>
  }
})

jest.mock('@/lib/db/notion/getPostBlocks', () => ({
  fetchNotionPageBlocks: jest.fn()
}))
jest.mock('@/lib/db/notion/mapImage', () => ({
  mapImgUrl: (url, block) => url + '?block=' + block.id
}))

const image = (id, url) => ({
  value: { id, type: 'image', properties: { source: [[url]] } }
})
const recordMap = {
  block: {
    root: { value: { type: 'page', content: ['column', 'later'] } },
    later: image('later', 'later.png'),
    column: { value: { value: { type: 'column', content: ['first'] } } },
    first: image('first', 'first.png')
  }
}

beforeEach(() => jest.clearAllMocks())

test('parses standard JSON arrays and supported text list formats', () => {
  expect(galleryNames('["同人","涂鸦","截图","漫画"]')).toEqual(['同人','涂鸦','截图','漫画'])
  expect(galleryNames('[\'同人\',\'漫画\']')).toEqual(['同人','漫画'])
  expect(galleryNames('同人，漫画\n漫画')).toEqual(['同人','漫画'])
  expect(galleryNames('[]')).toEqual([])
  expect(galleryEnabled({DANBOURU_GALLERY_TAGS:'["同人","涂鸦","截图","漫画"]'}, {tag:'漫画'})).toBe(true)
})

test('gallery categories automatically hide at home while extra hidden categories remain supported', () => {
  const config = {DANBOURU_GALLERY_CATEGORIES:'["この行為は禁じられています","哆一嘴一脸血"]',DANBOURU_HOME_HIDDEN_CATEGORIES:['其他分类']}
  expect(homeHiddenCategories(config)).toEqual(['この行為は禁じられています','哆一嘴一脸血','其他分类'])
  expect(galleryEnabled(config,{category:'哆一嘴一脸血'})).toBe(true)
  expect(galleryEnabled(config,{category:'其他分类'})).toBe(false)
  expect(homeHiddenCategories({DANBOURU_GALLERY_CATEGORIES:[],DANBOURU_HOME_HIDDEN_CATEGORIES:[]})).toEqual([])
})

test('renders dates and summaries while preserving accessible titles and links', () => {
  render(
    <BlogGallery
      posts={[
        {
          id: 'visible',
          title: 'Hidden article title',
          href: '/article/example',
          publishDate: new Date(2026, 1, 1).getTime(),
          publishDay: '2026-2-1',
          summary: 'Article summary',
          galleryImage: 'first.png'
        }
      ]}
    />
  )
  expect(screen.getByRole('heading', { name: '2026-02' })).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: 'Hidden article title' })
  ).toHaveAttribute('href', '/article/example')
  expect(screen.queryByText('Hidden article title')).not.toBeInTheDocument()
  expect(screen.getByText('2026-2-1')).toBeInTheDocument()
  expect(screen.getByText('Article summary')).toBeInTheDocument()
})

test('replaces a failed image with the no-image card', () => {
  const { container } = render(
    <BlogGallery
      posts={[
        {
          id: 'broken',
          title: 'Broken image',
          href: '/article/broken',
          publishDate: new Date(2026, 1, 1).getTime(),
          galleryImage: 'missing.png'
        }
      ]}
    />
  )
  fireEvent.error(container.querySelector('img'))
  expect(screen.getByText('暂无图片')).toBeInTheDocument()
  expect(container.querySelector('img')).toBeNull()
})

test('matches category and tag names exactly and supports clearing defaults', () => {
  expect(galleryEnabled({}, { category: 'この行為は禁じられています' })).toBe(
    true
  )
  expect(
    galleryEnabled(
      { DANBOURU_GALLERY_CATEGORIES: [] },
      {
        category: 'この行為は禁じられています'
      }
    )
  ).toBe(false)
  expect(
    galleryEnabled({ DANBOURU_GALLERY_TAGS: ['art'] }, { tag: 'art' })
  ).toBe(true)
  expect(
    galleryEnabled({ DANBOURU_GALLERY_TAGS: ['art'] }, { tag: 'artist' })
  ).toBe(false)
  expect(
    galleryEnabled(
      { DANBOURU_GALLERY_TAGS: 'art，photo\nbook' },
      { tag: 'book' }
    )
  ).toBe(true)
  expect(
    isGalleryPage(
      { NOTION_CONFIG: { THEME: 'hexo' } },
      {
        category: 'この行為は禁じられています'
      }
    )
  ).toBe(false)
})

test('groups newest first using publish dates without mutating input', () => {
  const posts = [
    { id: 'old', publishDate: new Date(2025, 0, 1).getTime() },
    { id: 'new', publishDate: new Date(2026, 1, 1).getTime() },
    { id: 'middle', publishDate: new Date(2026, 0, 1).getTime() }
  ]
  expect(Object.keys(groupGalleryPosts(posts))).toEqual([
    '2026-02',
    '2026-01',
    '2025-01'
  ])
  expect(posts.map(post => post.id)).toEqual(['old', 'new', 'middle'])
})

test('finds the first nested image in content order rather than record insertion order', () => {
  expect(firstContentImage(recordMap, 'root')).toBe('first.png?block=first')
  expect(firstContentImage({}, 'root')).toBeNull()
})

test('does not traverse linked subpages and tolerates cycles', () => {
  const blocks = {
    root: { value: { type: 'page', content: ['child', 'cycle', 'later'] } },
    child: { value: { type: 'page', content: ['first'] } },
    cycle: { value: { type: 'column', content: ['cycle'] } },
    first: image('first', 'private.png'),
    later: image('later', 'public.png')
  }
  expect(firstContentImage({ block: blocks }, 'root')).toBe(
    'public.png?block=later'
  )
})

test('uses catalog covers without fetching any article bodies and skips protected covers', async () => {
  const original = [
    { id: 'root', pageCoverThumbnail: 'thumb.jpg', pageCover: 'cover.jpg' },
    { id: 'locked', password: 'hash', pageCover: 'private.jpg' },
    { id: 'cover-only', pageCover: 'full.jpg' },
    { id: 'icon-only', pageIcon: '🌻' }
  ]
  const props = { posts: original }
  await addGalleryImages(props)
  expect(fetchNotionPageBlocks).not.toHaveBeenCalled()
  expect(props.posts.map(post => post.galleryImage)).toEqual([
    'thumb.jpg',
    '',
    'full.jpg',
    ''
  ])
  expect(original[0]).not.toHaveProperty('galleryImage')
})

test('uses image icons and emoji when covers are absent or fail', () => {
  const { container } = render(<BlogGallery posts={[
    { id: 'emoji', href: '/emoji', title: 'Emoji', pageIcon: '🌻' },
    { id: 'image-icon', href: '/icon', title: 'Image icon', pageIcon: 'https://www.notion.so/icons/sun_yellow.svg', galleryImage: 'broken.jpg' }
  ]} />)
  expect(screen.getByText('🌻')).toBeInTheDocument()
  fireEvent.error(container.querySelector('img'))
  expect(container.querySelector('img')).toHaveAttribute('src', 'https://www.notion.so/icons/sun_yellow.svg')
  expect(screen.queryByText('暂无图片')).not.toBeInTheDocument()
})

test('paginates before rendering in publish order without gaps or duplicate articles', () => {
  const posts = Array.from({ length: 49 }, (_, i) => ({ id: String(i), publishDate: i }))
  const pages = [1, 2, 3].map(page => paginateGalleryPosts(posts, page))
  expect(pages.map(page => page.length)).toEqual([24, 24, 1])
  expect(pages.flat().map(post => post.id)).toEqual([...posts].reverse().map(post => post.id))
  expect(posts[0].id).toBe('0')
})

test('marks cropped long images and shows only known multi-image counts', () => {
  const { container } = render(<BlogGallery posts={[
    { id: 'long', title: 'Long', href: '/long', galleryImage: 'long.jpg', ext: { galleryImageCount: 12 } },
    { id: 'single', title: 'Single', href: '/single', galleryImage: 'single.jpg', ext: { galleryImageCount: 1 } },
    { id: 'unknown', title: 'Unknown', href: '/unknown' }
  ]} />)
  const image = container.querySelector('img')
  Object.defineProperties(image, { naturalWidth: { value: 200 }, naturalHeight: { value: 1600 } })
  fireEvent.load(image)
  expect(image).toHaveClass('is-long')
  expect(screen.queryByText('长图')).not.toBeInTheDocument()
  expect(container.querySelector('.danbouru-gallery-crop-fade')).toHaveAttribute('aria-hidden', 'true')
  expect(screen.getByLabelText('共 12 张图片')).toHaveTextContent('12')
  expect(container.querySelectorAll('.danbouru-gallery-count')).toHaveLength(1)
  fireEvent.error(image)
  expect(screen.queryByText('长图')).not.toBeInTheDocument()
  expect(container.querySelector('.danbouru-gallery-crop-fade')).toBeNull()
})
