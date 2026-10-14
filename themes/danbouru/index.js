'use client'

/**
 * # Danbouru纸箱 主题说明
 * 主题开发者 [emengweb](https://github.com/emengweb)
 * 魔改者 [猫鱼](https://cat-fish.net)
 * 开启方式 在blog.config.js 将主题配置为 `danbouru`
 */

import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import { ArticleLock } from './components/ArticleLock'
import CONFIG from './config'
import { Style } from './style'
// 统一解决notion官方图标URL被代理两次的问题
import { normalizeNotionIconUrl } from './lib/normalizeNotionIconUrl'
// import DanbouruLive2D from '@/components/Live2DWidget'
/* 某次NotionNext更新后图标的URL发生了变化，导致原来的处理逻辑失效。
为了确保图标能够正确显示，需要对获取标题图标的URL进行更严格的处理。以下是更新后的代码：
const getTitleIconUrl = icon => {
  if (!icon?.startsWith('http')) return icon

  // Notion 官方公共图标：保持原域名
  if (icon.includes('/icons/')) {
    return icon.replace(
      'https://img.danbouru.cat-fish.net',
      'https://www.notion.so'
    )
  }

  return icon
}
  */


const WWAds = dynamic(() => import('@/components/WWAds'), { ssr: false })
const AdSlot = dynamic(() => import('@/components/GoogleAdsense').then(mod => mod.AdSlot), {
  ssr: false
})
const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
// const Live2D = dynamic(() => import('@/components/Live2D'), { ssr: false })
const Live2D = dynamic(() => import('./components/Live2DWidget'), {
  ssr: false
})
const NotionPage = dynamic(() => import('@/components/NotionPage'), {
  ssr: true
})
const Announcement = dynamic(() => import('./components/Announcement'), { ssr: true })
const BlogArchiveItem = dynamic(() => import('./components/BlogArchiveItem'), {
  ssr: true
})
const BlogPostCard = dynamic(() => import('./components/BlogPostCard'), {
  ssr: true
})
const BlogPostListAll = dynamic(() => import('./components/BlogPostListAll'), {
  ssr: true
})
const CategoryItem = dynamic(() => import('./components/CategoryItem'), {
  ssr: true
})
const FloatButtonCatalog = dynamic(
  () => import('./components/FloatButtonCatalog'),
  { ssr: true }
)
const Footer = dynamic(() => import('./components/Footer'), { ssr: false })
const JumpToTopButton = dynamic(() => import('./components/JumpToTopButton'), {
  ssr: false
})
const LogoBar = dynamic(() => import('./components/LogoBar'), { ssr: true })
const MenuItem = dynamic(() => import('./components/MenuItem').then(mod => mod.MenuItem), {
  ssr: true
})
const PageNavDrawer = dynamic(() => import('./components/PageNavDrawer'), { ssr: true })
const TagItemMini = dynamic(() => import('./components/TagItemMini'), {
  ssr: true
})
const TocDrawer = dynamic(() => import('./components/TocDrawer'), { ssr: true })
const TopNavBar = dynamic(() => import('./components/TopNavBar'), { ssr: true })

// 主题全局变量
const ThemeGlobalNav = createContext()
export const useNavGlobal = () => useContext(ThemeGlobalNav)

