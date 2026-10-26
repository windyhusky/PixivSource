function login() {}

function getNovel() {
    let novel = {}
    novel.bookId = book.bookUrl.match(/\d+/)[0]
    novel.bookName = book.name
    novel.userName = book.author.replace("@", "")

    let resp = getAjaxJson(urlNovelDetail(novel.bookId)).data
    novel.sourceUrl = urlSourceUrl(resp.source, resp.ext_data.oneshot, resp.source_id)
    sleepToast(JSON.stringify(novel, null, 4))
    return novel
}

function shareFactory(type) {
    let novel = getNovel()
    if (!novel) return sleepToast("🔰 功能提示\n\n⚠️ 请在小说阅读页面，使用本功能")
    if (type.includes("author")) {
        sleepToast("\n\n已复制当前作者链接", 1)
        java.copyText(urlUserUrl(novel.userName))
        // startBrowser(urlUserUrl(novel.userName), novel.userName)
    }
    else if (type.includes("novel")) {
        sleepToast("\n\n已复制当前小说详情链接", 1)
        java.copyText(urlNovelUrl(novel.bookId))
        // startBrowser(urlNovelUrl(novel.bookId), novel.bookName)
    }
    else if (type.includes("pixiv")) {
        sleepToast("\n\n已复制当前小说 Pixiv 链接", 1)
        java.copyText(novel.sourceUrl)
        // startBrowser(novel.sourceUrl, novel.bookName)
    }
}

function startGithubReadme() {
    startBrowser("https://pixivsource.pages.dev/FurryNovel", "使用指南")
}
function startGithubIssue() {
    startBrowser("https://github.com/DowneyRem/PixivSource/issues", "反馈问题")
}

function checkStatus(status) {
    if (eval(String(status)) === true) return "❤️"
    else return "🖤"
}

const serachSettingsName = {
    // "SEARCH_AUTHOR": "🔍 搜索作者",
    "CONVERT_CHINESE": "🀄️ 繁简通搜",
}
const detailSettingsName = {
    "MORE_INFORMATION": "📖 更多简介",
}
const catalogSettingsName = {
    // "ADD_CHAPTER_INDEX": "🔢 章节编号",
    // "SHOW_UPDATE_TIME": "📅 更新时间",
    "SHOW_ORIGINAL_LINK": "🔗 原始链接",
}
const contentSettingsName = {
    // "SHOW_CAPTIONS": "📄 显示描述",
    // "SHOW_PICTURES": "🖼️ 显示图片",
    // "SHOW_COMMENTS": "💬 显示评论",
    "REPLACE_TITLE_MARKS": "📚 恢复《》",
}
const modeSettingsName = {
    // "SWITCH_EMOJI": "🔀 切换表情",
    "DEBUG": "🐞 调试模式",
}
const pictureSettingsName = {
    "PIC_SOURCE": "⏳ 图片解析",
    "PIC_LINK": "🔗 图片链接",
    "PIC_SIZE": "↔️ 图片大小",
}
const novelSettingsName = Object.assign({},
    serachSettingsName,
    detailSettingsName,
    catalogSettingsName,
    contentSettingsName,
    modeSettingsName,
    pictureSettingsName
)
const discoverSettingsName ={
    "SHOW_ABOUT": "📚 书源相关",
}
const settingsName = Object.assign({},
    novelSettingsName,
    discoverSettingsName,
    // menuSettingsName
)
const settingsOptionsNames = {
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
    },
    "PIC_SIZE": {
        "original": "🔶 大 Original",
        "regular": "🀄️ 中 Regular",
        "small": "🔸 小 Small",
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
    let settings = getFromCacheObject("FNSettings")
    Object.keys(settingsName).forEach(key => {
        if (key.startsWith("PIC")) {
            let settingsValue = settings[key]
            let settingsValueName = settingsOptionsNames[key][settingsValue]
            msgList.push(`${settingsName[key]}　${statusMsg(settingsValueName)}`)
        } else {
            msgList.push(`${novelSettingsName[key]}　${statusMsg(settings[key])}`)
        }
    })
    return msgList.join("\n").trim()
}

function showSettings() {
    sleepToast(`\n⚙️ 当前设置\n\n${getSettingStatus()}`)
}

function setDefaultSettingsLoginUrl() {
    setDefaultSettings()
    sleepToast(`\n🔧 默认设置　✅ 已恢复\n\n${getSettingStatus()}`)
    refreshSettings("DEFAULT")
}

function editSettings(settingKey) {
    let msg, status
    let settings = getFromCacheObject("FNSettings")
    if (!settings) settings = setDefaultSettings()

    if (settingKey.startsWith("PIC")) {
        let settingName = settingsName[settingKey]
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
        msg = `\n\n${settingsName[settingKey]}　${statusMsg(status)}`
    }

    putInCacheObject("FNSettings", settings)
    sleepToast(msg)
    refreshSettings(settingKey)
}

function refreshSettings(settingName) {
    if (settingName === "DEFAULT") {
        try { java.reLoginView() } catch (e) {}
        try { source.refreshExplore() } catch (e) {}
        try { java.refreshBookInfo() } catch(e) {}
        try { java.refreshBookToc() } catch(e) {}
        try { java.refreshContent() } catch(e) {}

    } else if (settingName in modeSettingsName) {
        try { java.reLoginView() } catch (e) {}
        try { source.refreshExplore() } catch (e) {}
        try { java.refreshBookToc() } catch(e) {}
        try { java.refreshContent() } catch(e) {}

    } else if (settingName in menuSettingsName) {
        try { java.reLoginView() } catch (e) {}

    } else if (settingName in discoverSettingsName) {
        try { source.refreshExplore() } catch (e) {}

    } else if (settingName in detailSettingsName) {
        try { java.refreshBookInfo() } catch(e) {}

    } else if (settingName in catalogSettingsName) {
        try { java.refreshBookToc() } catch(e) {}

    } else if (settingName in contentSettingsName) {
        try { java.refreshContent() } catch(e) {}

    } else if (settingName in pictureSettingsName) {
        try { java.refreshContent() } catch(e) {}
    }
}


function backupRestore() {
    let variable = String(result.get("书源设置") || "").trim()
    if (!variable) variable = String(source.getVariable() || "").trim()

    if (variable === "") {
        let data = backupData()
        try {
            java.copyText(data)
            java.upLoginData({"书源设置": data})
            sleepToast("\n💾 备份数据\n\n✅ 已导出书源数据 到剪贴板")
        } catch(e) {
            try {
                source.putVariable(data)
                sleepToast("\n💾 备份恢复\n\n✅ 已导出书源数据至 源变量")
            } catch(e) {
                sleepToast("\n💾 备份恢复\n\n⚠️ 书源导出数据失败")
            }
        }
    }

    else if (isJsonString(variable)) {
        restoreData(JSON.parse(variable))
        sleepToast("\n💾 恢复数据\n\n✅ 已导入书源数据")
        try { java.upLoginData({"书源设置": ""})} catch(e) {}
        try { source.putVariable("") } catch(e) {}
    } else {
        sleepToast("\n💾 备份恢复\n\n⚠️ 输入数据出错，请检查数据格式（JSON）")
    }
}

function backupData() {
    let data = {}
    data.settings = getFromCacheObject("FNSettings")
    return JSON.stringify(data, null, 4)
}

function restoreData(data) {
    putInCacheObject("FNSettings", data?.settings)
    try {source.refreshExplore()} catch (e) {}
}