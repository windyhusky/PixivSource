var util = {}

function objStringify(obj) {
    return JSON.stringify(obj, (n, v) => {
        if (typeof v == "function")
            return v.toString();
        return v;
    });
}

// 检测 源阅
// 可用 java.ajax() 不可用 java.webview() java.ajaxAll()
// 可用 java.getCookie() cache.put() cache.get() 默认值为 undefined
// 可用 java.startBrowser() 不可用 java.startBrowserAwaitAwait
// 可用 source.bookSourceName source.getVariable() source.setVariable()等
// java.getUserAgent() java.getWebViewUA() 目前返回内容相同
function isSourceRead() {
    return java.getUserAgent() === java.getWebViewUA()
}
// 正式版 不支持在 JSlib 的函数直接设置默认参数
// 正式版 不支持 a?.b 的写法
// 检测 阅读 正式版 与 Beta 版本
function isLegadoOfficial() {
    let isLegadoOfficialStatus
    try {
        eval('({})?.value')
        isLegadoOfficialStatus = false
    } catch (e) {
        isLegadoOfficialStatus = true
    }
    cache.put("isLegadoOfficial", isLegadoOfficialStatus)
    return isLegadoOfficialStatus
}
// 检测 阅读 Beta 版本 与 LYC 版本
// LYC 版本新增函数
// java.ajaxTestAll()
// java.openVideoPlayer(url: String, title: String, float: Boolean)
// cookie.setWebCookie(url,cookie)
// source.refreshExplore()
// source.refreshJSLib()
function isLegadoLYC() {
    let isLegadoLYCStatus = (typeof java.ajaxTestAll === "function")
    cache.put("isLegadoLYCStatus", isLegadoLYCStatus)
    return isLegadoLYCStatus
}

