import React from 'react'
import { render, screen } from '@testing-library/react'
import BlogPostListAll from '@/themes/danbouru/components/BlogPostListAll'
import { useRouter } from 'next/router'

jest.mock('next/router', () => ({ useRouter: jest.fn() }))
jest.mock('@/themes/danbouru', () => ({
  useNavGlobal: () => ({ filteredNavPages: [
    { id: 'art', title: 'new gallery article', category: '哆一嘴一脸血' },
    { id: 'normal', title: 'normal article', category: '纸团' }
  ] })
}))
jest.mock('@/lib/config', () => ({
  siteConfig: (key, fallback, config = {}) => key === 'NAV_AUTO_SORT' ? 'true' : config[key] ?? fallback
}))
jest.mock('@/themes/danbouru/components/BlogPostItem', () => ({ group }) => <div>{group.items.map(p => <span key={p.id}>{p.title}</span>)}</div>)
jest.mock('@/themes/danbouru/components/BlogPostListEmpty', () => () => <div>empty</div>)

const props = { NOTION_CONFIG: { DANBOURU_GALLERY_CATEGORIES: '["哆一嘴一脸血"]', DANBOURU_HOME_HIDDEN_CATEGORIES: [] } }
test('new Notion gallery categories hide on the homepage', () => {
  useRouter.mockReturnValue({ pathname: '/' })
  render(<BlogPostListAll {...props} />)
  expect(screen.queryByText('new gallery article')).not.toBeInTheDocument()
  expect(screen.getByText('normal article')).toBeInTheDocument()
})
test('homepage hiding does not remove the same article from other lists', () => {
  useRouter.mockReturnValue({ pathname: '/category/[category]' })
  render(<BlogPostListAll {...props} />)
  expect(screen.getByText('new gallery article')).toBeInTheDocument()
})
