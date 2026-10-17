import SmartLink from '@/components/SmartLink'
import { groupGalleryPosts } from '../lib/gallery'
import { useState } from 'react'
import NotionIcon from './NotionIcon'

function GalleryImage({ src, icon }) {
  const [failedSource, setFailedSource] = useState(null)
  const [longSource, setLongSource] = useState(null)
  return src && failedSource !== src ? (
    <>
      <img
      className={`danbouru-gallery-cover${longSource === src ? ' is-long' : ''}`}
      src={src}
      alt=''
      loading='lazy'
      decoding='async'
      onLoad={event => {
        const image = event.currentTarget
        setLongSource(image.naturalHeight / image.naturalWidth > 4 / 3 ? src : null)
      }}
      onError={() => setFailedSource(src)}
    />
      {longSource === src && (
        <span className='danbouru-gallery-crop-fade' aria-hidden='true' />
      )}
    </>
  ) : (
    <span className='danbouru-gallery-empty'>
      {icon ? <NotionIcon icon={icon} className='danbouru-gallery-icon' /> : '暂无图片'}
    </span>
  )
}

export default function BlogGallery({ posts }) {
  return (
    <div id='posts-wrapper' className='danbouru-gallery'>
      {Object.entries(groupGalleryPosts(posts)).map(([month, items]) => (
        <section key={month} aria-label={month}>
          <h2 className='danbouru-archive-month dark:text-gray-300'>{month}</h2>
          <div className='danbouru-gallery-grid'>
            {items.map(post => (
              <SmartLink
                key={post.id}
                href={post.href}
                className='card danbouru-gallery-card'
                aria-label={post.title}
              >
                <div className='danbouru-gallery-media'>
                  <GalleryImage src={post.galleryImage} icon={post.pageIcon} />
                  {Number.isInteger(post.ext?.galleryImageCount) && post.ext.galleryImageCount > 1 && (
                    <span className='danbouru-gallery-count' aria-label={`共 ${post.ext.galleryImageCount} 张图片`}>
                      {post.ext.galleryImageCount}
                    </span>
                  )}
                </div>
                <div className='danbouru-gallery-copy'>
                  <p className='title font-bold'>
                    <time dateTime={post.date?.start_date || undefined}>
                      {post.publishDay || post.date?.start_date || '日期未定'}
                    </time>
                  </p>
                  <p className='description danbouru-gallery-summary'>
                    {post.summary || '暂无简介'}
                  </p>
                </div>
              </SmartLink>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
