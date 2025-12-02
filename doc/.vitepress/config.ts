import { defineConfig } from "vitepress"
import markdownItAnchor from 'markdown-it-anchor'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    lang: "zh-CN",
    title: "Pixiv 书源",
    description: "适配 开源阅读 Legado 3.0 的 Pixiv 书源",
    base: "/PixivSource/",  // 项目名称
    cleanUrls: true,        // 简洁URL
    ignoreDeadLinks: true,  // 忽略死链
    appearance: true,       // 默认主题由用户配色方案决定
    lastUpdated: true,      // 获取页面最后更新的时间戳
    head: [
        ['link', { rel: 'icon', type: 'image/png', sizes: '64x64', href: '/favicon.png' }],
        ["link", { rel: "apple-touch-icon", sizes: '180x180', href: "/PixivSource/favicon-180x180.png" }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/PixivSource/favicon-192x192.png' }],
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
    themeConfig: {
        logo: "/favicon.png",
        // siteTitle: false,   // 隐藏站点标题
        outline: {
            level: [2, 3],     // H2 H3 标题
            label: '本页目录'
        },
        returnToTopLabel: "回到顶部",
        nav: [
            { text: "主页", link: "/" },
            {
                text: "使用指南",
                activeMatch: '/',
                items: [
                    { text: "快速开始", link: "/QuickStart", activeMatch: '/' },
                    { text: "Pixiv 书源", link: "/Pixiv" },
                    { text: "Linpx 书源", link: "/Linpx" },
                    { text: "兽人控小说站 书源", link: "/FurryNovel" },
                ],
            },
            {
                text: "开发动态",
                activeMatch: '/',
                items: [
                    { text: "开发团队", link: "/Team", activeMatch: '/' },
                    { text: "更新日志", link: "/UpdateLog" },
                    { text: "归档声明", link: "/ArchivedNotice" },
                ],
            },
            { text: "打赏名单", link: "/Sponsor" }
        ],
        lightModeSwitchTitle: "",
        sidebarMenuLabel: "菜单",
        sidebar: [
            {
                text: "快速开始",
                collapsed: false,
                items: [
                    { text: "快速开始", link: "/QuickStart" }
                ]
            },
            {
                text: "专用教程",
                collapsed: false,
                items: [
                    { text: "Pixiv 书源", link: "/Pixiv" },
                    { text: "Linpx 书源", link: "/Linpx" },
                    { text: "兽人控小说站 书源", link: "/FurryNovel" },
                ]
            },
            {
                text: "通用教程",
                collapsed: true,
                items: [
                    { text: "下载阅读", link: "/Download" },
                    { text: "导入书源", link: "/ImportBookSource" },
                    { text: "导入订阅", link: "/ImportRssSource" },
                    { text: "远程书籍", link: "/RemoteBooks" },
                    { text: "备份恢复", link: "/WebdavBackup" },
                    { text: "故障排查", link: "/TroubleShoot" }
                ]
            },
            {
                text: "开发动态",
                collapsed: false,
                items: [
                    { text: "开发团队", link: "/Team" },
                    { text: "更新日志", link: "/UpdateLog" },
                    { text: "归档声明", link: "/ArchivedNotice" },
                ]
            },
            {
                text: "打赏记录",
                collapsed: false,
                items: [
                    { text: "打赏名单", link: "/Sponsor" },
                    { text: "打赏记录", link: "/Sponsor2" },
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
            copyright: 'Copyright © 2021-2025 <a href="https://github.com/DowneyRem/PixivSource">PixivSource</a> All rights reserved.'
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
        config: (md) => {
            // // 优化中文锚点，但无法兼容 Github
            md.use(markdownItAnchor, {
                slugify: (s:string) => s,
                // slugify: (s:string) => s.replace(/[，。、？！《》—…]/gm, ""),
                // slugify: (s:string) => s.replace("、", ""),
                permalink: false   // 显示锚点符号
            })

            // // 优化导入链接，站内使用 legado:// 链接，github 使用原始链接
            const defaultRender = md.renderer.rules.link_open || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))
            md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
                const hrefIndex = tokens[idx].attrIndex("href")
                if (hrefIndex >= 0) {
                    const hrefAttr = tokens[idx].attrs[hrefIndex]
                    let href = hrefAttr[1]
                    // @ts-ignore
                    if (href.startsWith("https://loyc.xyz/b/cdx.html?src=")) {
                        hrefAttr[1] = href.replace("https://loyc.xyz/b/cdx.html?src=", "")
                    }
                }
                return defaultRender(tokens, idx, options, env, self);
            };
        }
    }
})