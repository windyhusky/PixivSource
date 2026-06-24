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
    if (isLogin()) putInCache("pixivCookie", pixivCookie, 60*60)
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

let settingsName = {
    "SHOW_ORIGINAL_LINK": "🔗 原始链接",
    "CONVERT_CHINESE": "🀄️ 繁简通搜",
    "QUALITY_REGULAR": "🖼️ 常规质量",
    "IPDirect": "✈️ 直连模式",
    "DEBUG": "🐞 调试模式"
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
}