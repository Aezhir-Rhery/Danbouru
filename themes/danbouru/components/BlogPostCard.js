import { siteConfig } from '@/lib/config'
import { isHttpLink } from '@/lib/utils'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import NotionIcon from './NotionIcon'

/**
 * 博客卡牌
 * @param {*} param0
 * @returns
 */
const BlogPostCard = ({ post, className }) => {
  const router = useRouter()
  const currentSelected = router.asPath.split('?')[0] === '/' + post.slug
  let pageIcon =
    post.pageIcon || siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')

  if (pageIcon?.includes('amazonaws.com')) {
    pageIcon += '&width=88'
  }
const getPageIconUrl = icon => {
  if (!icon || typeof icon !== 'string') return icon

  const proxyHost = 'https://img.danbouru.cat-fish.net'
  const notionHost = 'https://www.notion.so'

  try {
    const url = new URL(icon)

    // 正常的 Notion 官方 icon
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
      '[Danbouru] Failed to normalize page icon:',
      icon
    )
  }

  return icon
}

const pageIconUrl = getPageIconUrl(pageIcon)

const pageIconIsImage =
  typeof pageIconUrl === 'string' &&
  (
    pageIconUrl.startsWith('http://') ||
    pageIconUrl.startsWith('https://') ||
    pageIconUrl.startsWith('data:image/')
  )
  /*GPT说有bug，修了
  let pageIcon =
    post.pageIcon !== ''
      ? post.pageIcon
      : siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')
  pageIcon =
    post.pageIcon.indexOf('amazonaws.com') !== -1
      ? post.pageIcon + '&width=88'
      : post.pageIcon*/
  return (
    <SmartLink
      href={post?.href}
      target={isHttpLink(post.slug) ? '_blank' : '_self'}
      passHref>
      <div
        key={post.id}
        className={`${className} h-full rounded-2xl p-4 dark:bg-neutral-800 cursor-pointer bg-white hover:bg-white dark:hover:bg-gray-800 ${currentSelected ? 'bg-green-50 text-green-500' : ''}`}>
        <div className='stack-entry w-full flex space-x-3 select-none dark:text-neutral-200'>
          {siteConfig('POST_TITLE_ICON') && (
            pageIconIsImage ? (
              <img
                src={pageIconUrl}
                alt=''
                width='44'
                height='44'
                loading='lazy'
                decoding='async'
                className='w-11 h-11 mx-1 my-0 flex-none object-contain'
              />
            ) : (
              <NotionIcon
                icon={pageIconUrl}
                size='10'
                className='text-6xl w-11 h-11 mx-1 my-0 flex-none'
              />
            )
          )}
          <div className='stack-comment flex-auto'>
            <p className='title font-bold'>{post.title}</p>
            <p className='description font-normal'>
              {post.summary ? post.summary : '暂无简介'}
            </p>
          </div>
        </div>
      </div>
    </SmartLink>
  )
}

export default BlogPostCard
