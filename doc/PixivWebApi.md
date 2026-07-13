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
- **URL**：`https://www.pixiv.net/ajax/search/{type}/{name}`
- **请求方法**: `GET`
- **传参方式**: `PATH` & `QUERY` 
- **参数说明**

| 参数名 | 位置 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `type` | Path | String | 作品类型：`novel` 小说 |
| `name` | Path | String | 关键词 |
| `word` | Query | String | 关键词 (同 name) |
| `order` | Query | String | 排序方式：`date_d` 最新、`date` 最旧 |
| `mode` | Query | String | 年龄限制：`all`、`safe`、 `r18`|
| `scd` | Query | String | 开始时间：`0` 否、`2026-01-01`|
| `ecd` | Query | String | 结束时间：`0` 否、`2026-07-01`|
| `p` | Query | Integer | 页码 |
| `ai_type` | Query | Integer | AI作品：`0` 否、`1` 是 |
| `csw` | Query | Integer | 整合作者：`0` 否、`1` 是 |
| `s_mode` | Query | String | 检索范围：`s_tag` 标签部分一致、`s_tag_full` 标签完全一致、`tag_tc` 标签标题说明文字、`tc` 标签说明文字 |
| `tlt` | Query | Integer | 正文字数下限：`0` 否、`5000` |
| `tgt` | Query | Integer | 正文字数上限：`0` 否、`5000` |
| `wlt` | Query | Integer | 正文单词下限：`0` 否、`5000` |
| `wgt` | Query | Integer | 正文单词上限：`0` 否、`5000` |
| `original_only` | Query | Integer | 仅限原创：`0` 否、`1` 是 |
| `genre` | Query | Integer | 分类：详见 `https://www.pixiv.net/genre/novel` |
| `gs` | Query | Integer | 整合系列：`0` 否、`1` 是 |
| `lang` | Query | String | 语言：`zh` 中文 |

#### 调用示例
```
https://www.pixiv.net/ajax/search/novels/中文?word=中文&order=date_d&mode=all&p=1&s_mode=tag_tc&lang=zh
```
对应网页
```
https://www.pixiv.net/search?q=%E4%B8%AD%E6%96%87&s_mode=tag_tc&type=novel&work_lang=zh-cn
```


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


