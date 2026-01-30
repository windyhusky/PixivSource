<div align="center">
<img width="150" height="150" src="./pic/BookSourcePixiv.png" alt="Pixiv BookSource"/>
<br>

# 书源更新日志
### 🅿️ [开源阅读](https://github.com/gedoor/legado) Pixiv 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
#### ☕ [书源项目打赏名单](./Sponsor.md)
</div>


## ⏱️ 近期更新
### 📚 更新 256
🅿️ Pixiv、🦊 Linpx & FN 书源：
- **此版本起仅支持 阅读 Plus、阅读 Beta 新包名**
  - 登录检测：检测版本，添加弹窗
  - 检测阅读版本，跳转阅读 Plus 下载界面


### ⬆️ 更新 255
- Pixiv 小说、小说备用、漫画：
  - JSLib：
    - 使用 getFromCacheObject putInCacheObject 统一读写缓存 object
      - getAjaxJson 使用 getFromCacheObject 读写缓存
      - getAjaxAllJson 使用 getFromCacheObject putInCacheObject 读写缓存
      - cacheGetAndSet 使用 getFromCacheObject putInCacheObject 读写缓存
    - putInCacheObject 直连时，同时缓存常规 url
    - 使用 putInCacheObject 替换 cache.put("name", JSON.stringify(obj), second)
      - 搜索: 优化 getSeries，搜索结果写入缓存
      - 详情: 使用 putInCacheObject
      - 正文: 使用 putInCacheObject
      - 登录界面：使用 putInCacheObject
    - 优化 getAjaxJson
    - 使用 getFromCache putInCache 统一读写缓存 object
    - 使用 getFromCache 替换 cache.get("name")
    - 使用 putInCache 替换 cache.put("name", obj, second)
      - 登录检测: 使用 putInCache 与 getFromCache
      - 登录检测：优化 saveNovels
      - JSLib: getWebViewUA 加入缓存
      - JSLib: 使用 getFromCache
      - 发现: 使用 getFromCache
  - 登录检测：
    - 优化 startBrowser
    - 简化 isSourceRead
    - 简化 isLegadoOfficial
  - 搜索发现 
    - 发现：优化 handlerRegexIllusts
    - 小说搜索：优化 getSeries 
    - 漫画搜索：优化 getArtwork


- Pixiv 小说、小说备用、漫画、Linpx、FN：
  - 适配阅读 Plus 新特性：
    - 登陆界面
      - 使用 JS 生成登录界面
    - 正文
      - 使用三级标题替换 [chapter:]
      - 不再替换 [newpage]
      - 超链接
    - 回调:
      - 使用 book 对象获取数据
      - 删除小说，清理缓存
  - 其他变动：
    - 发现地址: 重命名为 discoverUrl.js
    - 正文：图片规则改为 FULL
    

### 📚 更新 254 
- 🦊 Linpx、FN
  - 可用软件：
    - ✅ Sigma、Beta（新包名）
    - 🚫 正式版、MD3、源阅（均不推荐）
  - ▶️ 添加动态登录界面
    - 📖 书源功能
    - ⤴️ 分享功能
    - ⚙️ 设置按钮

- 🦊 Linpx
  - 💾 搜索详情：添加缓存小说
  - 👤 添加作者：作者链接添加其最新小说

- 🅿️ Pixiv 小说、小说备用、漫画
  - ⚙️ 优化设置输出内容
  - ▶️ 添加动态登录界面（未启用）


### ⬆️ 更新 254
- 🦊 Linpx、FN
  - ⚙️ 设置：
    - 登录检测：设置规范化
    - JSLib： 添加 默认设置
    - 登录界面：添加 设置界面
    - 设置描述：更新描述
    - 登录检测：检测软件平台
  - ▶️ 登录界面：
    - 回调：添加 小说名称
    - 登录界面：添加 分享小说
    - JSLib：添加 UA，优化分享小说
    - 登录界面：优化 分享 Pixiv 链接
    - 登录界面：使用 JS 生成登录界面
    - 登录 URL：简化 getNovel

- 🦊 Linpx
  - 📚 优化 未缓存系列目录的情况
    - 登录检测：优化 handNovels
    - 登录检测: 重写 getNovelRes，删除无用代码
    - 目录：优化目录链接
    - 详情：优化目录解析
  - 🔗 添加链接：
    - 登录检测：使用 getNovelRes 添加作者
    - 登录检测: 更新 getNovelRes 正则
    - 添加链接：更新正则，允许添加作者

- 🅿️ Pixiv 小说、小说备用、漫画
  - ⚙️ 优化设置输出内容
  - ▶️ 添加动态登录界面（未启用）


### ⬆️ 更新 253
调整书源定位：
- 小说书源：
  - ✅ Sigma、Beta（新包名）
  - 🚫 正式版、MD3、源阅
- 小说备用：
  - ✅ Sigma、Beta（新包名）
  - ✅ MD3、正式版、源阅


- 🅿️ Pixiv 小说、小说备用
  - 🔍 搜索：删除 搜索标签后过滤作者 `#标签1 @作者名`
  - ⭐️ 发现：允许登录账号前打开书源主页
  - 登录 URL：删除无用代码
  - 📄 正文：抽离诸多 replace 函数
  - 📄 正文：优化 newpage
  - 📄 正文：优化 超链接（未启用)
  - ↩️ 回调：刷新书架时，降低并发率

