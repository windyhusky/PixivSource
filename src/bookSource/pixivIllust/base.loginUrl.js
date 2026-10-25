function login() {
    sleepToast("🔄 正在检测登陆状态，请稍候")
    if (isLogin()) {
        sleepToast("️🅿️ 登录账号\n✅ 已经登录过账号了\n\n可以点击【🔙 退出账号】来切换账号")
        return false
    }

    let resp = java.startBrowserAwait(`https://accounts.pixiv.net/login,
    {"headers": {"User-Agent": ${getWebViewUA()}}}`, '登录账号', false)
    if (resp.code() === 200) {
        getCsrfToken(); getCookie()
        return true
    } else {
        java.log(resp.code()); sleepToast("🅿️ 登录账号\n\n⚠️ 登录失败")
        return false
    }
}

function logout() {
    removeCookie()
    java.startBrowser("https://www.pixiv.net/logout.php", "退出账号")
    removeCookie(); removeLikeDataCache(); removeSettingsCache()
    sleepToast(`✅ 已退出当前账号\n\n退出后请点击右上角的 ✔️ 退出\n\n登录请点击【登录账号】进行登录`)
}

function removeCookie() {
    cookie.removeCookie('https://www.pixiv.net')
    cookie.removeCookie('https://accounts.pixiv.net')
    cookie.removeCookie('https://accounts.google.com')
    cookie.removeCookie('https://api.weibo.com')
    cache.delete("pixivCookie")
    cache.delete("pixivUid")
    cache.delete("pixivCsrfToken")  // 与登录设备有关
    cache.delete("headers")
}

function getCookie() {
    let pixivCookie = String(java.getCookie("https://www.pixiv.net/", null))
    if (!isLogin()) return ""
    putInCache("pixivCookie", pixivCookie, 60*60)
    return pixivCookie
}

// 获取 Csrf Token，以便进行收藏等请求
// 获取方法来自脚本 Pixiv Previewer
// https://github.com/Ocrosoft/PixivPreviewer
// https://greasyfork.org/zh-CN/scripts/30766-pixiv-previewer/code
function getCsrfToken() {
    let pixivCsrfToken = getFromCache("pixivCsrfToken")
    if (!pixivCsrfToken) {
        let html = java.ajax("https://www.pixiv.net/")
        try {
            pixivCsrfToken = html.match(/token\\":\\"([a-z0-9]{32})/)[1]
            putInCache("pixivCsrfToken", pixivCsrfToken)  // 与登录设备有关，无法存储 nul
        } catch (e) {
            pixivCsrfToken = null
            cache.delete("pixivCsrfToken")  // 与登录设备有关，无法存储 nul
            // sleepToast("⚠️ 未登录账号(pixivCsrfToken)")
        }
        java.log(`pixivCsrfToken:\n${pixivCsrfToken}`)
    }
    return pixivCsrfToken
}

function getIllust() {}

function getPostBody(url, body, headers) {
    if (headers === undefined) headers = getFromCacheObject("headers")
    if (isJsonString(body)) {
        headers["content-type"] = "application/json; charset=utf-8"
    } else if (typeof body === "string") {
        headers["content-type"] = "application/x-www-form-urlencoded; charset=utf-8"
    }
    try {
        java.log(`getPostBody(${url}, ${body}, ${headers})`)
        return JSON.parse(java.post(url, body, headers).body())
    } catch (e) {
        e = String(e)
        // sleepToast(e)
        // sleepToast(JSON.stringify(headers))
        if (e.includes("400")) sleepToast(`📤 getPostBody\n\n⚠️ 缺少 headers`, 1)
        else if (e.includes("403")) sleepToast(`📤 getPostBody\n\n⚠️ 缺少 cookie 或 cookie 过期`, 1)
        else if (e.includes("404")) sleepToast(`📤 getPostBody\n\n⚠️ 404 缺少 pixivCsrfToken `, 1)
        else if (e.includes("422")) sleepToast(`📤 getPostBody\n\n⚠️ 请求信息有误`, 1)
        return {error: true, errMsg:e}
    }
}

function userFollow(restrict) {
    if (restrict === undefined) restrict = 0
    let novel = getNovel()
    let resp = getPostBody(
        "https://www.pixiv.net/bookmark_add.php",
        `mode=add&type=user&user_id=${novel.userId}&tag=""&restrict=${restrict}&format=json`
    )
    if (resp.error === true) {
        sleepToast(`⭐️ 关注作者\n\n⚠️ 关注【${novel.userName}】失败`, 1)
        shareFactory("author")
    } else {
        sleepToast(`⭐️ 关注作者\n\n✅ 已关注【${novel.userName}】`)
        putInCache(`follow${novel.userId}`, true)
    }
}

function userUnFollow() {
    let novel = getNovel()
    let resp = getPostBody(
        "https://www.pixiv.net/rpc_group_setting.php",
        `mode=del&type=bookuser&id=${novel.userId}`
    )
    if (resp.error === true) {
        sleepToast(`⭐️ 关注作者\n\n⚠️ 取消关注【${novel.userName}】失败`, 1)
        shareFactory("author")
    } else {
        sleepToast(`⭐️ 关注作者\n\n✅ 已取消关注【${novel.userName}】`)
        cache.delete(`follow${novel.userId}`)
    }
}

function userFollowFactory(code) {
    if (code === undefined) code = 1
    let novel = getNovel()
    let lastStatus = getFromCacheObject(`follow${novel.userId}`)
    if (lastStatus === true) code = 0

    if (code === 0) userUnFollow()
    else if (code === 1) userFollow()
}

