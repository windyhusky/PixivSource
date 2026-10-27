var util = {}

function objStringify(obj) {
    return JSON.stringify(obj, (n, v) => {
        if (typeof v == "function")
            return v.toString();
        return v;
    });
}

// 检测 轻悦时光，多平台
// 不可用 java.getResponse()
// java.getUserAgent() java.getWebViewUA() 目前返回内容相同
function isQYSG() {
    return java.getUserAgent() === java.getWebViewUA()
}

// 检测 源阅
// 可用 java.ajax() 不可用 java.webview() java.ajaxAll()
// 可用 java.getCookie() cache.put() cache.get() 默认值为 undefined
// 可用 java.startBrowser() 不可用 java.startBrowserAwaitAwait
// 可用 source.bookSourceName source.getVariable() source.setVariable()等
// java.getUserAgent() java.getWebViewUA() 目前返回内容相同
function isSourceRead() {
    return java.getUserAgent() === java.getWebViewUA() && String(java.getWebViewUA()).includes("Win")
}

// 检测阅读
function isLegado() {
    return typeof java.ajaxAll === "function"
}

// 检测 阅读 正式版
// 正式版 不支持在 JSlib 的函数直接设置默认参数
// 正式版 不支持 a?.b 的写法
function isLegadoOfficial() {
    let isLegadoOfficialStatus
    try {
        eval('({})?.value')
        isLegadoOfficialStatus = false
    } catch (e) {
        isLegadoOfficialStatus = true
    }
    return isLegadoOfficialStatus
}

// 检测 阅读 Sigma
// Sigma 版本新增函数
// java.ajaxTestAll()
// java.openVideoPlayer(url: String, title: String, float: Boolean)
// cookie.setWebCookie(url,cookie)
// source.refreshExplore()
// source.refreshJSLib()
function isLegadoSigma() {
    return typeof java.ajaxTestAll === "function"
}

