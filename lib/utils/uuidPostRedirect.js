// Only canonicalize known, published catalog entries after access resolution.
export function uuidPostRedirect(post, segments) {
  const uuid = segments.at(-1)
  if (!/^(?:[a-f0-9]{32}|[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})$/i.test(uuid || '')) return null
  if (!post || post.status !== 'Published' || !['Post', 'Page'].includes(post.type)) return null
  if (String(post.id).replace(/-/g, '').toLowerCase() !== uuid.replace(/-/g, '').toLowerCase()) return null
  const destination = post.href
  if (!post.slug || typeof destination !== 'string' || !destination.startsWith('/') || destination.startsWith('//') || /[\\?#\s]/.test(destination)) return null
  if (destination === '/' + segments.join('/')) return null
  return { redirect: { destination, permanent: true } }
}