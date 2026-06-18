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
