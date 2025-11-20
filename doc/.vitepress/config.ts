import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
    lang: "zh-CN",
    title: "Pixiv 书源",
    description: "适配 开源阅读 Legado 3.0 的 Pixiv 书源",
    base: "/PixivSource/",
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
        nav: [
            { text: "主页", link: "/" },
            { text: "Pixiv 书源", link: "/Pixiv" },
            { text: "Linpx 书源", link: "/Linpx" },
            { text: "赞助名单", link: "/Sponsor" }
        ],
        sidebar: [
            {
                text: "专用教程",
                items: [
                    { text: "Pixiv 书源", link: "/Pixiv" },
                    { text: "Linpx 书源", link: "/Linpx" },
                    { text: "兽人控小说站 书源", link: "/FurryNovel" },
                ]
            },
            {
                text: "通用教程",
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
                items: [
                    { text: "赞助名单", link: "/Sponsor" },
                ]
            }
        ],
        socialLinks: [
            { icon: "github", link: "https://github.com/DowneyRem/PixivSource" },
            { icon: "codeberg", link: "https://codeberg.org/DowneyRem/PixivSource" },
            { icon: "telegram", link: "https://t.me/PixivSource" },
        ]
    }
})