---
layout: doc
title: Linpx BookSource
description: Linpx BookSource Guide to Chinese webpage

#sidebar: false
#aside: false
#editLink: false
#lastUpdated: false
prev: false
next: false
comment: false
#friendLink: false

repos:
  - name: Linpx BookSource
    icon: /img/BookSourceLinpx.png
    desc: The ultimate reading experience for Linpx.
    link: https://github.com/DowneyRem/PixivSource
    prerelease: false
    recommend: linpx
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


# Linpx BookSource
#### 🅿️ [Legado](https://github.com/Luoyacheng/legado) Linpx BookSource
#### ✈️ Telegram Channel [@PixivSource](https://t.me/PixivSource)
</div>


> [!WARNING]
>
> ⚠️ **You are viewing this documentation on GitHub, which may be incomplete.
> The [Web Version](https://pixivsource.pages.dev/en/Linpx)
> offers more comprehensive content and better formatting.**


> [!NOTE]
> Linpx as an independent mirror site for novels hosted on Pixiv, specifically catering to the Chinese furry community. 
> 
> For users proficient in Chinese, please refer to the detailed configuration and usage instructions here:
> [Linpx BookSource Guide](https://pixivsource.pages.dev/Linpx).


<!--@include: CommonImport.md-->
