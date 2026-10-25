let pixivSettings = getFromCacheObject("pixivIllustSettings")
if (!pixivSettings) pixivSettings = setDefaultSettings()

let source = [
    {"🅿️ 登录账号": "login()" },
    {"⚙️ 账号设置": "startPixivSettings()" },
    {"🔙 退出账号": "logout()" },

    {"🆙 更新书源": "updateSource()" },
    {"🔰 使用指南": "startGithubReadme()" },
    {"🐞 反馈问题": "startGithubIssue()" },
]

let settingsBase = [
    // {"🚫 ✈️ 直连模式": "editSettings('IPDirect')" },
    // {"🚫 ⏩ 快速模式": "editSettings('FAST')" },
    // {"🚫 🐞 调试模式": "editSettings('DEBUG')" },

    {"💾 备份恢复": "backupRestore()" },
    {"👀 🚫 书源菜单": `editSettings('SHOW_SETTINGS')` },
    {"👀 🚫 发现菜单": `editSettings('SHOW_DISCOVER')` },
]

let settings = [
    {"书源设置": "text" },
    {"⚙️ 当前设置": "showSettings()" },
    {"🔧 默认设置": "setDefaultSettingsLoginUrl()" },
    {"🐞 🚫 调试模式": "editSettings('DEBUG')" },

    {"🀄 🚫 繁简通搜": "editSettings('CONVERT_CHINESE')" },
    {"🔗 🚫 原始链接": "editSettings('SHOW_ORIGINAL_LINK')" },
    {"🖼️ 🚫 常规质量": "editSettings('QUALITY_REGULAR')" },

    // {"⏳ 图片解析": "editSettings('PIC_SOURCE')" },
    // {"🔗 图片链接": "editSettings('PIC_LINK')" },
    // {"↔️ 图片大小": "editSettings('PIC_SIZE')" },
]

let discoverSettings = [
    {"发现设置": "text" },
    {"🔍 当前发现": "showSettingsDiscover()" },
    {"🔞 🚫 默认发现": "editSettings('SHOW_ADULT')" },
    {"🆗 🚫 常规插画": "editSettings('SHOW_GENERAL')" },

    {"🔞 🚫 最新企划": "editSettings('SHOW_NEW_ADULT')" },
    {"🆗 🚫 最新企划": "editSettings('SHOW_NEW_GENERAL')" },
    {"🔞 🚫 排行榜单": "editSettings('SHOW_RANK_ADULT')" },

    {"🆗 🚫 排行榜单": "editSettings('SHOW_RANK_GENERAL')" },
    {"📚 🚫 书源相关": "editSettings('SHOW_ABOUT')" },
]

let li = []
li = source.concat(settingsBase)
if (pixivSettings.SHOW_SETTINGS) li = li.concat(settings)
if (pixivSettings.SHOW_DISCOVER) li = li.concat(discoverSettings)


// 处理按钮
li.forEach(item => {
    item.name = Object.keys(item)[0]
    let list = item.name.split(" ")
    if (list.length === 1 ) {
        item.type = "text"
    } else if (list.length === 2) {
        item.type = "button"
        item.action = Object.values(item)[0]
    } else {
        item.name = list[list.length - 1]
        item.type = "toggle"
        item.action = Object.values(item)[0]

        let settingName = item.action.split("'")[1]
        item.default = pixivSettings[settingName] ? list[0] : list[1]

        list.length = list.length - 1
        item.chars = list.map(char => `${char} `)
    }
    delete item[Object.keys(item)[0]]
    // 添加格式
    if (item.type === "button" || item.type === "toggle") {
        item.style = {}
        item.style.layout_flexGrow = 1
        item.style.layout_flexBasisPercent = -1
    }
})

JSON.stringify(li)