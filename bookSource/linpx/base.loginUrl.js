function login() {}

function getNovel() {
    let novel = {}
    novel.id = chapter.url.match(/\d+/)[0]
    novel.title = chapter.title
    novel.userName = book.author.replace("@", "")
    if (book.tocUrl.includes("series")) {
        novel.seriesId = book.tocUrl.match(/\d+/)[0]
        novel.seriesTitle = book.name
    } else {
        novel.seriesId = 0
        novel.seriesTitle = ""
    }

    let resp = getAjaxJson(urlNovelDetailed(novel.id))
    novel.userId = resp.userId
    if (!novel.seriesId && resp.series) {
        novel.seriesId = resp.series.id
        novel.seriesTitle = resp.series.title
    }
    return novel
}

function shareFactory(type) {
    let novel = getNovel()
    if (!novel) return sleepToast("🔰 功能提示\n\n⚠️ 请在小说阅读页面，使用本功能")
    if (type.includes("author")) {
        sleepToast("\n\n已复制当前作者链接", 1)
        java.copyText(urlUserUrl(novel.userId))
        startBrowser(urlUserUrl(novel.userId), novel.userName)
    }
    else if (type.includes("novel")) {
        sleepToast("\n\n已复制当前小说链接", 1)
        java.copyText(urlNovelUrl(novel.id))
        startBrowser(urlNovelUrl(novel.id), novel.title)
    }
    else if (type.includes("pixiv") && !novel.seriesId) {
        sleepToast("\n\n已复制当前小说系列 Pixiv 链接", 1)
        java.copyText(urlSourceUrl(novel.id))
        startBrowser(urlSourceUrl(novel.id), novel.title)
    }
    else if (type.includes("pixiv") && novel.seriesId) {
        sleepToast("\n\n已复制当前小说系列 Pixiv 链接", 1)
        java.copyText(urlSeriesUrl(novel.seriesId))
        startBrowser(urlSeriesUrl(novel.seriesId), novel.seriesTitle)
    }
}

function startGithubReadme() {
    startBrowser("https://downeyrem.github.io/PixivSource/Linpx", "使用指南")
}
function startGithubIssue() {
    startBrowser("https://github.com/DowneyRem/PixivSource/issues", "反馈问题")
}

function checkStatus(status) {
    if (eval(String(status)) === true) return "❤️"
    else return "🖤"
}

let settingsName = {
    "SEARCH_AUTHOR": "🔍 搜索作者",
    "CONVERT_CHINESE": "🀄️ 繁简通搜",
    "MORE_INFORMATION": "📖 更多简介",
    "SHOW_ORIGINAL_LINK": "🔗 原始链接",
    "REPLACE_TITLE_MARKS": "📚 恢复《》",
    "SHOW_CAPTIONS": "🖼️ 显示描述",
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
    let settings = getFromCacheObject("linpxSettings")
    keys = Object.keys(settingsName)
    for (let i in keys) {
        msgList.push(`${statusMsg(settings[keys[i]])}　${settingsName[keys[i]]}`)
    }
    return msgList.join("\n").trim()
}

function showSettings() {
    sleepToast(`\n⚙️ 当前设置\n\n${getSettingStatus()}`)
}

function setDefaultSettingsLoginUrl() {
    setDefaultSettings()
    sleepToast(`\n✅ 已恢复　🔧 默认设置\n\n${getSettingStatus()}`)
}

function editSettings(settingName) {
    let msg, status
    let settings = getFromCacheObject("linpxSettings")
    if (!settings) settings = setDefaultSettings()
    if (!!settings[settingName]) {
        status = settings[settingName] = !settings[settingName]
    } else {
        status = settings[settingName] = true
    }
    putInCache("linpxSettings", settings)
    msg = `\n\n${statusMsg(status)}　${settingsName[settingName]}`
    sleepToast(msg)
}