function publicFunc() {
    let u = {}, settings = {}
    // 输出书源信息
    java.log(`${source.bookSourceComment.split("\n")[0]}`)
    java.log(`📌 ${source.bookSourceComment.split("\n")[2]}`)
    java.log(`📆 更新时间：${java.timeFormat(source.lastUpdateTime)}`)
    if (isSourceRead()) {
        java.log("📱 软件平台：🍎 源阅 SourceRead")
    } else if (isLegadoOfficial()) {
        java.log("📱 软件平台：🤖 开源阅读 【正式版】")
        java.log("当前软件为：阅读【正式版】\n\n【正式版】已年久失修，不推荐继续使用\n推荐使用【Beta版】【共存/新共存版】\n\nBeta版本下载链接：\nhttps://miaogongzi.lanzout.com/b01rgkhhe\n如需更新，可去书源调试界面\n打开下载链接切换阅读版本\n")
    } else {
        if (isLegadoLYC()) {
            java.log("📱 软件平台：🤖 开源阅读 Beta/LYC 版")
        } else {
            java.log("📱 软件平台：🤖 开源阅读 Beta 版（未合入 LYC 功能）")
        }
    }

    // 设置初始化
    // cache.delete("pixivIllustSettings")
    settings = getFromCacheObject("pixivIllustSettings")
    if (settings) {
        java.log("⚙️ 使用自定义设置")
    } else {
        java.log("⚙️ 使用默认设置")
        settings = setDefaultSettings()
    }
    settings = checkSettings()
    if (settings.IPDirect) {
        java.log("✈️ 直连模式：✅ 已开启")
    } else {
        java.log("✈️ 直连模式：❌ 已关闭")
    }
    u.settings = settings
    putInCacheObject("pixivIllustSettings", settings)  // 设置写入缓存

    u.environment = {}
    u.environment.IS_SOURCEREAD = isSourceRead()
    u.environment.IS_LEGADO = !isSourceRead()
    u.environment.IS_LYC_BRUNCH = isLegadoLYC()
    putInCacheObject("pixivEnvironment", u.environment)  // 设置写入缓存

    u.debugFunc = (func) => {
        if (util.settings.DEBUG === true) {
            func()
        }
    }

    u.checkStatus = function(status) {
        if (status === true) return "✅ 已"
        else if (status === false) return "❌ 未"
        else if (status === undefined) return "🈚️ 无数据："
    }

    u.login = function() {
        let resp = java.startBrowserAwait(`https://accounts.pixiv.net/login,
    {"headers": {"User-Agent": "${java.getWebViewUA()}"}}`, '登录账号', false)
        if (resp.code() === 200) {
            this.getCsrfToken(); this.getCookie()
        } else {
            java.log(resp.code()); sleepToast("⚠️ 登录失败")
        }
    }

    u.logout = function() {
        this.removeCookie()
        java.startBrowser("https://www.pixiv.net/logout.php", "退出账号")
        this.removeCookie()
        sleepToast(`✅ 已退出当前账号\n\n退出后请点击右上角的 ✔️ 退出\n\n登录请点击【登录账号】进行登录`)
    }

    u.getCookie = function() {
        let pixivCookie = String(java.getCookie("https://www.pixiv.net/", null))
        if (isLogin()) cache.put("pixivCookie", pixivCookie, 60*60)  // 缓存1h
    }

    u.removeCookie = function() {
        cookie.removeCookie('https://www.pixiv.net')
        cookie.removeCookie('https://accounts.pixiv.net')
        cookie.removeCookie('https://accounts.google.com')
        cookie.removeCookie('https://api.weibo.com')
        cache.delete("pixivCookie")
        cache.delete("pixiv:uid")
        cache.delete("pixivCsrfToken")  // 与登录设备有关
        cache.delete("headers")
    }

    // 获取 Csrf Token，以便进行收藏等请求
    // 获取方法来自脚本 Pixiv Previewer
    // https://github.com/Ocrosoft/PixivPreviewer
    // https://greasyfork.org/zh-CN/scripts/30766-pixiv-previewer/code
    u.getCsrfToken = function() {
        let pixivCsrfToken = cache.get("pixivCsrfToken")
        if (!pixivCsrfToken) {
            let html = java.webView(null, "https://www.pixiv.net/", null)
            try {
                pixivCsrfToken = html.match(/token\\":\\"([a-z0-9]{32})/)[1]
                cache.put("pixivCsrfToken", pixivCsrfToken)  // 与登录设备有关，无法存储 nul
            } catch (e) {
                pixivCsrfToken = null
                cache.delete("pixivCsrfToken")  // 与登录设备有关，无法存储 nul
                // sleepToast("⚠️ 未登录账号(pixivCsrfToken)")
            }
            java.log(`pixivCsrfToken:\n${pixivCsrfToken}`)
        }
        return pixivCsrfToken
    }

    u.handIllusts = function (illusts) {
        illusts.forEach(illust => {
            // illust.id = illust.id
            // illust.title = illust.title
            // illust.userName = illust.userName
            // illust.tags = illust.tags
            if (!(illust.tags instanceof Array)) {
                illust.tags = illust.tags.tags.map(item => item.tag)
                illust.coverUrl = illust.url = illust.urls.regular  // 兼容正文搜索
                illust.updateDate = illust.uploadDate
            }
            illust.textCount = null
            // illust.pageCount = illust.pageCount
            // illust.description = illust.description
            illust.coverUrl = illust.url
            illust.detailedUrl = urlIP(urlIllustDetailed(illust.id))
            // illust.createDate = illust.createDate
            // illust.updateDate = illust.updateDate
            // illust.aiType = illust.aiType

            if (illust.seriesNavData === undefined || illust.seriesNavData === null) {
                illust.latestChapter = illust.title
            } else {
                illust.seriesId = illust.seriesNavData.seriesId
                illust.title = illust.seriesNavData.title
            }

            if (illust.seriesId !== undefined) {
                let resp = getAjaxJson(urlIP(urlSeriesDetailed(illust.seriesId))).body
                let series = resp.illustSeries.filter(item => item.id === illust.seriesId)[0]
                // illust.title = illust.title
                illust.tags = illust.tags.concat(series.tags)
                illust.latestChapter = resp.thumbnails.illust.filter(item => item.id === series.latestIllustId)[0].title
                illust.description = series.description
                if (series.url === undefined) {
                    let firstChapter = getAjaxJson(urlIP(urlIllustDetailed(series.firstIllustId))).body
                    illust.coverUrl = firstChapter.urls.regular
                    illust.tags = illust.tags.concat(firstChapter.tags.tags.map(item => item.tag))
                }
                illust.createDate = series.createDate
                illust.updateDate = series.updateDate
                illust.total = series.total
            }
        })
        return illusts
    }

    u.formatIllusts = function (illusts) {
        illusts.forEach(illust => {
            illust.title = illust.title.trim()
            if (!illust.userName.startsWith("@")) illust.userName = `@${illust.userName}`
            illust.tags = Array.from(new Set(illust.tags))
            illust.tags = illust.tags.join(",")
            illust.coverUrl = urlCoverUrl(illust.coverUrl)
            illust.createDate = dateFormat(illust.createDate)
            illust.updateDate = dateFormat(illust.updateDate)
            if (util.MORE_INFORMATION) {
                illust.description = `\n书名：${illust.title}\n作者：${illust.userName}\n标签：${illust.tags}\n页面：${illust.pageCount}\n上传：${illust.createDate}\n更新：${illust.updateDate}\n简介：${illust.description}`
            } else {
                illust.description = `\n${illust.title}，共${illust.pageCount}页\n${illust.description}\n上传时间：${illust.createDate}\n更新时间：${illust.updateDate}`
            }
        })
        return illusts
    }

    u.getIllustRes = function (result) {
        let illustId = 0, res = {}
        let isJson = isJsonString(result)
        let isHtml = result.startsWith("<!DOCTYPE html>")
        if (!isJson && isHtml) {
            let pattern1 = "(https?://)?(www\\.)?pixiv\\.net/(artworks|ajax/illust)/(\\d+)"
            let isIllust = baseUrl.match(new RegExp(pattern1))
            let pattern2 = "(https?://)?(www\\.)?pixiv\\.net/(user/\\d+|ajax)/series/(\\d+)"
            let isSeries = baseUrl.match(new RegExp(pattern2))

            if (isIllust) {
                illustId = isIllust[4]
            } else if (isSeries) {
                seriesId = isSeries[4]
                java.log(`匹配系列ID：${seriesId}`)
                illustId = getAjaxJson(urlIP(urlSeriesDetailed(seriesId))).body.page.series.reverse()[0].workId
            }
        }
        if (isJson) {
            res = JSON.parse(result)
        }

        if (illustId) {
            java.log(`匹配插画ID：${illustId}`)
            res = getAjaxJson(urlIP(urlIllustDetailed(illustId)))
        }
        if (res.error) {
            java.log(`无法从 Pixiv 获取当前漫画`)
            java.log(JSON.stringify(res))
            return []
        }
        return res.body
    }

    util = u
    java.put("util", objStringify(u))
}

// 获取请求的user id方便其他ajax请求构造
function getPixivUid() {
    let uid = cache.get("pixiv:uid")
    if (!uid || String(uid) === "null") {
        let html = java.webView(null, "https://www.pixiv.net/", null)
        try {
            uid = html.match(/user_id:'(\d+)'/)[1]
        } catch (e) {
            uid = null
        }
        cache.put("pixiv:uid", String(uid))
    }
}

publicFunc()
if (result.code() === 200) {
    getPixivUid(); util.getCookie(); util.getCsrfToken()
}
java.getStrResponse(null, null)