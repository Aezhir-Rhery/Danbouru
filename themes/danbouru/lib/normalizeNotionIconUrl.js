/**
 * 修正 Notion 官方公共 icon URL。
 *
 * NEXT_PUBLIC_NOTION_HOST 使用自定义图片代理后，
 * upstream 可能把已经代理过的 /icons/ URL 再次包进 /image/。
 *
 * 这里统一把 Notion 官方公共 icons 恢复到：
 * https://www.notion.so/icons/...
 */
export const normalizeNotionIconUrl = icon => {
  if (!icon || typeof icon !== 'string') return icon
  if (!icon.startsWith('http')) return icon

  const proxyHost = 'https://img.danbouru.cat-fish.net'
  const notionHost = 'https://www.notion.so'

  try {
    const url = new URL(icon)

    // 情况 1：
    // https://img.danbouru.cat-fish.net/icons/xxx.svg
    if (
      icon.startsWith(proxyHost) &&
      url.pathname.startsWith('/icons/')
    ) {
      return notionHost + url.pathname + url.search
    }

    // 情况 2：
    // https://img.danbouru.cat-fish.net/image/
    // https%3A%2F%2Fimg.danbouru.cat-fish.net%2Ficons%2Fxxx.svg
    if (
      icon.startsWith(proxyHost) &&
      url.pathname.startsWith('/image/')
    ) {
      const encodedUrl = url.pathname.slice('/image/'.length)
      const decodedUrl = decodeURIComponent(encodedUrl)

      if (decodedUrl.startsWith(proxyHost + '/icons/')) {
        const innerUrl = new URL(decodedUrl)
        const t = url.searchParams.get('t')

        return (
          notionHost +
          innerUrl.pathname +
          (t ? `?t=${t}` : '')
        )
      }
    }
  } catch (error) {
    console.warn(
      '[Danbouru] Failed to normalize Notion icon:',
      icon
    )
  }

  return icon
}