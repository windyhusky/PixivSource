let settings = getFromCacheObject("linpxSettings")
if (!settings) settings = setDefaultSettings()
let environment = getFromCacheObject("pixivEnvironment")
const BOOK = typeof book !== 'undefined' && !!book

let source = [
    {"🆙 更新书源": "updateSource()" },
    {"🔰 使用指南": "startGithubReadme()" },
    {"🐞 反馈问题": "startGithubIssue()" },
]

let novel = [
    {"章节名称": "text" },
    {"⤴️ 分享章节": "shareFactory('novel')" },
    {"⤴️ 分享作者": "shareFactory('author')" },
    {"🅿️ 分享小说": "shareFactory('pixiv')" },
]

let settingBase = []
if (BOOK) {
    settingBase = [
        {"👀 🚫 书源菜单": `editSettings('SHOW_SETTINGS2')` },
        {"👀 🚫 发现菜单": `editSettings('SHOW_DISCOVER2')` },
        {"🐞 🚫 调试模式": "editSettings('DEBUG')" },
    ]
} else {
    settingBase = [
        {"💾 备份恢复": "backupRestore()" },
        {"👀 🚫 书源菜单": `editSettings('SHOW_SETTINGS')` },
        {"👀 🚫 发现菜单": `editSettings('SHOW_DISCOVER')` },
    ]
}

let setting = [
    {"书源设置": "text" },
    {"⚙️ 当前设置": "showSettings()" },
    {"🔧 默认设置": "setDefaultSettingsLoginUrl()" },
    {"🐞 🚫 调试模式": "editSettings('DEBUG')" },

    {"👤 🚫 搜索作者": "editSettings('SEARCH_AUTHOR')" },
    {"🀄 🚫 繁简通搜": "editSettings('CONVERT_CHINESE')" },
    {"📖 🚫 更多简介": "editSettings('MORE_INFORMATION')" },

    {"🔗 🚫 原始链接": "editSettings('SHOW_ORIGINAL_LINK')" },
    {"📚 🚫 恢复《》": "editSettings('REPLACE_TITLE_MARKS')" },
    {"🖼️ 🚫 显示描述": "editSettings('SHOW_CAPTIONS')" },

    {"⏳ 图片解析": "editSettings('PIC_SOURCE')" },
    {"🔗 图片链接": "editSettings('PIC_LINK')" },
    {"↔️ 图片大小": "editSettings('PIC_SIZE')" },
]

let discoverSetting = [
    {"发现设置": "text" },
    {"🔍 当前发现": "showSettingsDiscover()" },
    {"🔞 🚫 默认发现": "editSettings('SHOW_ADULT')" },
    {"📚 🚫 书源相关": "editSettings('SHOW_ABOUT')" },
]

// 添加按钮
if (BOOK) {
    li = source.concat(settingBase).concat(novel)
    if (settings.SHOW_SETTINGS2) li = li.concat(setting)
    if (settings.SHOW_DISCOVER2) li = li.concat(discoverSetting)
} else {
    li = source.concat(settingBase)
    if (settings.SHOW_SETTINGS) li = li.concat(setting)
    if (settings.SHOW_DISCOVER) li = li.concat(discoverSetting)
}

// 处理按钮
li.forEach(item => {
    item.name = Object.keys(item)[0]
    if (!environment?.IS_LEGADO_SIGMA) {
        item.name = item.name.replace(/🚫 |⚫️ |㊙️ /g, "")
    }

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
        item.default = settings[settingName] ? list[0] : list[1]

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