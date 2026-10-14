/**
 * notion 的图标 icon
 * 可能是 emoji、svg 或图片
 */

const normalizeNotionIconUrl = icon => {
  if (!icon?.startsWith('http')) return icon

  const proxyHost = 'https://img.danbouru.cat-fish.net'
  const notionHost = 'https://www.notion.so'

  try {
    const url = new URL(icon)

    // 正常代理后的 Notion 官方 icon
    if (
      icon.startsWith(proxyHost) &&
      url.pathname.startsWith('/icons/')
    ) {
      return notionHost + url.pathname + url.search
    }

    // 被重复代理后的 Notion 官方 icon
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

const NotionIcon = ({ icon, className = '' }) => {
  if (!icon) {
    return null
  }

  if (icon.startsWith('http') || icon.startsWith('data:')) {
    return (
      <img
        src={normalizeNotionIconUrl(icon)}
        alt=''
        className={
          className ||
          'w-10 h-10 inline object-contain'
        }
      />
    )
  }

  return (
    <span className={`mr-1 text-4xl ${className}`}>
      {icon}
    </span>
  )
}

export default NotionIcon