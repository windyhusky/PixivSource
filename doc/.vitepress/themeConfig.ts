export const cnThemeConfig = {
    lightModeSwitchTitle: "浅色模式",
    darkModeSwitchLabel: '深色模式',
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "回到顶部",
    outline: {
        level: [2, 3],     // H2 H3 标题
        label: '本页目录'
    },
    editLink: {
        pattern: "https://github.com/DowneyRem/PixivSource/blob/main/doc/:path",
        text: "在 GitHub 上编辑本文"
    },
    lastUpdated: { text: '上次更新'},
    docFooter: {
        prev: '上一页',
        next: '下一页'
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
}

export const twThemeConfig = {
    lightModeSwitchTitle: "淺色模式",
    darkModeSwitchLabel: '深色模式',
    sidebarMenuLabel: "選單",
    returnToTopLabel: "回到頂部",
    outline: {
        level: [2, 3],
        label: '本頁目錄'
    },
    editLink: {
        pattern: "https://github.com/DowneyRem/PixivSource/blob/main/doc/:path",
        text: "在 GitHub 上編輯本文"
    },
    lastUpdated: { text: '上次更新時間' },
    docFooter: {
        prev: '上一頁',
        next: '下一頁'
    },
    search: {
        provider: "local",
        options: {
            translations: {
                button: {
                    buttonText: "搜尋文件",
                    buttonAriaLabel: "搜尋文件"
                },
                modal: {
                    noResultsText: "找不到相關結果",
                    resetButtonTitle: "清除搜尋條件",
                    footer: {
                        selectText: "選擇",
                        navigateText: "切換",
                        closeText: "Esc 鍵"
                    }
                }
            }
        }
    }
}