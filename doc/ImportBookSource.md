---
layout: doc
title: 导入书源 - 开源阅读 导入书源教程
description: 开源阅读 Legado 导入书源完整教程：一键导入、规则订阅、网络导入、文件导入四种方式。

#sidebar: false
#aside: false
#editLink: false
#lastUpdated: false
#prev: false
#next: false
#comment: false
#friendlink: false

head:
  - - meta
    - name: keywords
      content: 书源, 源仓库, 导入书源, 导入 Pixiv 书源, Legado 导入书源, 开源阅读 导入书源, Pixiv 书源订阅, 一键导入书源, 书源规则订阅, Linpx 书源导入, BTSRK 订阅源
  - - meta
    - property: og:title
      content: 导入书源 - 开源阅读 导入书源教程
  - - meta
    - property: og:description
      content: 开源阅读 Legado 导入书源完整教程：一键导入、规则订阅、网络导入、文件导入四种方式。
---


<script setup>
import { useRoute, useRouter } from "vitepress";
const route = useRoute();
route.path = route.path.replace("/", "");
</script>
{{ route.path }}

<div align="center">
<img width="150" height="150" src="./pic/BookSourcePixiv.png" alt="Pixiv BookSource"/>
<br>

# 导入书源
### 🅿️ [开源阅读](https://github.com/Luoyacheng/legado) Pixiv 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
#### ☕ [书源项目打赏名单](./Sponsor.md)
</div>


> [!WARNING]
>
> ⚠️ **你正在 GitHub 上浏览此文档， Github 文档可能不完整
> [网页版](https://pixivsource.pages.dev/ImportBookSource)
> 内容更全面，排版更精美**


> [!TIP]
>
> **开源阅读 Legado 书源导入 指南**
>
> **另有：新手配置指南：**
> [✨臻享阅读](BetterExperience.md)；
> **极简配置指南：**
> [⚡️ 快速开始](QuickStart.md)


## 获取书源、订阅源
- [Legado | 开源阅读 | 频道](https://t.me/legado_channels)
- [源仓库](https://www.yckceo.com/yuedu/shuyuan/index.html)
- [Yiove 书源仓库](https://shuyuan.yiove.com)
- [喵公子书源管理](http://yuedu.miaogongzi.net/gx.html)
- [书源、图源、订阅源、规则、直播源、各种源 大型整合](https://source.zgqinc.gq)  
- [阅读 APP 源](https://legado.aoaostar.com)


## 导入书源

<!--@include: CommonImport.md-->

### 🌐 C.网络导入 {#Internet}
<details><summary><strong> 🌐 网络导入　详细操作</strong></summary>

**我的 - 书源管理 - 菜单 - 网络导入 - 复制链接、粘贴 - 添加书源**

#### 1. 打开【我的】页面，点击【书源管理】
![img](./pic/ImportOnlineBookSource1.jpg)

#### 2. 点击右上角的三点菜单，选择【网络导入】
![img](./pic/ImportOnlineBookSource2.jpg)

#### 3. 粘贴书源链接，点击确定
![img](./pic/ImportOnlineBookSource3.jpg)

#### 4. 导入并启用书源
**如果导入失败，请开启代理，或过段时间重试**

![img](./pic/InportBookSourcePixiv.png)
</details>


### 📑 D.文件导入 {#File}
<details><summary><strong> 📄 文件导入　详细操作</strong></summary>

#### 1.下载书源/订阅源文件
打开 [此处的书源链接](#Subscription) ，选择 **链接另存为**，下载相应书源

或打开 [Github Release](https://github.com/DowneyRem/PixivSource/releases/latest)，下载相应书源

#### 2.使用阅读打开
点击书源文件，打开方式选择：阅读

![img](./pic/OpenInLegado.png)

#### 3.导入并启用书源/订阅源
![img](./pic/InportBookSourcePixiv.png)
</details>