import SmartLink from '@/components/SmartLink'
import { groupGalleryPosts } from '../lib/gallery'
import { useState } from 'react'

function GalleryImage({ src }) {
  const [failedSource, setFailedSource] = useState(null)
  return src && failedSource !== src ? (
    <img
      src={src}
      alt=''
      loading='lazy'
      decoding='async'
      onError={() => setFailedSource(src)}
    />
  ) : (
    <span className='danbouru-gallery-empty'>暂无图片</span>
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
                className='card danbouru-gallery-card bg-white dark:bg-neutral-800'
                aria-label={post.title}
              >
                <div className='danbouru-gallery-media'>
                  <GalleryImage src={post.galleryImage} />
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
