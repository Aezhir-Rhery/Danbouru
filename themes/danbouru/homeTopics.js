// 首页 topic 图片：按数组顺序展示。
// 将图片放入 public/topics/，src 填写 '/topics/文件名.webp'，也可使用完整图片 URL。
// href 填写站内路径（如 '/category/分类名'）或完整链接。
// alt 填写 topic 名称，供图片无法显示或使用屏幕阅读器时识别。
// src 或 href 留空时，该项暂不显示；全部留空时不占用首页空间。
const HOME_TOPICS = [
  { id: 'topic-1', src: '/topics/full-moon.png', href: '/category/FULL MOON', alt: '真·女神转生IMAGINE同人漫画涂鸦' },
  { id: 'topic-2', src: '/topics/hosyoku.png', href: '/category/捕食禁止', alt: 'GE2噬神者2同人漫画涂鸦' },
  { id: 'topic-3', src: '/topics/kinshi.png', href: '/category/この行為は禁じられています', alt: '自由战争同人漫画涂鸦' },
  { id: 'topic-4', src: '/topics/jallen.png', href: '/category/哆一嘴一脸血', alt: 'PSO2梦幻之星2同人漫画涂鸦' },
  { id: 'topic-5', src: '/topics/ppl.png', href: '/category/皮皮拉鱼', alt: 'FF14最终幻想14同人漫画涂鸦' }
]

export default HOME_TOPICS
