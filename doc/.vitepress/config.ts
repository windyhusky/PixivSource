import { defineConfig, type HeadConfig } from "vitepress"
import { withPwa } from '@vite-pwa/vitepress'
import timeline from "vitepress-markdown-timeline"
import { cnNav, cnSidebar } from './navSideBar.js'
import twConfig from '../zh-TW/config.zh-TW.json' with { type: 'json' }
import { cnThemeConfig, twThemeConfig } from "./themeConfig.js"
import { writeFileSync, readdirSync, statSync } from 'fs'
import { resolve, relative } from 'path'

// 动态判断环境
// Cloudflare Pages 默认提供 CF_PAGES 环境变量
// GitHub Actions 默认提供 GITHUB_ACTIONS 环境变量
const isCF = process.env.CF_PAGES === '1' || process.env.PLATFORM === 'cloudflare'
const isGitHub = process.env.GITHUB_ACTIONS === 'true'

let HOSTNAME = "https://pixivsource.pages.dev/"
let BASE = "/"
if (isGitHub) {
    HOSTNAME = "https://downeyrem.github.io/PixivSource/"
    BASE = "/PixivSource/"
}

const CANONICAL_BASE = "https://pixivsource.pages.dev/"
const BLOG = "https://downeyrem.pages.dev/"


// https://vitepress.dev/reference/site-config
export default withPwa(defineConfig({
    lang: "zh-CN",
    base: BASE,  // 项目名称
    cleanUrls: true,        // 简洁URL
    srcExclude: ['**/*Common*.md'], // 公共 include 片段不作为独立页面渲染
    ignoreDeadLinks: true,  // 忽略死链
    appearance: true,       // 默认主题由用户配色方案决定
    lastUpdated: true,      // 获取页面最后更新的时间戳

    head: getHeadConfig(BASE),
    locales: localesConfig,
    markdown: markdownConfig,
    transformPageData,
    buildEnd: getBuildEndHook(isCF, isGitHub),

    // 独立控制动态 Head 元数据注入
    transformHead({ pageData }) {
        const path = pageData.relativePath
            .replace(/index\.md$/, '')
            .replace(/\.md$/, '')

        const canonicalUrl = `${CANONICAL_BASE}${path}`

        // 优先使用页面 frontmatter，回退到全局默认值
        const ogTitle = pageData.frontmatter.title ?? 'Pixiv 书源 - PixivSource'
        const ogDesc  = pageData.frontmatter.description ?? '用 Legado 开源阅读 App，像看网文一样阅读 Pixiv 上的小说'

        const heads: HeadConfig[] = [
            ['link',  { rel: 'canonical',         href: canonicalUrl }],
            ['meta',  { property: 'og:title',       content: ogTitle   }],
            ['meta',  { property: 'og:description', content: ogDesc    }],
        ]

        // 只有 GitHub Pages 构建时才注入跳转，本地开发不跳转
        if (isGitHub && !isCF) {
            heads.push(
                ['meta', { 'http-equiv': 'refresh', content: `0; url=${canonicalUrl}` }],
                ['script', {}, `window.location.replace("${canonicalUrl}")`]
            )
        }

        return heads
    },

    themeConfig: {
        logo: `${BASE}favicon.png`,
        // siteTitle: false,   // 隐藏站点标题
        outline: {
            level: [2, 3],     // H2 H3 标题
            label: '本页目录'
        },
        socialLinks: [
            { icon: "github", link: "https://github.com/DowneyRem/PixivSource" },
            { icon: "codeberg", link: "https://codeberg.org/DowneyRem/PixivSource" },
            { icon: "telegram", link: "https://t.me/PixivSource" },
        ],
        editLink: {
            pattern: "https://github.com/DowneyRem/PixivSource/blob/main/doc/:path",
        },
        // footer: {
        //     copyright: `Copyright © 2025-${new Date().getFullYear()} <a href="https://github.com/DowneyRem/PixivSource">PixivSource</a> All rights reserved.`
        // },
    },

    sitemap: {
        hostname: CANONICAL_BASE,
        lastmodDateOnly: true,
        xmlns: { news: false, xhtml: false, image: false }
    },

    pwa: getPwaConfig(BASE)
}))