- 🅿️ Pixiv 小说备用
  - 下放所有 Pixiv 小说书源功能
    - ▶️ 登录界面：登录时，不检测重复登录
    - ⚙️ 设置按钮
  - 同步小说书源更新

- 🅿️ Pixiv 漫画
  - ⭐️ 发现：添加强制登录
  - ⭐️ 发现：允许登录账号前打开书源主页
  - ⚙️ 设置：使用 独立设置
    - 优化 ✈ 直连模式
    - 优化 🖼 图片质量
  - ▶️ 登录界面：新增 ▶️ 登录界面
  - ▶️ 登录界面：新增 ⚙️ 设置按钮
  - ▶️ 登录检测：修复 登录状态检测的错误
  - ↩️ 回调：刷新书架时，降低并发率

- 🦊 Linpx、FN
  - 📄 正文：抽离诸多 replace 函数
  - 📄 正文：优化 newpage
  - 📄 正文：优化 超链接（未启用)
  - 🖼 正文：直连 Pixiv 获取图片（Linpx）
  - 🖼 正文：使用 Linpx 获取图片（FN）
  - ↩️ 回调：刷新书架时，降低并发率


### ⬆️ 更新 252
- 🖼 正文：优化 pixivimage 图片替换
  - Pixiv 小说、Linpx、FN

- 🔍 搜索：搜索作者、搜索标签
  - Pixiv 漫画、Linpx、FN

- Linpx、FN
  - 书源：手动管理请求头
  - 登录检测：优化小说名称
  - JSLib：添加 Pixiv 直连方法获取图片链接
  - JSLib：拼接图片链接
  - 🖼 正文：优化 pixivimage 图片链接替换
  - 🖼 正文：uploadedimage 图片使用 Pixiv 直连
  
- Linpx
  - 搜索：优化搜索作者
  - 搜索：关闭搜索链接
  - 登录检测：优化缓存系列小说
  - 目录：获取缓存小说
  - 目录：修复系列小说无目录
  

### ⬆️ 更新 251
- ⚙️ Pixiv 小说设置
  - 优化 设置初始化
  - 修复 设置显示错误
  - 优化 相关代码
- 🏠 站点教程新增
  - ✨ [臻享阅读](BetterExperience.md)


### ⬆️ 更新 250
- 🔗 优化：分享链接：
  - Pixiv 小说、Linpx、FN
    - ✅ Plus、Beta 版可用
    - 🚫 正式版、MD3、源阅 不可用
- ▶️ 登录界面：显示章节名称（新）、小说互动（新）
  - Pixiv 小说：准确获取当前章节的 单篇、系列、作者 ID
    - ✅ Plus、Beta 可用
    - 🚫 正式版、MD3、源阅 不可用
- ▶️ 登录界面：显示章节名称（旧）
  - Pixiv 小说：【刷新正文】以获取当前章节的 单篇、系列、作者 ID
    - ✅ 正式版、MD3、源阅 可用
    - ☑️ 暂时保留旧方法


### ⬆️ 更新 249
- ⚙️ 优化：设置初始化、默认设置、设置逻辑：
  - Pixiv 小说、小说备用、漫画
- ✈ 优化：直连模式提示：
  - Pixiv 小说
- 🔗 设置分享链接：
  - Pixiv、Linnx、FurryNovel
    - ✅ Plus、Beta 版可用
    - 🚫 正式版、MD3、源阅 不可用


### ⬆️ 更新 248
- 添加 书源主页
- 兼容正式版 325


### ⬆️ 更新 247
- ⚙️修复设置未初始化时，直连模式开关引起的 bug
  - Pixiv 书源
- 🌐 新增书源发布页 
  - https://downeyrem.github.io/PixivSource
  - https://pixivsource.pages.dev
- 🔗 替换指南、赞助链接：
  - Pixiv 书源
  - Linpx 书源
  - FurryNovel 书源
  - BTSRK 订阅源


### ⬆️ 更新 246
- Pixiv、Linpx、FurryNovel、BTSRK 订阅源
  - 添加赞助入口


### ⬆️ 更新 245
- Pixiv 小说、备用小说
  - 添加网址：添加 首篇有权限限制的系列
  - 优化正文：替换 不存在插图的链接 为空
  - 修正拼写错误


### ⬆️ 未知更新
<details><summary> 未知更新 </summary>

- 📙 小说书源
  - ✅ **兼容阅读：3.25.0527 - 至最新版本**
  - ✅ **兼容源阅：当前最新版本1.0 (112)**
  - ✅ 设置：修复默认设置需要点两次的bug (07.12)
  - ✅ 设置：允许源阅使用登录界面调整设置 (07.12)

- 📒 备用书源（不会新增【登录界面】相关功能）
  - ✅ **兼容阅读：3.23.0503? - 至最新版本**
  - ✅ **兼容源阅：当前最新版本1.0 (112)**
  - ⚠️ 不建议同时使用两书源
  - ✅ 同步上述改动
  - 🚫 不可用功能（目前禁用）：
    - ❤️ 他人收藏

- 📖 兼容源阅：
  - 🚫 不可用功能（目前禁用）：
    - ❤️ 他人收藏
  - ✅ 可用功能（当前解禁）：
    - ⚙️ 自定义设置
    - 🚫 屏蔽作者
    - ⏬ 过滤收藏小说
    - ⏬ 过滤追更系列
</details>