function startPixivSettings() {
    startBrowser("https://www.pixiv.net/settings/viewing", "账号设置")
}
function startGithubReadme() {
    startBrowser("https://pixivsource.pages.dev/Pixiv", "使用指南")
}

const searchSettingsName = {
    // "SEARCH_AUTHOR": "🔍 搜索作者",
    "CONVERT_CHINESE": "🀄️ 繁简通搜",
}
const catalogSettingsName = {
    "SHOW_ORIGINAL_LINK": "🔗 原始链接",
}
const contentSettingsName = {
    "QUALITY_REGULAR": "🖼️ 常规质量",
}
const modeSettingsName = {
    "FAST": "⏩ 快速模式",
    "DEBUG": "🐞 调试模式",
    "IPDirect": "✈️ 直连模式",
}
const illustSettingsName = Object.assign({},
    searchSettingsName,
    catalogSettingsName,
    contentSettingsName,
    modeSettingsName,
)
const discoverSettingsName = {
    "SHOW_ADULT": "🔞 默认发现",
    "SHOW_GENERAL": "🆗 常规插画",
    "SHOW_NEW_ADULT": "🔞 最新企划",
    "SHOW_NEW_GENERAL": "🆗 最新企划",

    "SHOW_RANK_ADULT": "🔞 排行榜单",
    "SHOW_RANK_GENERAL": "🆗 排行榜单",
    "SHOW_ABOUT": "📚 书源相关",
}
const menuSettingsName = {
    "SHOW_DISCOVER": "⚙️ 发现设置\n（书源编辑界面）",
    "SHOW_SETTINGS": "⚙️ 书源设置\n（书源编辑界面）",
}
const settingsName = Object.assign({},
    illustSettingsName,
    discoverSettingsName,
    menuSettingsName
)


function statusMsg(status) {
    if (status === true) return "✅ 已开启"
    else if (status === false) return "🚫 已关闭"
    else return "🈚️ 未设置"
}

// 检测快速模式修改的4个设置
function getSettingStatus(mode) {
    if (mode === undefined) mode = ""
    let keys = [], msgList = []
    let settings = getFromCacheObject("pixivIllustSettings")
    // if (mode === "FAST") {
    //     keys = Object.keys(settingsName).slice(0, 5)
    // }
    if (mode === "IPDirect") {
        keys = Object.keys(settingsName).slice(0, 1)
    } else {
        keys = Object.keys(settingsName)
    }
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
    let settings = getFromCacheObject("pixivIllustSettings")
    if (!settings) settings = setDefaultSettings()
    if (!!settings[settingName]) {
        status = settings[settingName] = !settings[settingName]
    } else {
        status = settings[settingName] = true
    }
    putInCacheObject("pixivIllustSettings", settings)

    if (settingName === "IPDirect") {
        if (settings.IPDirect && !isLogin()) {
            msg = "✈️ 直连模式\n\n✈️ 直连模式 需登录账号\n当前未登录账号，现已关闭直连模式"
            settings.IPDirect = false
            checkSettings()
            putInCacheObject("pixivIllustSettings", settings)
        } else {
            checkSettings()
            msg = `\n\n${statusMsg(status)}　${settingsName[settingName]}\n\n${getSettingStatus(settingName)}`
        }

    } else if (settingName === "QUALITY_REGULAR") {
        msg = `\n\n${statusMsg(status)}　${settingsName[settingName]}\n\n`
        if (settings.QUALITY_REGULAR)
             msg += "图片质量设置为 regular "
        else msg += "图片质量设置为 original"

    } else {
        msg = `\n\n${statusMsg(status)}　${settingsName[settingName]}`
    }
    sleepToast(msg)
    refreshSettings(settingName)
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

    // } else if (settingName in detailSettingsName) {
    //     try { java.refreshBookInfo() } catch(e) {}

    } else if (settingName in catalogSettingsName) {
        try { java.refreshBookToc() } catch(e) {}

    } else if (settingName in contentSettingsName) {
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
    // 账号相关
    data.pixivUid = getFromCache("pixivUid")
    data.pixivCookie = getCookie()
    data.pixivCsrfToken = getCsrfToken()

    // 书源设置
    data.pixivSettings = getFromCacheObject("pixivIllustSettings")
    return JSON.stringify(data, null, 4)
}

function restoreData(data) {
    // 账号相关
    let pixivCookie = stripCfCookies(data?.pixivCookie)
    if (pixivCookie) {
        removeCookie()
        putInCache("pixivUid", data?.pixivUid)
        putInCache("pixivCookie", pixivCookie, 60*60)
        putInCache("pixivCsrfToken", data?.pixivCsrfToken)
        cookie.setCookie("https://www.pixiv.net", pixivCookie)
        cookie.setCookie("https://accounts.pixiv.net", pixivCookie)
        try {
            cookie.setWebCookie("https://www.pixiv.net", pixivCookie)
            cookie.setWebCookie("https://accounts.pixiv.net", pixivCookie)
        } catch (e) {}
    }

    // 书源设置
    putInCacheObject("pixivIllustSettings", data?.pixivSettings)
    try {source.refreshExplore()} catch (e) {}
}

function stripCfCookies(cookieStr) {
    return cookieStr
        .replace(/;?\s*cf_clearance=[^;]*/g, '')
        .replace(/;?\s*__cf_bm=[^;]*/g, '')
        .replace(/^;\s*/, '')   // 防止开头多余的分号
        .trim()
}
