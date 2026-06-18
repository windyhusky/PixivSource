export const BLOG = "https://downeyrem.pages.dev/"

export const cnNav = [
    { text: "✍️ 博客", link: BLOG },
    { text: "🏠 主页", link: "/" },
    {
        text: "📌 站方功能",
        activeMatch: '/',
        items: [
            { text: "⬇️ 下载阅读", link: "/DownloadLegado" },
            { text: "🚀 一键导入", link: "/Import" },
        ],
    },
    {
        text: "📚 书源指南",
        activeMatch: '/',
        items: [
            { text: "✨ 臻享阅读", link: "/BetterExperience", activeMatch: '/' },
            { text: "⚡️️️ 快速开始", link: "/QuickStart" },
            { text: "💾 备份恢复", link: "/WebdavBackup" , activeMatch: '/' },
            { text: "🅿️ Pixiv 书源", link: "/Pixiv" },
            { text: "🦊 Linpx 书源", link: "/Linpx" },
            { text: "🐯 兽人小说站", link: "/FurryNovel" },
        ],
    },
    {
        text: "📖 阅读指南",
        items: [
            { text: "📚 软件合集", link: "/Download" },
            { text: "🚀 导入书源", link: "/ImportBookSource" },
            { text: "🚀 导入订阅", link: "/ImportRssSource" },
            { text: "💾 备份恢复", link: "/WebdavBackup" , activeMatch: '/' },
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
]

export const cnSidebar = [
    {
        text: "站方功能",
        collapsed: false,
        items: [
            { text: "⬇️ 下载阅读", link: "/DownloadLegado" },
            { text: "🚀 一键导入", link: "/Import" },
        ]
    },
    {
        text: "快速开始",
        collapsed: false,
        items: [
            { text: "✨ 臻享阅读", link: "/BetterExperience" },
            { text: "⚡️️️ 快速开始", link: "/QuickStart" },
        ]
    },
    {
        text: "功能手册",
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
            { text: "📚 软件合集", link: "/Download" },
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
            { text: "💵 打赏记录", link: `${BLOG}Sponsor` },
        ]
    },
]