/**
 * 基础布局
 * 采用左右两侧布局，移动端使用顶部导航栏
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const {
    customMenu,
    children,
    post,
    allNavPages,
    categoryOptions,
    slotLeft,
    slotTop
  } = props
  const { onLoading } = useGlobal()
  const [tocVisible, changeTocVisible] = useState(false)
  const [pageNavVisible, changePageNavVisible] = useState(false)
  const [filteredNavPages, setFilteredNavPages] = useState(allNavPages)

  const showTocButton = post?.toc?.length > 1

  useEffect(() => {
    setFilteredNavPages(allNavPages)
  }, [post])

  let links = customMenu

  // 默认使用自定义菜单，否则将遍历所有的category生成菜单
  if (!siteConfig('NAV_USE_CUSTOM_MENU', null, CONFIG)) {
    links =
      categoryOptions &&
      categoryOptions?.map(c => {
        return {
          id: c.name,
          title: `# ${c.name}`,
          href: `/category/${c.name}`,
          show: true
        }
      })
  }

  return (
    <ThemeGlobalNav.Provider
      value={{
        tocVisible,
        changeTocVisible,
        filteredNavPages,
        setFilteredNavPages,
        allNavPages,
        pageNavVisible,
        changePageNavVisible,
        categoryOptions
      }}>
      {/* 样式 */}
      <Style />

      {/* Live2D Widget */}
      <Live2D />

      {/* 主题样式根基 */}
      <div
        id='theme-danbouru'
        className={`${siteConfig('FONT_STYLE')} dark:bg-hexo-black-gray w-full h-screen min-h-screen justify-center dark:text-gray-300 scroll-smooth`}>
        {/* 端顶部导航栏 */}
        <TopNavBar {...props} />

        {/* 左右布局区块 */}
        <main
          id='wrapper'
          className={
            (JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE'))
              ? 'flex-row-reverse'
              : '') + ' relative flex justify-between w-full h-screen mx-auto'
          }>
          {/* 左侧推拉抽屉 */}
          <div
            className={
              ' hidden md:block dark:border-transparent relative z-10 mx-4 w-52 max-h-full pb-44'
            }>
            {/* 图标Logo */}
            <div className='hidden md:block w-full top-0 left-5 md:left-4 z-40 pt-3 md:pt-4'>
              <LogoBar {...props} />
            </div>
            <div className='main-menu z-20 pl-9 pr-7 pb-5 sticky pt-1 top-20 overflow-y-scroll h-fit max-h-full scroll-hidden bg-white dark:bg-neutral-800 rounded-xl '>
              {/* 嵌入 */}
              {slotLeft}

              <div className='grid pt-2'>
                {/* 显示菜单 */}
                {links &&
                  links?.map((link, index) => (
                    <MenuItem key={index} link={link} />
                  ))}
              </div>
            </div>

            {/* 页脚站点信息 */}
            <div className='w-56 fixed left-0 bottom-0 z-0'>
              <Footer {...props} />
            </div>
          </div>

          {/* 右侧主要内容区块 */}
          <div
            id='center-wrapper'
            className='flex flex-col justify-between w-full relative z-10 pt-20 md:pt-5 pb-8 min-h-screen overflow-y-auto'>
            <div
              id='container-inner'
              className='w-full px-6 pb-6 md:pb-20 max-w-8xl justify-center mx-auto'>
              {slotTop}
              {/* 广告植入 */}
              <WWAds className='w-full' orientation='horizontal' />

              <Transition
                show={!onLoading}
                appear={true}
                enter='transition ease-in-out duration-700 transform order-first'
                enterFrom='opacity-0 translate-y-16'
                enterTo='opacity-100'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 -translate-y-16'
                unmount={false}>
                {children}
              </Transition>

              {/* Google广告 */}
              <AdSlot type='in-article' />
              <WWAds className='w-full' orientation='horizontal' />

              {/* 回顶按钮 */}
              <JumpToTopButton />
            </div>

            {/* 底部 */}
            <div className='md:hidden'>
              <Footer {...props} />
            </div>
          </div>
        </main>

        {/* 移动端悬浮目录按钮 */}
        {showTocButton && !tocVisible && (
          <div className='md:hidden fixed right-0 bottom-52 z-30 bg-white border-l border-t border-b dark:border-neutral-800 rounded'>
            <FloatButtonCatalog {...props} />
          </div>
        )}

        {/* 移动端导航抽屉 */}
        <PageNavDrawer {...props} filteredNavPages={filteredNavPages} />
      </div>
    </ThemeGlobalNav.Provider>
  )
}

/**
 * 首页
 * @param {*} props
 * @returns 此主题首页就是列表
 */
const LayoutIndex = props => {
  return <LayoutPostListIndex {...props} />
}

/**
 * 首页列表
 * @param {*} props
 * @returns
 */
const LayoutPostListIndex = props => {
  // const { customMenu, children, post, allNavPages, categoryOptions, slotLeft, slotRight, slotTop, meta } = props
  // const [filteredNavPages, setFilteredNavPages] = useState(allNavPages)
  return (
    <>
      <Announcement {...props} />
      <BlogPostListAll {...props} />
    </>
  )
}

/**
 * 文章列表
 * @param {*} props
 * @returns
 */
