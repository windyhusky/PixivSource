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
        // startBrowser(urlUserUrl(novel.userId), novel.userName)
    }
    else if (type.includes("novel")) {
        sleepToast("\n\n已复制当前小说链接", 1)
        java.copyText(urlNovelUrl(novel.id))
        // startBrowser(urlNovelUrl(novel.id), novel.title)
    }
    else if (type.includes("pixiv") && !novel.seriesId) {
        sleepToast("\n\n已复制当前小说系列 Pixiv 链接", 1)
        java.copyText(urlSourceUrl(novel.id))
        // startBrowser(urlSourceUrl(novel.id), novel.title)
    }
    else if (type.includes("pixiv") && novel.seriesId) {
        sleepToast("\n\n已复制当前小说系列 Pixiv 链接", 1)
        java.copyText(urlSeriesUrl(novel.seriesId))
        // startBrowser(urlSeriesUrl(novel.seriesId), novel.seriesTitle)
    }
}

function startGithubReadme() {
    startBrowser("https://pixivsource.pages.dev/Linpx", "使用指南")
}
function startGithubIssue() {
    startBrowser("https://github.com/DowneyRem/PixivSource/issues", "反馈问题")
}

function checkStatus(status) {
    if (eval(String(status)) === true) return "❤️"
    else return "🖤"
}

let settingsNames = {
    "SEARCH_AUTHOR": "🔍 搜索作者",
    "CONVERT_CHINESE": "🀄️ 繁简通搜",
    "MORE_INFORMATION": "📖 更多简介",
    "SHOW_ORIGINAL_LINK": "🔗 原始链接",
    "REPLACE_TITLE_MARKS": "📚 恢复《》",
    "SHOW_CAPTIONS": "📑 显示描述",
    "DEBUG": "🐞 调试模式",
    "PIC_SOURCE": "🖼️ 图片解析",
    "PIC_LINK": "🖼️ 图片链接",
}
let settingsOptionsNames = {
    "PIC_SOURCE": {
        "PixivShojo": "📄 PixivShojo",
        "Pixiv": "🅿️ Pixiv 直连",
        "PixivCat": "🐱 PixivCat",
    },
    "PIC_LINK": {
        "PixivShojo": "📄 PixivShojo",
        "Pixiv": "🅿️ Pixiv 直连",
        "Linpx": "🦊 Linpx 网站",
        "PixivCat": "🐱 PixivCat",
        "CloudFlare": "☁️ CloudFlare",
    }
}

function statusMsg(status) {
    if (status === true) return "✅ 已开启"
    else if (status === false) return "🚫 已关闭"
    else if (status === undefined) return "🈚️ 未设置"
    else return status
}

// 检测快速模式修改的4个设置
function getSettingStatus(mode) {
    if (mode === undefined) mode = ""
    let msgList = []
    let settings = getFromCacheObject("linpxSettings")
    Object.keys(settingsNames).forEach(key => {
        if (key.startsWith("PIC")) {
            let settingsValue = settings[key]
            let settingsValueName = settingsOptionsNames[key][settingsValue]
            msgList.push(`${settingsNames[key]}　${statusMsg(settingsValueName)}`)
        } else {
            msgList.push(`${settingsNames[key]}　${statusMsg(settings[key])}`)
        }
    })
    return msgList.join("\n").trim()
}

function showSettings() {
    sleepToast(`\n⚙️ 当前设置\n\n${getSettingStatus()}`)
}

function setDefaultSettingsLoginUrl() {
    setDefaultSettings()
    sleepToast(`\n✅ 已恢复　🔧 默认设置\n\n${getSettingStatus()}`)
}

function editSettings(settingKey) {
    let msg, status
    let settings = getFromCacheObject("linpxSettings")
    if (!settings) settings = setDefaultSettings()

    if (settingKey.startsWith("PIC")) {
        let settingName = settingsNames[settingKey]
        let optionsKeys = Object.keys(settingsOptionsNames[settingKey])

        let current = settings[settingKey]
        let currentIndex = optionsKeys.indexOf(current) || 0
        if (currentIndex === -1) currentIndex = 0
        let nextIndex =  (currentIndex + 1) % optionsKeys.length
        let nextKey = settings[settingKey] = optionsKeys[nextIndex]
        let nextValue = settingsOptionsNames[settingKey][nextKey]
        msg = `\n${settingName}\n\n${nextValue}`
        
    } else {
        if (!!settings[settingKey]) {
            status = settings[settingKey] = !settings[settingKey]
        } else {
            status = settings[settingKey] = true
        }
        msg = `\n\n${statusMsg(status)}　${settingsNames[settingKey]}`
    }

    putInCacheObject("linpxSettings", settings)
    sleepToast(msg)
}
