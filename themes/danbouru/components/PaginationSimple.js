import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

/**
 * 简易翻页插件
 * @param page 当前页码
 * @param totalPage 是否有下一页
 * @returns {JSX.Element}
 * @constructor
 */
const PaginationSimple = ({ page = 1, totalPage }) => {
  const router = useRouter()
  const currentPage = +page
  const showNext = currentPage < totalPage
  const pagePrefix = router.asPath.replace(/\/page\/[1-9]\d*/, '').replace(/\/$/, '')

  return (
    <nav className='danbouru-pagination' aria-label='分页'>
      {currentPage > 1 && <SmartLink
        href={{
          pathname:
            currentPage === 2
              ? `${pagePrefix}/`
              : `${pagePrefix}/page/${currentPage - 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
        passHref
        rel="prev"
        className='danbouru-pagination-link'>
        <i className='fa-solid fa-circle-chevron-right danbouru-pagination-icon danbouru-pagination-prev' aria-hidden='true' />
        <span>PREV</span>
      </SmartLink>}
      {showNext && <SmartLink
        href={{
          pathname: `${pagePrefix}/page/${currentPage + 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
        passHref
        rel="next"
        className='danbouru-pagination-link danbouru-pagination-next'>
        <i className='fa-solid fa-circle-chevron-right danbouru-pagination-icon' aria-hidden='true' />
        <span>NEXT</span>
      </SmartLink>}
    </nav>
  )
}

export default PaginationSimple
