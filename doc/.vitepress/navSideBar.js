export const BLOG = "https://downeyrem.pages.dev/"

export const cnNav = [
    { 
        text: "🏠 主页", 
        link: "/"
    },
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
        text: "Pixiv 书源",
        collapsed: false,
        items: [
            { text: "🆚 功能对比", link: "/PixivComparison" },
            { text: "⚙️ 书源设置", link: "/PixivSettings" },
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

export const twNav = [
    {
        text: "🏠 主頁",
        link: "/zh-TW/"
    },
    {
        text: "📌 站方功能",
        activeMatch: "/",
        items: [
            {
                text: "⬇️ 下載閱讀",
                link: "/zh-TW/DownloadLegado"
            },
            {
                text: "🚀 一鍵匯入",
                link: "/zh-TW/Import"
            }
        ]
    },
    {
        text: "📚 書源指南",
        activeMatch: "/",
        items: [
            {
                text: "✨ 臻享閱讀",
                link: "/zh-TW/BetterExperience",
                activeMatch: "/"
            },
            {
                text: "⚡️️️ 快速開始",
                link: "/zh-TW/QuickStart"
            },
            {
                text: "🅿️ Pixiv 書源",
                link: "/zh-TW/Pixiv"
            }
        ]
    },
    {
        text: "📖 閱讀指南",
        items: [
            {
                text: "📚 軟體合集",
                link: "/zh-TW/Download"
            },
            {
                text: "🚀 匯入書源",
                link: "/zh-TW/ImportBookSource"
            },
            {
                text: "🚀 匯入訂閱",
                link: "/zh-TW/ImportRssSource"
            },
            {
                text: "💾 備份恢復",
                link: "/zh-TW/WebdavBackup",
                activeMatch: "/"
            },
            {
                text: "☁️ 遠端書籍",
                link: "/zh-TW/RemoteBooks"
            },
            {
                text: "🛠️ 故障排查",
                link: "/zh-TW/TroubleShoot"
            }
        ]
    },
    {
        text: "🚧 開發動態",
        items: [
            {
                text: "📜 更新日誌",
                link: "/zh-TW/UpdateLog"
            },
            {
                text: "👥 開發團隊",
                link: "/zh-TW/Team"
            },
            {
                text: "🤝 友情連結",
                link: "/zh-TW/FriendLink"
            },
            {
                text: "☕ 支援開發",
                link: "/zh-TW/Sponsor",
                activeMatch: "/"
            },
            {
                text: "✍️ 作者部落格",
                link: BLOG
            }
        ]
    }
]

export const twSideBar = [
    {
        text: "站方功能",
        collapsed: false,
        items: [
            {
                text: "⬇️ 下載閱讀",
                link: "/zh-TW/DownloadLegado"
            },
            {
                text: "🚀 一鍵匯入",
                link: "/zh-TW/Import"
            }
        ]
    },
    {
        text: "快速開始",
        collapsed: false,
        items: [
            {
                text: "✨ 臻享閱讀",
                link: "/zh-TW/BetterExperience"
            },
            {
                text: "⚡️️️ 快速開始",
                link: "/zh-TW/QuickStart"
            }
        ]
    },
    {
        text: "功能手冊",
        collapsed: false,
        items: [
            {
                text: "🅿️ Pixiv 書源",
                link: "/zh-TW/Pixiv"
            },
            {
                text: "🦊 Linpx 書源",
                link: "/zh-TW/Linpx"
            },
            {
                text: "🐯 獸人控小說站 書源",
                link: "/zh-TW/FurryNovel"
            }
        ]
    },
    {
        text: "Pixiv 書源",
        collapsed: false,
        items: [
            {
                text: "🆚 功能對比",
                link: "/zh-TW/PixivComparison"
            },
            {
                text: "⚙️ 書源設定",
                link: "/zh-TW/PixivSettings"
            }
        ]
    },
    {
        text: "通用教程",
        collapsed: true,
        items: [
            {
                text: "📚 軟體合集",
                link: "/zh-TW/Download"
            },
            {
                text: "🚀 匯入書源",
                link: "/zh-TW/ImportBookSource"
            },
            {
                text: "🚀 匯入訂閱",
                link: "/zh-TW/ImportRssSource"
            },
            {
                text: "💾 備份恢復",
                link: "/zh-TW/WebdavBackup"
            },
            {
                text: "☁️ 遠端書籍",
                link: "/zh-TW/RemoteBooks"
            },
            {
                text: "🛠️ 故障排查",
                link: "/zh-TW/TroubleShoot"
            }
        ]
    },
    {
        text: "開發動態",
        collapsed: false,
        items: [
            {
                text: "📜 更新日誌",
                link: "/zh-TW/UpdateLog"
            },
            {
                text: "🌱 專案起源",
                link: "/zh-TW/Beginning"
            },
            {
                text: "👥 開發團隊",
                link: "/zh-TW/Team"
            },
            {
                text: "🤝 友情連結",
                link: "/zh-TW/FriendLink"
            }
        ]
    },
    {
        text: "打賞記錄",
        collapsed: false,
        items: [
            {
                text: "☕ 支援開發",
                link: "/zh-TW/Sponsor"
            },
            {
                text: "💵 打賞記錄",
                link: "https://downeyrem.pages.dev/Sponsor"
            }
        ]
    }
]
