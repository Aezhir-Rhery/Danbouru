import { uuidPostRedirect } from '@/lib/utils/uuidPostRedirect'
const id = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
const uuid = id.replace(/-/g, '')
const post = { id, type: 'Post', status: 'Published', slug: 'article/test', href: '/article/test' }
it.each([[uuid], ['p', uuid], ['p', id], ['other', 'nested', uuid]])('redirects UUID alias %j', (...segments) => {
  expect(uuidPostRedirect(post, segments)).toEqual({ redirect: { destination: '/article/test', permanent: true } })
})
it('keeps password protection on the destination route', () => {
  expect(uuidPostRedirect({ ...post, password: 'protected' }, ['p', uuid]).redirect.destination).toBe('/article/test')
})
it.each([null, { ...post, status: 'Draft' }, { ...post, type: 'Menu' }, { ...post, id: 'other' }, { ...post, slug: '' }, { ...post, href: '//external.test' }, { ...post, href: '/bad\\path' }, { ...post, href: '/bad?query=1' }])('does not redirect an invalid or unpublished target %j', target => {
  expect(uuidPostRedirect(target, [uuid])).toBeNull()
})
it('does not redirect normal slugs or loop on UUID canonical paths', () => {
  expect(uuidPostRedirect(post, ['article', 'test'])).toBeNull()
  expect(uuidPostRedirect({ ...post, slug: uuid, href: '/' + uuid }, [uuid])).toBeNull()
})
it('preserves the configured html destination', () => {
  expect(uuidPostRedirect({ ...post, href: '/article/test.html' }, [uuid]).redirect.destination).toBe('/article/test.html')
})