# Danbouru 猫尾巴纸箱
![猫尾巴纸箱](https://danbouru.cat-fish.net/OG.png)

基于 NotionNext 自定义的个人站点主题。主要修改集中在 `themes/danbouru`，尽量避免改动共享核心代码，以减少后续 Sync Fork 冲突。

## 2026.10.06 重大更新（？）
加入完全自制的live2D宠物挂件：阿尔猫猫  
具体详情可见：https://danbouru.cat-fish.net/article/3efb7f05-e444-8044-b8ea-c86e07c77eb6

## 主要修改

- 将主题根节点从 `theme-onenav` 重命名为 `theme-danbouru`
- 自定义主色为姜黄色 `#cb912f`
- 统一正文最大宽度为 500px
- 重做首页 Card 的边框、阴影和按压式 Hover
- 优化 Bookmark、Callout、Inline Code、Code Block
- 优化无序 / 有序列表、Todo Checkbox
- 优化 Category / Tag / Archive 页面
- 优化 Notion Gallery / List 数据库视图
- 调整页面引用、搜索框 Focus、文字选中颜色
- 关闭默认 Lazy Image 灰色动画
- 整理 CSS，合并重复规则，并抽取常用主题变量

## Notion 私有数据库

Notion 数据库已关闭公开访问，站点通过 Vercel 服务端环境变量读取私有内容：

```env
NOTION_TOKEN_V2=******
```

注意：

- Token 仅保存在 Vercel Environment Variables
- 不写入源码，不提交 GitHub
- 不使用 `NEXT_PUBLIC_` 前缀
- Notion 原始数据库和页面保持私有
- `NOTION_ACTIVE_USER` 当前未使用

## Notion Database 日期属性 Bug

### 问题

当数据库显示 Notion 系统属性：

- `Created time`
- `Last edited time`

时，`react-notion-x` 会报：

```text
RangeError: Invalid time value
```

### 原因

Notion API 原始返回的数据中实际包含：

```js
created_time
last_edited_time
```

但 NotionNext 在：

```text
lib/db/notion/SiteDataApi.js
```

的 `cleanBlock()` 中主动删除了这两个字段：

```js
delete pageBlock[i]?.value?.created_time
delete pageBlock[i]?.value?.last_edited_time
```

而 `react-notion-x` 的数据库日期渲染仍依赖：

```js
block.created_time
block.last_edited_time
```

因此前端收到 `undefined` 后触发日期格式化错误。

### 修复

保留：

```js
created_time
last_edited_time
```

不再在 `cleanBlock()` 中删除。

修复后：

- Created time 正常显示
- Last edited time 正常显示
- `Invalid time value` 不再出现
- 无需修改 `node_modules`


## 维护说明

尽量将自定义修改控制在 Danbouru 主题和少量必要源码修复中，避免直接修改 `node_modules`，以降低后续 Sync Fork 时的冲突风险。
