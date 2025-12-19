let source = [
    {"🅿️ 登录账号": "login()" },
    {"⚙️ 账号设置": "startPixivSettings()" },
    {"🔙 退出账号": "logout()" },
    {"🆙 更新书源": "updateSource()" },
    {"🔰 使用指南": "startGithubReadme()" },
    {"🚫 ✈️ 直连模式": "editSettings('IPDirect')" },
]

let settings = [
    {"书源设置": "text" },
    {"⚙️ 当前设置": "showSettings()" },
    {"🔧 默认设置": "setDefaultSettingsLoginUrl()" },
    {"🀄 🚫 繁简通搜": "editSettings('CONVERT_CHINESE')" },

    {"🔗 🚫 原始链接": "editSettings('SHOW_ORIGINAL_LINK')" },
    {"🖼️ 🚫 常规质量": "editSettings('SHOW_CAPTIONS')" },
    {"🚫 🐞 调试模式": "editSettings('DEBUG')" },
]

let li = []
li = source.concat(settings)

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
        item.default = `${list[0]} `
        list.length = list.length - 1
        item.chars = list.map(char => `${char} `)
        item.action = Object.values(item)[0]
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