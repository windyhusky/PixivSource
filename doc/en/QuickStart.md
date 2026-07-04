---
layout: doc
title: ⚡️ Quick Start:5-Minute Setup for Legado PixivSource
description: Setup in 5 minutes:Download Legado, one-click import Pixiv/Linpx/BTSRK book and subscription sources, log in, and start reading Pixiv novels immediately.

#sidebar: false
#aside: false
#editLink: false
#lastUpdated: false
#prev: false
#next: false
#comment: false
#friendLink: false

head:
  - - meta
    - name: keywords
      content: Legado Source Import, Pixiv Book Source Link, Linpx Source Import, Legado Plus Download, BTSRK RSS Source, Rule Subscription Tutorial, One-Click Import Pixiv Source, Legado Download, Pixiv Source Setup
  - - meta
    - property: og:title
      content: ⚡️ Quick Start:5-Minute Setup for Open-Source Legado Pixiv Source
  - - meta
    - property: og:description
      content: Setup in 5 minutes:Download Legado, one-click import Pixiv/Linpx/BTSRK book and subscription sources, log in, and start reading Pixiv novels immediately.
  - - meta
    - property: og:image
      content: /pic/BookSourcePixiv.png

repos:
  - name: Pixiv BookSource
    icon: /img/BookSourcePixiv.png
    desc: The ultimate reading experience for Pixiv novels.
    link: https://github.com/DowneyRem/PixivSource
    prerelease: false
    recommend: pixiv
    show_assets: 1

  - name: Legado Sigma
    icon: /img/LegadoSigma.png
    desc: Ultimate reading experience, free and open-source e-book reader.
    link: https://gitee.com/lyc486/legado
    prerelease: false
    recommend: releaseS.apk
    show_assets: 1

  - name: QYSG (Qingyue Shiguang)
    icon: /img/QYSG.png
    desc: A purely local, cross-platform compatible reader.
    link: https://github.com/autobcb/qysg
    prerelease: false
    recommend: ios 64 win mac
    show_assets: 1
---

<script setup>
import { computed } from "vue";
import { useData } from "vitepress";

const { page } = useData();
const pagePath = computed(() => page.value.relativePath.replace(/\.md$/, ""));
</script>


<div align="center">
<img width="256" src="./pic/BookSourcePixiv.png" alt="Pixiv BookSource"/>

# ⚡️ Quick Start ⚡️
#### 🅿️ Legado Pixiv BookSource
#### ✈️ Telegram Channel [@PixivSource](https://t.me/PixivSource)
</div>


> [!WARNING]
>
> ⚠️ **You are viewing this documentation on GitHub, which may be incomplete.
> The [Web Version](https://pixivsource.pages.dev/en/QuickStart)
> offers more comprehensive content and better formatting.**


### ⚡️ Quick Jump {#QuickJump}
> [!TIP]
> **Complete the entire setup in just 4 steps and 5 minutes.**
> 
> **Get started now to enjoy the ultimate reading experience!**
>
> ▶️ **[Download App](#DownLoad) =>**
> ➕ **[Import Sources](#ImportSources) =>**
> 🅿️ **[Source Setup](#BookSourceSet) =>**
> ⚙️ **[App Settings](#LegadoSettings) =>**
> 📖 **[Add Novels](#AddNovels)**


[//]: # (> **Also available: For beginners, a complete from-scratch configuration guide:**)
[//]: # (> [✨ Premium Reading Guide]&#40;BetterExperience.md&#41;)
[//]: # (>)
[//]: # (> **For full feature descriptions of the Pixiv Source, see:**)
[//]: # (> [🅿️ Pixiv Book Source Manual]&#40;Pixiv.md&#41;)


## Download App {#DownloadAPP}
<!--@include: CommonDownload.md-->

<!--@include: CommonImport.md-->

<!--@include: CommonPixiv.md-->

<!--@include: CommonLegado.md-->

<!--@include: CommonAddNovels.md-->

<!--@include: CommonSuffix.md-->
