import { defineConfig, type HeadConfig } from "vitepress"
import markdownItAnchor from 'markdown-it-anchor'
import timeline from "vitepress-markdown-timeline";

// 动态判断环境
// Cloudflare Pages 默认提供 CF_PAGES 环境变量
const isCF = process.env.CF_PAGES === '1' || process.env.PLATFORM === 'cloudflare'
// GitHub 部署在 /PixivSource/，Cloudflare 通常部署在根目录 /
const BASE = isCF ? '/' : '/PixivSource/'
const HOSTNAME = isCF ? 'https://pixivsource.pages.dev/' : 'https://downeyrem.github.io/PixivSource/'
const BLOG = isCF ? 'https://downeyrem.pages.dev' : 'https://downeyrem.github.io'

// 规范网址始终指向 CF Pages（主站）
const CANONICAL_BASE = 'https://pixivsource.pages.dev'


// https://vitepress.dev/reference/site-config
export default defineConfig({
    lang: "zh-CN",
    title: "Pixiv 书源",
    description: "适配 开源阅读 Legado 3.0 的 Pixiv 书源",
    base: BASE,  // 项目名称
    cleanUrls: true,        // 简洁URL
    ignoreDeadLinks: true,  // 忽略死链
    appearance: true,       // 默认主题由用户配色方案决定
    lastUpdated: true,      // 获取页面最后更新的时间戳
    head: [
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

    // 每页动态注入 canonical，GitHub Pages 额外注入跳转
    transformHead({ pageData }) {
        const path = pageData.relativePath
            .replace(/index\.md$/, '')
            .replace(/\.md$/, '')

        const canonicalUrl = `${CANONICAL_BASE}/${path}`

        const heads: HeadConfig[] = [
            ['link', { rel: 'canonical', href: canonicalUrl }]
        ]

        // GitHub Pages 构建时，注入跳转到 CF Pages（主站）
        if (!isCF) {
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
        returnToTopLabel: "回到顶部",
        nav: [
            { text: "✍️ 博客", link: BLOG },
            { text: "🏠 主页", link: "/" },
            {
                text: "📌 使用指南",
                activeMatch: '/',
                items: [
                    { text: "✨ 臻享阅读", link: "/BetterExperience", activeMatch: '/' },
                    { text: "⚡️️️ 快速开始", link: "/QuickStart" },
                    { text: "💾 备份恢复", link: "/WebdavBackup" , activeMatch: '/' },
                    { text: "🅿️ Pixiv 书源", link: "/Pixiv" },
                    { text: "🦊 Linpx 书源", link: "/Linpx" },
                ],
            },
            {
                text: "📖 阅读指南",
                items: [
                    { text: "⬇️ 下载阅读", link: "/Download" },
                    { text: "🚀 导入书源", link: "/ImportBookSource" },
                    { text: "💾 备份恢复", link: "/WebdavBackup" },
                    { text: "☁️ 远程书籍", link: "/RemoteBooks" },
                    { text: "🛠️ 故障排查", link: "/TroubleShoot" }
                ],
            },
            {
                text: "🚧 开发动态",
                items: [
                    { text: "📜 更新日志", link: "/UpdateLog" },
                    { text: "👥 开发团队", link: "/Team" },
                    { text: "🤝 友情链接", link: "/FriendLink" },
                    { text: "☕ 支持开发", link: "/Sponsor" , activeMatch: '/' },
                    { text: "✍️ 作者博客", link: BLOG },
                ],
            },
        ],
        lightModeSwitchTitle: "浅色模式",
        darkModeSwitchLabel: '深色模式',
        sidebarMenuLabel: "菜单",
        sidebar: [
            {
                text: "快速开始",
                collapsed: false,
                items: [
                    { text: "✨ 臻享阅读", link: "/BetterExperience" },
                    { text: "⚡️️️ 快速开始", link: "/QuickStart" },
                ]
            },
            {
                text: "专用教程",
                collapsed: false,
                items: [
                    { text: "🅿️ Pixiv 书源", link: "/Pixiv" },
                    { text: "🦊 Linpx 书源", link: "/Linpx" },
                    { text: "🐯 兽人控小说站 书源", link: "/FurryNovel" },
                ]
            },
            {
                text: "通用教程",
                collapsed: true,
                items: [
                    { text: "⬇️ 下载阅读", link: "/Download" },
                    { text: "🚀 导入书源", link: "/ImportBookSource" },
                    { text: "🚀 导入订阅", link: "/ImportRssSource" },
                    { text: "💾 备份恢复", link: "/WebdavBackup" },
                    { text: "☁️ 远程书籍", link: "/RemoteBooks" },
                    { text: "🛠️ 故障排查", link: "/TroubleShoot" }
                ]
            },
            {
                text: "开发动态",
                collapsed: false,
                items: [
                    { text: "📜 更新日志", link: "/UpdateLog" },
                    { text: "🌱 项目起源", link: "/Beginning" },
                    { text: "👥 开发团队", link: "/Team" },
                    { text: "🤝 友情链接", link: "/FriendLink" },
                ]
            },
            {
                text: "打赏记录",
                collapsed: false,
                items: [
                    { text: "☕ 支持开发", link: "/Sponsor" },
                    { text: "💵 打赏记录", link: `${BLOG}/Sponsor/Source` },
                ]
            },
        ],
        socialLinks: [
            { icon: "github", link: "https://github.com/DowneyRem/PixivSource" },
            { icon: "codeberg", link: "https://codeberg.org/DowneyRem/PixivSource" },
            { icon: "telegram", link: "https://t.me/PixivSource" },
        ],
        lastUpdated: { text: '上次更新'},
        editLink: {
            pattern: "https://github.com/DowneyRem/PixivSource/blob/main/doc/:path",
            text: "在 GitHub 上编辑本文"
        },
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },
        footer: {
            // message: 'Released under the <a href="https://github.com/vuejs/vitepress/blob/main/LICENSE">MIT License</a>.',
            copyright: `Copyright © 2025-${new Date().getFullYear()} <a href="https://github.com/DowneyRem/PixivSource">PixivSource</a> All rights reserved.`
        },
        search: {
            provider: "local",
            options: {
                translations: {
                    button: {
                        buttonText: "搜索文档",
                        buttonAriaLabel: "搜索文档"
                    },
                    modal: {
                        noResultsText: "无法找到相关结果",
                        resetButtonTitle: "清除查询条件",
                        footer: {
                            selectText: "选择",
                            navigateText: "切换",
                            closeText: "Esc 键",
                        }
                    }
                }
            }
        }
    },
    markdown: {
        lineNumbers: true, // 行号显示
        config: (md) => {
            // 1. 锚点配置
            md.use(markdownItAnchor, {
                slugify: (s:string) => s,
                // slugify: (s:string) => s.replace(/[，。、？！《》—…]/gm, ""),
                // slugify: (s:string) => s.replace("、", ""),
                permalink: false   // 显示锚点符号
            })
            md.use(timeline);

            // 2. 图片渲染规则：懒加载 & 异步解码
            md.renderer.rules.image = (tokens, idx, options, env, self) => {
                const token = tokens[idx]
                token.attrSet('loading', 'lazy')    // 开启懒加载
                token.attrSet('decoding', 'async')  // 异步渲染图片
                return self.renderToken(tokens, idx, options)
            }

            // 3. 链接渲染规则：处理站内导入链接
            // 优化导入链接，站内使用 legado:// 链接，github 使用原始链接
            const defaultRender = md.renderer.rules.link_open || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))
            md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
                const hrefIndex = tokens[idx].attrIndex("href")
                if (hrefIndex >= 0) {
                    const hrefAttr = tokens[idx].attrs![hrefIndex] // 添加了非空断言
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
        hostname: HOSTNAME,
        lastmodDateOnly: true,  // print date not time
        xmlns: {   //精简 xmlns
            news: false, // flip to false to omit the xml namespace for news
            xhtml: false,
            image: false,
        }
    }
})
