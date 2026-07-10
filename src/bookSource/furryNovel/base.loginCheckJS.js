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

// 检测 Sigma 版本
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
    // 输出书源信息
    java.log(`${source.bookSourceComment.split("\n")[0]}`)
    java.log(`📌 ${source.bookSourceComment.split("\n")[2]}`)
    java.log(`📆 更新时间：${java.timeFormat(source.lastUpdateTime)}`)

    // 设置写入缓存
    u.settings = getFromCacheObject("linpxSettings")
    if (!u.settings) u.settings = setDefaultSettings()
    putInCacheObject("linpxSettings", u.settings)

    // 环境写入缓存
    u.environment = {}
    u.environment.IS_SOURCEREAD = isSourceRead()
    u.environment.IS_LEGADO_SIGMA = isLegadoSigma()
    u.environment.IS_LEGADO_OFFICIAL = isLegadoOfficial()
    u.environment.IS_LEGADO = u.environment.IS_LEGADO_SIGMA || u.environment.IS_LEGADO_OFFICIAL
    putInCacheObject("pixivEnvironment", u.environment)

    // 输出环境信息
    if (u.environment.IS_SOURCEREAD) {
        java.log("📱 软件平台：🍎 源阅 SourceRead")
    } else if (u.environment.IS_LEGADO_SIGMA) {
        java.log("📱 软件平台：🤖 阅读 Beta【新包名】/ 阅读 Plus")
    } else if (u.environment.IS_LEGADO_OFFICIAL) {
        java.log("📱 软件平台：🤖 阅读 正式版")
        sleepToast("\n⚠️当前软件为：阅读【正式版】\n【正式版】已年久失修，不推荐继续使用\n\n为了更好的使用体验，请用：\n【阅读 Plus】或【阅读 Beta 新包名】\n\n即将为您打开【阅读 Plus】下载界面")
        sleep(3);
        startBrowser("https://pixivsource.pages.dev/Download", "下载阅读 Plus")
    }

    if (u.DEBUG === true) {
        java.log(JSON.stringify(settings, null, 4))
        java.log(`DEBUG = ${u.DEBUG}`)
    }
    u.debugFunc = (func) => {
        if (util.settings.DEBUG) {
            func()
        }
    }

    u.getNovels = function () {
        if (JSON.parse(result).code === 200 && JSON.parse(result).count > 0) {
            return JSON.parse(result).data
        } else {
            return []
        }
    }

    u.handNovels = function (novels) {
        novels.forEach(novel =>{
            // novel.id = novel.id
            novel.title = novel.name
            // novel.tags = novel.tags
            novel.userName = novel.author.name
            // novel.userId = novel.author.id
            novel.textCount = null
            if (novel.latest_chapters === undefined) {
                novel.latestChapter = null
                novel.detailedUrl = urlNovelDetail(novel.id)
            } else {
                novel.latestChapter = novel.latest_chapters[0].name
                novel.detailedUrl = urlNovelUrl(novel.id)
            }
            novel.description = novel.desc
            novel.coverUrl = novel.cover
            novel.sourceUrl = urlSourceUrl(novel.source, novel.ext_data.oneshot, novel.source_id)

            novel.createDate = novel.created_at
            novel.updateDate = novel.updated_at
            novel.syncDate = novel.fetched_at
            // novel.status = novel.status
            // if (novel.status !== "publish") {  // suspend
            //     java.log(urlNovelUrl(novel.id))
            //     java.log(novel.sourceUrl)
            // }
        })
        return novels
    }

    u.formatNovels = function (novels) {
        novels.forEach(novel => {
            novel.title = novel.title.trim()
            if (!novel.userName.startsWith("@")) novel.userName = `@${novel.userName}`
            novel.tags2 = []
            for (let i in novel.tags) {
                let tag = novel.tags[i]
                if (tag.includes("/")) {
                    let tags = tag.split("/")
                    novel.tags2 = novel.tags2.concat(tags)
                } else {
                    novel.tags2.push(tag)
                }
            }
            novel.tags = Array.from(new Set(novel.tags2))
            novel.tags = novel.tags.map(item => `#${item}`)
            novel.tags = novel.tags.join(",")

            novel.createDate = dateFormat(novel.createDate)
            novel.updateDate = dateFormat(novel.updateDate)
            novel.syncDate = dateFormat(novel.syncDate)
            if (util.settings.MORE_INFORMATION) {
                novel.description = `\n书名：${novel.title}\n作者：${novel.userName}\n标签：${novel.tags}\n上传：${novel.createDate}\n更新：${novel.updateDate}\n同步：${novel.syncDate}\n简介：${novel.description}`
            } else {
                novel.description = `\n${novel.description}\n上传时间：${novel.createDate}\n更新时间：${novel.updateDate}\n同步时间：${novel.syncDate}`
            }
        })
        return novels
    }

    u.getNovelRes = function (result, type) {
        let res = {data: []}, chapterId = 0
        let isJson = isJsonString(result)
        let isHtml = isHtmlString(result)
        let pattern = "(https?://)?(www\\.)?furrynovel\\.com/(zh|en|ja)/novel/\\d+(/chapter/d+)?"
        let fnWebpage = baseUrl.match(new RegExp(pattern))

        if (isHtml && fnWebpage) {
            let novelId = baseUrl.match(new RegExp("\\d+"))[0]
            if (type === "detail") {
                res = getAjaxJson(urlNovelDetail(novelId))
            } else if (type === "catalog") {
                res = getAjaxJson(urlNovelChapterInfo(novelId))
            } else if (type === "content") {
                try {
                    chapterId = baseUrl.match(RegExp(/\/(\d+)\/chapter\/(\d+)/))[2]
                } catch (e) {
                    chapterId = getAjaxJson(urlNovelChapterInfo(novelId)).data[0].id
                } finally {
                    res = getAjaxJson(urlNovelChapterDetail(novelId, chapterId))
                }
            }
        }

        if (isJson) {
            res = JSON.parse(result)
        }
        if (res.data.length === 0) {
            java.log(`无法从 FurryNovel 获取当前小说`)
            java.log(JSON.stringify(res))
        }
        return res.data
    }

    util = u
    java.put("util", objStringify(u))
}

publicFunc()
java.getStrResponse(null, null)