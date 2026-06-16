---
layout: doc
title: ✨ 臻享阅读 - 开源阅读 + Pixiv 书源 新手使用指南
description: 彻底解决 Pixiv 官方软件的痛点！从认识开源阅读，到导入书源、登录账号、开始使用，彻底告别 Pixiv 官方软件的阅读功能缺陷，找回阅读的纯粹乐趣。

#sidebar: false
#aside: false
#editLink: false
#lastUpdated: false
#prev: false
#next: false
#comment: false
#friendlink: false

repos:    
  - name: Pixiv 书源 / PixivSource
    icon: /img/BookSourcePixiv.png
    desc: 最好的 Pixiv 小说阅读器
    link: https://github.com/DowneyRem/PixivSource
    prerelease: false
    recommend: pixiv
    show_assets: 1
  
  - name: 阅读 Sigma
    icon: /img/LegadoSigma.png
    desc: 极致阅读体验 免费开源电子书阅读器
    link: https://gitee.com/lyc486/legado
    prerelease: false
    recommend: releaseS.apk
    show_assets: 1
    
#  - name: 轻悦时光
#    icon: /img/QYSG.png
#    desc: 纯本地的多端兼容阅读器
#    link: https://github.com/autobcb/qysg
#    prerelease: false
#    recommend: ios 64 win mac
#    show_assets: 1

head:
  - - meta
    - name: keywords
      content: 臻享阅读, Pixiv 书源新手教程, 开源阅读 Legado 入门, Pixiv 小说书架, Legado Pixiv 配置, Pixiv 小说阅读器, Legado Pixiv 书源, 开源阅读配置
  - - meta
    - property: og:title
      content: ✨ 臻享阅读 - 开源阅读 + Pixiv 书源 新手使用指南
  - - meta
    - property: og:description
      content: 彻底解决 Pixiv 官方软件的痛点！从认识开源阅读，到导入书源、登录账号、开始使用，彻底告别 Pixiv 官方软件的阅读功能缺陷，找回阅读的纯粹乐趣。
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
<img width="150" height="150" src="./pic/BookSourcePixiv.png" alt="Pixiv BookSource"/>
<br>

# ✨ 臻享阅读 ✨
## 最好的 Pixiv 第三方小说阅读器
### 🅿️ [开源阅读](https://github.com/Luoyacheng/legado) + Pixiv 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
#### ☕ [书源项目打赏名单](Sponsor.md)
</div>


