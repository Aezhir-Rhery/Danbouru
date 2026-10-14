// 统一引入notion官方图标URL的处理函数，避免重复代码
import { normalizeNotionIconUrl } from '../lib/normalizeNotionIconUrl'

/**
 * notion 的图标 icon
 * 可能是 emoji、svg 或图片
 */
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