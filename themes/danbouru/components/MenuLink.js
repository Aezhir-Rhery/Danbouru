import SmartLink from '@/components/SmartLink'

const RSS_URL = 'https://danbouru.cat-fish.net/rss/feed.xml'

// RSS 是资源地址，需要浏览器直接请求，避免进入客户端页面路由。
const MenuLink = ({ href, children, ...props }) => {
  if (href === RSS_URL) {
    return (
      <a {...props} href={href} target='_blank' rel='noopener noreferrer'>
        {children}
      </a>
    )
  }

  return <SmartLink href={href} {...props}>{children}</SmartLink>
}

export default MenuLink
