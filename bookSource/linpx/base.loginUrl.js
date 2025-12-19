function login() {}

function getNovel() {
}

function shareFactory(type) {
    let novel = getNovel()
    if (novel === undefined || novel === null) return sleepToast("⚠️ 请在小说阅读页面，使用本功能")
    if (type.includes("author")) {
        startBrowser(urlUserUrl(novel.userId), novel.userName)
    }
    else if (type.includes("novel") || (!novel.seriesId)) {
        startBrowser(urlNovelUrl(novel.id), novel.title)
    }
    else if (type.includes("series") && novel.seriesId) {
        startBrowser(urlSeriesUrl(novel.seriesId), novel.seriesTitle)
    }
}

function startGithubReadme() {
    startBrowser("https://downeyrem.github.io/PixivSource/Pixiv", "使用指南")
}

function checkStatus(status) {
    if (eval(String(status)) === true) return "❤️"
    else return "🖤"
}

let settingsName = {
    "SEARCH_AUTHOR": "🔍 搜索作者",
    "SHOW_ORIGINAL_LINK": "🔗 原始链接",
    "CONVERT_CHINESE": "🀄️ 繁简通搜",
    "SHOW_UPDATE_TIME": "📅 更新时间",
    "SHOW_COMMENTS": "💬 显示评论",
    "MORE_INFORMATION": "📖 更多简介",
    "REPLACE_TITLE_MARKS": "📚 恢复《》",
    "SHOW_CAPTIONS": "🖼️ 显示描述",
    "SHOW_LIKE_NOVELS" :"❤️ 显示收藏",
    "SHOW_WATCHED_SERIES" :"📃 显示追更",
    "IPDirect": "✈️ 直连模式",
    "FAST": "⏩ 快速模式",
    "DEBUG": "🐞 调试模式",
}

function statusMsg(status) {
    if (status === true) return "✅ 已开启"
    else if (status === false) return "🚫 已关闭"
    else return "🈚️ 未设置"
}

// 检测快速模式修改的4个设置
function getSettingStatus(mode) {
    if (mode === undefined) mode = ""
    let keys = [], msgList = []
    let settings = getFromCache("pixivSettings")
    keys = Object.keys(settingsName)
    for (let i in keys) {
        msgList.push(`${statusMsg(settings[keys[i]])}　${settingsName[keys[i]]}`)
    }
    return msgList.join("\n").trim()
}

function showSettings() {
    sleepToast(`⚙️ 当前设置\n\n${getSettingStatus()}`)
}

function setDefaultSettingsLoginUrl() {
    setDefaultSettings()
    sleepToast(`\n✅ 已恢复　🔧 默认设置\n\n${getSettingStatus()}`)
}

function editSettings(settingName) {
    let msg, status
    let settings = getFromCache("pixivSettings")
    if (!settings) settings = setDefaultSettings()
    if (!!settings[settingName]) {
        status = settings[settingName] = !settings[settingName]
    } else {
        status = settings[settingName] = true
    }
    putInCache("pixivSettings", settings)
    msg = `\n${statusMsg(status)}　${settingsName[settingName]}`
    sleepToast(msg)
}
