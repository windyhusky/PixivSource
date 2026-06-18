import { defineConfig, type HeadConfig } from "vitepress"
import { withPwa } from '@vite-pwa/vitepress'
import timeline from "vitepress-markdown-timeline"
import { cnNav, cnSidebar } from './navSideBar.ts'
import twConfig from '../zh-TW/config.zh-TW.json' with { type: 'json' }
import { cnThemeConfig, twThemeConfig } from "./themeConfig.ts"
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
    head: [
        ['meta', { name: 'keywords', content: 'Pixiv 小说, Pixiv 阅读, Pixiv 书源, 阅读书源, Legado 书源, 开源阅读 Pixiv 书源, Pixiv 小说阅读器, 阅读3书源, Pixiv Source, Pixiv BookSource' }],
        // og:title / og:description 已移至 transformHead，由各页面 frontmatter 动态生成

        // 使用相对路径或动态 Base 确保图标加载正确
        ['link', { rel: 'icon', type: 'image/png', sizes: '64x64', href: `${BASE}favicon.png` }],
        ["link", { rel: "apple-touch-icon", sizes: '180x180', href: `${BASE}favicon-180x180.png` }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: `${BASE}favicon-192x192.png` }],

        ["link", { rel: "preconnect", href: "https://www.googletagmanager.com" }],
        ["link", { rel: "preconnect", href: "https://www.google-analytics.com" }],

        // ["link", { rel: "manifest", href: "/manifest.json" }]
        ["script", {
            async: "", src: "https://www.googletagmanager.com/gtag/js?id=G-MJW9QDKTDH" }],
        ["script", {},
            `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag("js", new Date());
            gtag("config", "G-MJW9QDKTDH");`
        ],
    ],

    locales: {
        root: {
            label: '简体中文',
            lang: 'zh-CN',
            title: "Pixiv 书源",
            description: "适配 开源阅读 Legado 3.0 的 Pixiv 书源",
            themeConfig :{
                nav: cnNav,
                sidebar: cnSidebar,
                ...cnThemeConfig
            }
        },
        "zh-TW": {
            label: '繁體中文',
            lang: 'zh-TW',
            link: '/zh-TW/',
            title: "Pixiv 書源",
            description: "適配 開源閲讀 Legado 3.0 的 Pixiv 書源",
            themeConfig :{
                nav: twConfig.nav,
                sidebar: twConfig.sidebar,
                ...twThemeConfig
            }
        },
        // en: {
        //     label: 'English',
        //     lang: 'en-US',
        //     title: "PixivSource",
        //     link: '/en/',
        // }
    },
    // 每页动态注入 canonical 和 og 标签，GitHub Pages 构建时额外注入跳转
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
    markdown: {
        lineNumbers: true, // 行号显示
        // ✅ 通过 VitePress 原生入口配置锚点，避免与内置插件重复注册
        anchor: {
            slugify: (s: string) => s,
            permalink: false,
        },
        config: (md) => {
            md.use(timeline)

            // 网页去除 Github 警告
            const originalParse = md.parse;
            md.parse = (src, env) => {
                const targetRegex1 = />\s*\[!WARNING\][\s\S]*?你正在\s*GitHub\s*上浏览此文档[\s\S]*?排版更精美\*\*/g;
                const targetRegex2 = />\s*\[!WARNING\][\s\S]*?你正在\s*GitHub\s*上瀏覽此文件[\s\S]*?排版更精美\*\*/g;
                const cleanedSrc = src.replace(targetRegex1, '').replace(targetRegex2, '');
                return originalParse.call(md, cleanedSrc, env);
            }

            // 图片渲染规则：懒加载 & 异步解码
            md.renderer.rules.image = (tokens, idx, options, env, self) => {
                const token = tokens[idx]
                token.attrSet('loading', 'lazy')    // 开启懒加载
                token.attrSet('decoding', 'async')  // 异步渲染图片
                return self.renderToken(tokens, idx, options)
            }

            // 链接渲染规则：处理站内导入链接
            const defaultRender = md.renderer.rules.link_open || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))
            md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
                const hrefIndex = tokens[idx].attrIndex("href")
                if (hrefIndex >= 0) {
                    const hrefAttr = tokens[idx].attrs![hrefIndex]
                    let href = hrefAttr[1]
                    // @ts-ignore
                    if (href.startsWith("https://loyc.xyz/b/cdx.html?src=")) {
                        hrefAttr[1] = href.replace("https://loyc.xyz/b/cdx.html?src=", "")
                    }
                }
                return defaultRender(tokens, idx, options, env, self);
            };
        }
    },
    sitemap: {
        hostname: CANONICAL_BASE,
        lastmodDateOnly: true,  // print date not time
        xmlns: {   // 精简 xmlns
            news: false,
            xhtml: false,
            image: false,
        }
    },

    buildEnd(siteConfig) {
        // 1. 生成 robots.txt
        const robots = isCF
            ? `User-agent: *\nAllow: /\n\nSitemap: https://pixivsource.pages.dev/sitemap.xml\n`
            : `User-agent: *\nDisallow: /\n`
        writeFileSync(resolve(siteConfig.outDir, 'robots.txt'), robots)

        // 2. 生成 Cloudflare _redirects (仅在 CF 平台执行)
        if (isCF) {
            const rules: string[] = []
            // 手动重定向放最前面，优先级最高
            rules.push(`/ReadMe  /  301`)
            rules.push(`/readme  /  301`)

            const getFiles = (dir: string) => {
                const files = readdirSync(dir)
                for (const file of files) {
                    const fullPath = resolve(dir, file)

                    if (statSync(fullPath).isDirectory()) {
                        getFiles(fullPath)
                    } else if (file.endsWith('.html')) {
                        let relPath = relative(siteConfig.outDir, fullPath)
                        relPath = relPath.replace(/\\/g, '/')
                        relPath = relPath.replace(/index\.html$/, '').replace(/\.html$/, '')

                        let urlPath = relPath.startsWith('/') ? relPath : '/' + relPath
                        if (urlPath.length > 1 && urlPath.endsWith('/')) {
                            urlPath = urlPath.slice(0, -1)
                        }

                        const lowerPath = urlPath.toLowerCase()
                        if (urlPath !== lowerPath) {
                            rules.push(`${lowerPath}  ${urlPath}  301`)
                        }
                    }
                }
            }

            getFiles(siteConfig.outDir)
            if (rules.length > 0) {
                writeFileSync(resolve(siteConfig.outDir, '_redirects'), rules.join('\n'))
                console.log(`\n\x1b[32m✓\x1b[0m 已成功生成 _redirects 文件，包含 ${rules.length} 条大小写重定向规则。`)
            }
        }
    },

    pwa: {
        outDir: '.vitepress/dist',
        base: BASE,
        registerType: 'autoUpdate',
        includeAssets: ['favicon.png', 'favicon-180x180.png', 'favicon-192x192.png'],
        manifest: {
            name: 'Pixiv 书源',
            short_name: 'PixivSource',
            description: '适配 开源阅读 Legado 3.0 的 Pixiv 书源',
            theme_color: '#009ff7',
            background_color: '#ffffff',
            display: 'standalone',
            start_url: BASE,
            scope: BASE,
            icons: [
                {
                    src: 'favicon-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: 'favicon-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'maskable',
                },
                {
                    src: 'favicon-180x180.png',
                    sizes: '180x180',
                    type: 'image/png',
                },                {
                    src: 'favicon-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
            ],
            screenshots: [
                {
                    src: 'screenshot-wide.png',
                    sizes: '1280x750',
                    type: 'image/png',
                    form_factor: 'wide',
                    label: 'Pixiv 书源 - 桌面版',
                },
                {
                    src: 'screenshot-mobile.png',
                    sizes: '390x760',
                    type: 'image/png',
                    form_factor: 'narrow',
                    label: 'Pixiv 书源 - 移动版',
                },
            ],
        },
        workbox: {
            globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}'],
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
    },
}))