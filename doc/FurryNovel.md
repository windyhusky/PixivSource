---
layout: doc
title: FurryNovel 书源指南 - 在开源阅读中阅读兽人小说
description: 用开源阅读 + FurryNovel 书源，无需登录即可搜索、发现、阅读兽人控小说站收录的 Pixiv、Bilibili 兽人小说，支持按标签筛选发现。

head:
  - - meta
    - name: keywords
      content: FurryNovel, FurryNovel 书源, 兽人控小说站, 兽人小说 阅读, 兽人小说 书源, 开源阅读 兽人小说
  - - meta
    - property: og:title
      content: FurryNovel 书源指南 - 在开源阅读中阅读兽人小说
  - - meta
    - property: og:description
      content: 用开源阅读 + FurryNovel 书源，无需登录即可搜索、发现、阅读兽人控小说站收录的 Pixiv、Bilibili 兽人小说，支持按标签筛选发现。
---

<div align="center">
<img width="150" height="150" src="./pic/BookSourceFurryNovel.png" alt="FurryNovel BookSource"/>
<br>

# FurryNovel 书源使用指南
### 🐯 [开源阅读](https://github.com/Luoyacheng/legado) FurryNovel 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
#### ☕ [书源项目打赏名单](./Sponsor.md)
</div>


<div class="github-only-notice">

> [!NOTE]
>
> 📖 **你正在 GitHub 上浏览此文档， [网页版](https://pixivsource.pages.dev/FurryNovel) 内容更全面，排版更精美**
</div>


> [!TIP]
> **🐯 FurryNovel 书源 全功能使用手册**
>
> **另有：新手配置指南：**
> [✨臻享阅读](BetterExperience.md)；
> **极简配置指南：**
> [⚡️ 快速开始](QuickStart.md)；
> 
> **另有：**
> [🅿️ Pixiv 书源 功能手册](Pixiv.md)；
> [🦊 Linpx 书源 功能手册](Linpx.md)


## [兽人控小说站](https://www.furrynovel.com) 收录了 Pixiv, Bilibili 的大部分兽人小说

> [!NOTE]
> **🐯 FurryNovel 书源 新手配置指南，详见：**
> [⚡️ 快速开始](QuickStart.md)，
> **重复内容不再赘述**


<div v-if="false">
  <!--@include: LinpxCommon.md-->
</div>


## 高级功能 {#All}
### 🔍 搜索小说 {#SearchNovel}
<details><summary> 🔎 搜索小说 </summary>

> [!NOTE]
>
> **书架页面 - 放大镜 - 输入关键词 - 搜索小说**

- <details><summary> 🔎 搜索小说 </summary>
  
  #### 1.0 搜索小说
  ✅ 支持搜索：小说名称、系列小说名称、作者名称、小说标签

  ![img](./pic/SearchViaLegado.png)
  </details>

- <details><summary> 🀄️ 繁简通搜 </summary>
  
  #### 1.1 繁简通搜
  - 【搜索】默认进行繁简转换，同时返回繁体简体小说内容（可在书源设置中关闭）
  - 返回小说内容不转换
  
  ![img](./pic/SearchViaLegadoConvert.jpg)
  </details>

- <details><summary> 👤 搜索作者 </summary>
  
  #### 1.2 搜索作者（格式：`@作者名称`）
  - 兼容搜索格式：`@作者名称`，并无实际功能
  </details>

- <details><summary> #️⃣ 标签专搜 </summary>
  
  #### 1.3 标签专搜（格式：`#标签1` `#标签1 标签2 `）
  - 兼容搜索格式：`@作者名称`，并无实际功能
  </details>
</details>


### ⭐️ 发现小说 {#DiscoverNovel}
<details><summary> ⭐️ 发现小说 </summary>

> [!NOTE]
>
> **发现页面 - 点击各按钮：热门小说、最新小说、随便来点**

- <details><summary> ⭐️ 发现小说 </summary>
  
  ![img](./pic/DiscoverFurryNovel.png)
  </details>

- <details><summary> ⏬ 筛选发现 </summary>

  发现 - 长按 **"兽人小说站"** - 编辑 - 右上角菜单 - 设置源变量
  
  ![img](./pic/SetSourceVariable0.png)
  
  ![img](./pic/SetSourceVariable1.png)
  
  ![img](./pic/SetSourceVariable.png)
  
  设置源变量：输入标签，保存
  ```
  龙
  ```
  发现 - 长按 **"兽人小说站"** - 刷新 - 查看筛选后的小说
  
  ![img](./pic/DiscoverFurryNovelSort.png)
  </details>
</details>

<details><summary> 🆙 更新书源 </summary>

#### 2.4 更新书源
![img](./pic/DiscoverPixiv.jpg)
> [!NOTE]
>
> **点击按钮【🆙 更新】进入书源更新界面**

![img](./pic/UpdateSource.png)

> [!TIP]
>  - Jsdelivr CDN 更新有延迟
>  - Github 更新需代理
>  - Godeberg 更新免代理
</details>


### 🔗 添加网址 {#AddUrl}
<details><summary> 🔗 添加网址 </summary>

> [!NOTE]
>
> **书架 - 菜单 - 添加网址 - 粘贴小说链接**
> 
> **可以同时添加多个小说的链接**

- <details><summary> 🔗 操作流程 </summary>

  #### 3.1 操作流程
  ![img](./pic/AddBookViaUrl1.png)
  ![img](./pic/AddBookViaUrl2.png)
  ![img](./pic/AddBookViaUrl3.png)
  </details>

- <details><summary> 🔗 支持链接 </summary>

  #### 3.2 支持链接
  - 兽人控小说站 目录链接
  ```
  https://furrynovel.com/zh/novel/8312
  ```
  - 兽人控小说站 章节链接
  ```
  https://furrynovel.com/zh/novel/8312/chapter/33116
  ```
  </details>
</details>


### 🌐 订阅源 {#RssSource}
<details><summary> 🌐 订阅源 </summary>

- <details><summary> ⬇️ 导入书源 </summary>

  ![img](./pic/InportBookSourceFurryNovelWeb.png)

  - 点击按钮，导入书源；再次点击，则可更新书源
  - 此处使用的是 Jsdelivr CDN ，更新有延迟

  ![img](./pic/InportBookSourceLinpx.png)
  </details>

- <details><summary> 🔍 站内搜索 </summary>

  #### 4.1 替代阅读搜索
  受阅读设计的限制，阅读内部搜索不可能完全支持 Linpx 的功能。网站的搜索功能更加全面。

  ![img](./pic/SearchViaFurryNovel.png)
  </details>

- <details><summary> ⭐️ 站内发现 </summary>

  #### 4.2 替代阅读发现
  阅读内部浏览器打开 Pixiv，即可使用 Pixiv 书源未完成的功能，如排行榜等功能
  
  ![img](./pic/FurryNovelRaces.png)
  </details>

- <details><summary> ➕ 添加小说 </summary>

  #### 4.3 添加小说至书架
  在阅读内部浏览器内打开 兽人控小说站 小说页面，点击【添加到书架】按钮即可添加小说到书架
  
  ![img](./pic/AddBookViaFurryNovel1.png)
  ![img](./pic/AddBookViaFurryNovel2.png)
  </details>
</details>


<!--@include: CommonSuffix.md-->