function publicFunc() {
    let u = {}
    u.init = () => {
        u.settings = getFromCacheObject("pixivIllustSettings")
        if (!u.settings) u.settings = setDefaultSettings()
        u.settings = checkSettings()
        putInCacheObject("pixivIllustSettings", u.settings)

        // cache.delete("pixivEnvironment")
        u.environment = getFromCacheObject("pixivEnvironment")
        if (!u.environment) u.checkEnvironment()
    }

    u.checkEnvironment = () => {
        u.environment = {}
        u.environment.IS_SOURCEREAD = isSourceRead()
        u.environment.IS_QYSG = isQYSG()
        u.environment.IS_LEGADO = isLegado()
        u.environment.IS_LEGADO_SIGMA = isLegadoSigma()
        u.environment.IS_LEGADO_OFFICIAL = isLegadoOfficial()
        putInCacheObject("pixivEnvironment", u.environment)
    }

    u.logSource = () => {
        java.log(`${source.bookSourceComment.split("\n")[0]}`)
        java.log(`📌 ${source.bookSourceComment.split("\n")[2]}`)
        java.log(`📆 更新时间：${java.timeFormat(source.lastUpdateTime)}`)
    }

    u.logEnvironment = () => {
        if (u.environment.IS_SOURCEREAD) {
            java.log("▶️ 当前软件：🍎 源阅 SourceRead")
        } else if (u.environment.IS_QYSG) {
            java.log("▶️ 当前软件：🍎 轻悦时光 QYSG")
        } else if (u.environment.IS_LEGADO_SIGMA) {
            java.log("▶️ 当前软件：🤖 阅读 Sigma")
        } else if (u.environment.IS_LEGADO_OFFICIAL && !source.bookSourceComment.includes("备用")) {
            java.log("▶️ 当前软件：🤖 阅读 正式版")
            sleepToast("\n⚠️当前软件为：阅读【正式版】\n【正式版】已年久失修，不推荐继续使用\n\n为了更好的使用体验，请使用：\n阅读【Sigma】\n\n即将为您打开下载界面，请在浏览器内打开并下载")
            sleep(3); startBrowser("https://pixivsource.pages.dev/Download", "下载阅读 Sigma")
        } else if (u.environment.IS_LEGADO) {
            java.log("▶️ 当前软件：🤖 阅读 ")
        }
    }

    u.logSettings = () => {
        if (u.settings.IPDirect) java.log("✈️ 直连模式：✅ 已开启")
        // if (u.settings.FAST) java.log("⏩ 快速模式：✅ 已开启")
        if (u.settings.DEBUG) java.log("🐞 调试模式：✅ 已开启")
    }

    u.checkPixiv = () => {
        let logs = []
        let checkThings = ["pixivCsrfToken", "pixivCookie", "pixivUid"]
        checkThings.forEach(item => {
            let text = `${getFromCache(item)? "✅" : "❌"} ${item}`
            // let text = `${getFromCache(item)? "✅" : "❌"} ${item}\n${getFromCache(item)}`
            logs.push(text)
            if (u.settings.DEBUG) java.log(text)
        })
        if (logs.join("").split("❌").length > 1) {
            sleepToast("⚠️ 登录状态\n 当前登录信息不完整，请重新登录\n或使用【备份恢复】恢复登录状态")
        } else {
            java.log("✅ 登录信息完整")
        }
    }

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
        if (isLogin()) putInCache("pixivCookie", pixivCookie, 60*60)  // 缓存1h
    }

    u.removeCookie = function() {
        cookie.removeCookie('https://www.pixiv.net')
        cookie.removeCookie('https://accounts.pixiv.net')
        cookie.removeCookie('https://accounts.google.com')
        cookie.removeCookie('https://api.weibo.com')
        cache.delete("pixivCookie")
        cache.delete("pixivUid")
        cache.delete("pixivCsrfToken")  // 与登录设备有关
        cache.delete("headers")
    }

    // 获取 Csrf Token，以便进行收藏等请求
    // 获取方法来自脚本 Pixiv Previewer
    // https://github.com/Ocrosoft/PixivPreviewer
    // https://greasyfork.org/zh-CN/scripts/30766-pixiv-previewer/code
    u.getCsrfToken = function() {
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
            illust.detailedUrl = urlIllustDetailed(illust.id)
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
                let resp = getAjaxJson(urlSeriesDetailed(illust.seriesId)).body
                let series = resp.illustSeries.filter(item => item.id === illust.seriesId)[0]
                // illust.title = illust.title
                illust.tags = illust.tags.concat(series.tags)
                illust.latestChapter = resp.thumbnails.illust.filter(item => item.id === series.latestIllustId)[0].title
                illust.description = series.description
                if (series.url === undefined) {
                    let firstChapter = getAjaxJson(urlIllustDetailed(series.firstIllustId)).body
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
            illust.tags = illust.tags.map(item => `#${item}`)
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
                illustId = getAjaxJson(urlSeriesDetailed(seriesId)).body.page.series.reverse()[0].workId
            }
        }
        if (isJson) {
            res = JSON.parse(result)
        }

        if (illustId) {
            java.log(`匹配插画ID：${illustId}`)
            res = getAjaxJson(urlIllustDetailed(illustId))
        }
        if (res.error) {
            java.log(`无法从 Pixiv 获取当前漫画`)
            java.log(JSON.stringify(res))
            return []
        }
        return res.body
    }

    u.init(); u.logSource(); u.logEnvironment(); u.logSettings(); u.checkPixiv()
    util = u; java.put("util", objStringify(u))
}

// 获取请求的user id方便其他ajax请求构造
function getPixivUid() {
    // cache.delete("pixivUid")
    let pixivUid = getFromCache("pixivUid")
    let pixivCookie = getFromCache("pixivCookie")
    if (!pixivUid && pixivCookie) {
        pixivUid = pixivCookie.match(new RegExp(/PHPSESSID=(\d+)/))[1]
        java.log(`pixivUid: ${pixivUid}`)
        putInCache("pixivUid", pixivUid)
    }
    return pixivUid
}

publicFunc()
if (result.code() === 200) {
    util.getCsrfToken(); util.getCookie(); getPixivUid()
}
java.getStrResponse(null, null)