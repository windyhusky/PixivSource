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
        ["link", { rel: "icon", href: "/PixivSource/favicon.png" }],
        ["link", { rel: "apple-touch-icon", href: "/PixivSource/apple-touch-icon.png" }],
        // ["link", { rel: "manifest", href: "/manifest.json" }]
        ["script", { 
            async: "", src: "https://www.googletagmanager.com/gtag/js?id=G-MJW9QDKTDH" }],
        ["script", {},
            `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag("js", new Date());
            gtag("config", "TAG_ID");`
            ],
        ],
    themeConfig: {
        logo: "/favicon.png",
        // siteTitle: false,   // 隐藏站点标题
        outline: [2, 3],
        nav: [
            { text: "主页", link: "/" },
            { text: "快速开始", link: "/QuickStart" },
            { text: "Pixiv 书源", link: "/Pixiv" },
            { text: "Linpx 书源", link: "/Linpx" },
            { text: "赞助名单", link: "/Sponsor" }
        ],
        sidebar: [
            {
                text: "快速开始",
                collapsed: false,
                items: [{ text: "快速开始", link: "/QuickStart" }]
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
                collapsed: false,
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
                text: "赞助名单",
                collapsed: false,
                items: [{ text: "赞助名单", link: "/Sponsor" }]
            }
        ],
        socialLinks: [
            { icon: "github", link: "https://github.com/DowneyRem/PixivSource" },
            { icon: "codeberg", link: "https://codeberg.org/DowneyRem/PixivSource" },
            { icon: "telegram", link: "https://t.me/PixivSource" },
        ],
        editLink: { 
            pattern: "https://github.com/DowneyRem/PixivSource/blob/main/doc/:path",
            text: "在 GitHub 上编辑本文"
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