// 弃用原有的
/*const LayoutPostList = props => {
  const { posts } = props
  // 顶部如果是按照分类或标签查看文章列表，列表顶部嵌入一个横幅
  // 如果是搜索，则列表顶部嵌入 搜索框
  return (
    <>
      <div className='w-full max-w-7xl mx-auto justify-center mt-12'>
        <div
          id='posts-wrapper'
          className='card-list grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
          {posts?.map(post => (
            <BlogPostCard key={post.id} post={post} className='card' />
          ))}
        </div>
      </div>
    </>
  )
} */
// 换这个，加入一个标题告诉读者点了啥
const LayoutPostList = props => {
  const { posts } = props
  const router = useRouter()

  // 从当前 URL 判断是 Tag 结果页还是 Category 结果页
  const currentPath = router.asPath.split('?')[0]

  const decodePathValue = value => {
    if (!value) return ''
    try {
      return decodeURIComponent(value)
    } catch {
      return value
    }
  }

  const tagMatch = currentPath.match(/\/tag\/([^/?#]+)/)
  const categoryMatch = currentPath.match(/\/category\/([^/?#]+)/)

  const currentTag = tagMatch ? decodePathValue(tagMatch[1]) : ''
  const currentCategory = categoryMatch
    ? decodePathValue(categoryMatch[1])
    : ''

  return (
    <>
      <div className='w-full max-w-7xl mx-auto justify-center mt-12'>

        {/* Tag 文章结果标题 */}
        {currentTag && (
          <h1 className='danbouru-page-title dark:text-gray-300'>
            <i className='mr-3 fas fa-tag' />
            散落的毛 Tag：{currentTag}
          </h1>
        )}

        {/* Category 文章结果标题 */}
        {currentCategory && (
          <h1 className='danbouru-page-title dark:text-gray-300'>
            <i className='mr-3 fas fa-th' />
            分装袋 Category：{currentCategory}
          </h1>
        )}

        <div
          id='posts-wrapper'
          className='card-list grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
          {posts?.map(post => (
            <BlogPostCard key={post.id} post={post} className='card' />
          ))}
        </div>
      </div>
    </>
  )
}


/**
 * 文章详情
 * @param {*} props
 * @returns
 */
const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000
  useEffect(() => {
    // 404
    if (!post) {
      setTimeout(
        () => {
          if (isBrowser) {
            const article = document.querySelector('#article-wrapper #notion-article')
            if (!article) {
              router.push('/404').then(() => {
                console.warn('找不到页面', router.asPath)
              })
            }
          }
        },
        waiting404
      )
    }
  }, [post])
  return (
    <>
      {/* 文章锁 */}
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && (
        <div id='container'>
          {/* title */}
          <h1 className='danbouru-page-title dark:text-gray-300'>
            {/* 不使用懒加载了，会妨碍图片反向代理 */}
            {siteConfig('POST_TITLE_ICON') && post?.pageIcon && (
              post.pageIcon.startsWith('http') ? (
                <img
                  // 避免notion icon的问题
                  // src={getTitleIconUrl(post.pageIcon)}
                  src={normalizeNotionIconUrl(post.pageIcon)}
                  alt=''
                  className='w-8 h-8'
                />
              ) : (
                <span className='mr-1'>{post.pageIcon}</span>
              )
            )}
            {post?.title}
          </h1>

          {/* Notion文章主体 */}
          {post && (
            <section className='px-1'>
              <div id='article-wrapper'>
                <NotionPage post={post} />
              </div>

              {/* 分享 */}
              {/* <ShareBar post={post} /> */}
              {/* 文章分类和标签信息 */}
              {/* 原结构，显示不了分类和tag及日期
              <div className='flex justify-between'>
                {CONFIG.POST_DETAIL_CATEGORY && post?.category && (
                  <CategoryItem category={post.category} />
                )}
                <div>
                  {CONFIG.POST_DETAIL_TAG &&
                    post?.tagItems?.map(tag => (
                      <TagItemMini key={tag.name} tag={tag} />
                    ))}
                </div>
              </div> */}
              <hr className='my-8 border-gray-200 dark:border-gray-700' />
              <div className='post-footer-meta text-sm text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-x-4 gap-y-2'>
                {/* 创建日期+修改日期 */}
                <div className='post-footer-date-row'>
                  {post?.publishDay && (
                    <span className='post-footer-date inline-flex items-center'>
                      <i className='fa-solid fa-clock-rotate-left' />
                      {post.publishDay}
                    </span>
                  )}

                  {post?.lastEditedDay && (
                    <span className='post-footer-date post-footer-date-edited inline-flex items-center'>
                      {post.lastEditedDay}
                    </span>
                  )}
                </div>
                {/* 分类 */}
                {post?.category && (
                  <span className='post-footer-category inline-flex items-center'>
                    <i className='fa-solid fa-table-list' />
                    <CategoryItem category={post.category} noHover />
                  </span>
                )}
                {/* 标签 */}
                {post?.tagItems?.length > 0 && (
                  <span className='post-footer-tags inline-flex items-center flex-wrap'>
                    <i className='fas fa-tags mr-1.5' />
                    {post.tagItems.map(tag => (
                      <TagItemMini key={tag.name} tag={tag} footerStyle />
                    ))}
                  </span>
                )}
              </div>

              {/* 上一篇、下一篇文章 */}
              {/* {post?.type === 'Post' && <ArticleAround prev={prev} next={next} />} */}

              <AdSlot />
              <WWAds className='w-full' orientation='horizontal' />

              <Comment frontMatter={post} />
            </section>
          )}

          <TocDrawer {...props} />
        </div>
      )}
    </>
  )
}

/**
 * 没有搜索
 * 全靠页面导航
 * @param {*} props
 * @returns
 */
const LayoutSearch = props => {
  return <></>
}

/**
 * 归档页面基本不会用到
 * 全靠页面导航
 * @param {*} props
 * @returns
 */
const LayoutArchive = props => {
  const { archivePosts } = props

  return (
    <div className='w-full'>
      <h1 className='danbouru-page-title dark:text-gray-300'>
        <i className='mr-3 fas fa-clock-rotate-left' />
        时间封箱带 Archive
      </h1>

      <div className='pb-20'>
        {Object.keys(archivePosts).map(archiveTitle => (
          <BlogArchiveItem
            key={archiveTitle}
            archiveTitle={archiveTitle}
            archivePosts={archivePosts}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * 404
 * @param {*} props
 * @returns
 */
const Layout404 = props => {
  const router = useRouter()
  useEffect(() => {
    // 延时3秒如果加载失败就返回首页
    setTimeout(() => {
      const article = isBrowser && document.getElementById('article-wrapper')
      if (!article) {
        router.push('/').then(() => {
          // console.log('找不到页面', router.asPath)
        })
      }
    }, 3000)
  }, [])

  return <>
        <div className='md:-mt-20 text-black w-full h-screen text-center justify-center content-center items-center flex flex-col'>
            <div className='dark:text-gray-200'>
                <h2 className='inline-block border-r-2 border-gray-600 mr-2 px-3 py-2 align-top'><i className='mr-2 fas fa-spinner animate-spin' />404</h2>
                <div className='inline-block text-left h-32 leading-10 items-center'>
                    <h2 className='m-0 p-0'>页面无法加载，即将返回首页</h2>
                </div>
            </div>
        </div>
    </>
}

/**
 * 分类列表
 * 不用{locale.COMMON.CATEGORY}，统一成英文
 */
const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  const { locale } = useGlobal()

  return (
    <>
      <div className='py-10'>
      <h1 className='danbouru-page-title dark:text-gray-300'>
        <i className='mr-3 fas fa-th' />
        分装袋 Categories
      </h1>

        <div
          id='category-list'
          className='danbouru-taxonomy-list'
        >
          {categoryOptions?.map(category => {
            return (
              <SmartLink
                key={category.name}
                href={`/category/${category.name}`}
                passHref
                legacyBehavior
              >
                <div className='danbouru-taxonomy-item'>
                  <i className='mr-3 fas fa-folder' />
                  {category.name} ({category.count})
                </div>
              </SmartLink>
            )
          })}
        </div>
      </div>
    </>
  )
}

/**
 * 标签列表
 * 原主题nav根本没写！！！danbouru补上。
 */
/*const LayoutTagIndex = props => {
  return <></>
}*/
const LayoutTagIndex = props => {
  const { tagOptions } = props

  return (
    <div className='w-full'>
      <h1 className='danbouru-page-title dark:text-gray-300'>
        <i className='mr-3 fas fa-tags' />
        散落的毛 Tags
      </h1>

      <div
        id='tags-list'
        className='danbouru-taxonomy-list'
      >
        {tagOptions?.map(tag => (
          <SmartLink
            key={tag.name}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            passHref
          >
            <div className='danbouru-taxonomy-item'>
              <i className='mr-3 fas fa-tag' />
              {tag.name}
              {tag.count ? ` (${tag.count})` : ''}
            </div>
          </SmartLink>
        ))}
      </div>
    </div>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