> [!WARNING]
>
> ⚠️ **你正在 GitHub 上浏览此文档， Github 文档可能不完整
> [网页版](https://pixivsource.pages.dev/BetterExperience)
> 内容更全面，排版更精美**


> [!TIP]
> 
> **面向新手的完整配置指南，彻底解决 Pixiv 官方软件的痛点！**
> 
> **另有：极简配置指南：**
> [⚡️ 快速开始](QuickStart.md)
> 
> **Pixiv 书源 全部功能 详见：**
> [🅿️ Pixiv 书源 功能手册](Pixiv.md)


## 你是否被下面的问题所困扰？ {#Trouble}
### 👎 官方 APP 的小说阅读体验堪忧 {#OfficialAPPTrouble}
<details><summary><strong> 官方软件阅读体验堪忧 </strong></summary>

- 小说功能缺陷
  - **没有小说书架**
  - **没有首行缩进**
  - **不能保存阅读进度**
  - **拉黑功能并非屏蔽**
- 搜索功能缺陷
  - **默认搜索标签，而非小说名称**
  - **不能直接搜索作者名称，获取其小说**
- 基础功能却需要付费
  - **浏览记录是 Vip 功能**
  - **屏蔽标签是 Vip 功能**
  - **屏蔽作者是 Vip 功能**
</details>


### 😞 第三方 APP 的小说阅读体验不佳 {#UnOfficialAPPTrouble}
<details><summary><strong> 第三方软件阅读体验不佳 </strong></summary>

- <details><summary> 🈚️ 无小说功能 </summary>

  - [PixEz Viewer](https://github.com/ultranity/Pix-EzViewer)
  - [Pi Pixiv](https://github.com/darriousliu/PiPixiv)
  </details>

- <details><summary> 👎 阅读体验明显不如 Pixiv </summary>

  - [Pixiv Shaft](https://github.com/CeuiLiSA/Pixiv-Shaft) 
  - [Pixiv Artvier](https://github.com/kerrinz/pixiv-artvier) 
  - [Pixes](https://github.com/wgh136/pixes)
  </details>

- <details><summary> 😞 阅读体验略逊色于 Pixiv </summary>

  - [PixEz Flutter](https://github.com/Notsfsssf/pixez-flutter)
  - [Pixiv Multi Platform](https://github.com/magic-cucumber/Pixiv-MultiPlatform)
  - [Pixiv Viewer](https://github.com/asadahimeka/pixiv-viewer)
  </details>
</details>

> 软件整理自 https://linux.do/t/topic/657910

**迄今为止（2025.12），上述软件的小说阅读体验，依然没有一个超过了 Pixiv**


### 你是否想改善阅读体验呢？<br>如果你的回答是「是的」<br>那么你可能需要：{#Question}
<div align="center">

## 开源阅读 + Pixiv 书源 {#RepoIntroduction}
<img width="150" height="150" src="./pic/BookSourcePixiv.png" alt="Pixiv BookSource"/>
</div>

> [!NOTE]
>
> **我们的目标：做最好的 Pixiv 的小说阅读器**
> 
> **经过充分的调研，此目标已在 2025.12 实现**


## 你将获得：<br>堪比网文小说的阅读体验
使用 **开源阅读 + Pixiv 书源**，彻底摆脱官方 App 的各种限制，获得流畅、完整、舒适的 Pixiv 小说阅读体验。

## 🆚 功能对比
> [!TIP]
>
> **Pixiv 官方 APP 与 Pixiv 书源（开源阅读）的功能对比**


### 📖 阅读体验

| 功能       | Pixiv App | Pixiv 书源 |
|:---------|:----------|:---------|
| **小说书架** | ❌ 缺失      | ✅ 支持     |
| **阅读进度** | ☑️ 仅限系列   | ✅ 单篇和系列  |
| **阅读记录** | 💰 会员功能   | ✅ 支持     |
| **更新提示** | ☑️ 软件推荐   | ☑️ 仅限系列  |
| **首行缩进** | ❌ 缺失      | ✅ 支持     |
| **正文插图** | ☑️ 支持     | ✅ 支持     |
| **离线阅读** | ❌ 缺失      | ✅ 支持     |
| **软件广告** | 💰 仅会员无   | ✅ 纯净无广   |


### ▶️ 互动功能
| 功能       | Pixiv App | Pixiv 书源          |
|:---------|:----------|:------------------|
| **收藏小说** | ✅ 支持      | ✅ 支持（可选：添加书架自动收藏） |
| **私密收藏** | ☑️ 支持     | ✅ 支持（轻松切换公开/私密）   |
| **追更系列** | ☑️ 支持     | ✅ 支持（可选：添加书架自动追更） |
| **收藏系列** | ❌ 缺失      | ✅ 支持（收藏整个系列）      |
| **关注作者** | ✅ 支持      | ✅ 支持              |
| **屏蔽作者** | 💰 仅限会员   | ✅ 支持（本地屏蔽）        |
| **查看评论** | ☑️ 章末广告后 | ✅ 支持（纯净无广）        |
| **发送评论** | ☑️ 支持     | ✅ 支持（自动拆分超长评论）    |
| **回复评论** | ✅ 支持      | ✅ 支持              |
| **投票功能** | ✅ 支持      | ✅ 支持              |


## 立即开始

<!--@include: CommonDownload.md-->

<!--@include: CommonIntroduction.md-->

<!--@include: CommonPixiv.md-->

<!--@include: CommonLegado.md-->

<!--@include: CommonPixivFunction.md-->

<!--@include: CommonSuffix.md-->

