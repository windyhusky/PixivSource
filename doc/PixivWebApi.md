---
layout: doc
title: Pixiv Web Api
description: 

#sidebar: false
#aside: false
#editLink: false
#lastUpdated: false
prev: false
next: false
#comment: false
#friendLink: false

head:
  - - meta
    - name: keywords
      content: Pixiv Web Api
  - - meta
    - property: og:title
      content: Pixiv Web Api
  - - meta
    - property: og:description
      content: Pixiv Web Api
  - - meta
    - property: og:image
      content: /pic/BookSourcePixiv.png
---

<script setup>
import { computed } from "vue";
import { useData } from "vitepress";

const { page } = useData();
const pagePath = computed(() => page.value.relativePath.replace(/\.md$/, ""));
</script>


<div align="center">
<img width="256" src="./pic/BookSourcePixiv.png" alt="Pixiv BookSource"/>


# Pixiv Web Api
#### 🅿️ 开源阅读 Pixiv 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
</div>


> [!WARNING]
>
> ⚠️ **你正在 GitHub 上浏览此文档， Github 文档可能不完整
> [网页版](https://pixivsource.pages.dev/PixivWebApi)
> 内容更全面，排版更精美**


## 搜索小说
### 🔎 搜索小说


## 推荐小说
### ⭐️ 推荐


## 小说信息
#### 小说详情
```
https://www.pixiv.net/ajax/novel/${novelId}
```
- 请求方法：`GET`
- 传参方式：`PATH`
- 参数：
  - novelId：小说作品 ID
- 示例：`https://www.pixiv.net/ajax/novel/12345`


## 小说互动
### ▶️ 互动


