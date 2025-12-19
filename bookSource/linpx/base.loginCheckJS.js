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
    let isSourceReadStatus = java.getUserAgent() === java.getWebViewUA()
    cache.put("isSourceRead", isSourceReadStatus)
    return isSourceReadStatus
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
    let u = {}, settings 
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
    // cache.delete("linpxSettings")
    settings = getFromCache("linpxSettings")
    if (settings) {
        java.log("⚙️ 使用自定义设置")
    } else {
        java.log("⚙️ 使用默认设置")
        settings = setDefaultSettings()
    }
    u.settings = settings
    putInCache("linpxSettings", settings)  // 设置写入缓存

    u.environment = {}
    u.environment.IS_SOURCEREAD = isSourceRead()
    u.environment.IS_LEGADO = !isSourceRead()
    u.environment.IS_LYC_BRUNCH = isLegadoLYC()
    putInCache("pixivEnvironment", u.environment)  // 设置写入缓存

    u.debugFunc = (func) => {
        if (util.settings.DEBUG) {
            func()
        }
    }

    // 将多个长篇小说解析为一本书
    u.combineNovels = function(novels) {
        return novels.filter(novel => {
            // 单本直接解析为一本书，需要判断是否为 null
            if (novel.seriesId === undefined || novel.seriesId === null) {
                return true
            }
            //集合中没有该系列解析为一本书
            if (!seriesSet.has(novel.seriesId)) {
                seriesSet.add(novel.seriesId)
                return true
            }
            return false
        })
    }

    // 优化 未缓存系列目录的情况；模拟系列数据
    u.getSeriesData = function (seriesId) {
        let series = getAjaxJson(urlSeriesDetailed(seriesId))
        if (series.error) series = getFromCache(`LSeries${seriesId}`)
        // java.log(JSON.stringify(series))
        return series
    }

    // 处理 novels 列表
    u.handNovels = function (novels) {
        novels.forEach(novel => {
            if (!novel.id) novel.id = novel._id
            // novel.title = novel.title
            // novel.userName = novel.userName
            // novel.tags = novel.tags
            if (novel.tags === undefined) {
                novel.tags = []
            }
            // 兼容详情页
            if (novel.content) {
                if (novel.series) {
                    novel.seriesId = novel.series.id
                    novel.seriesTitle = novel.series.title
                }
                novel.textCount = novel.length = novel.content.length
            }

            if (!novel.seriesId) {
                novel.tags.unshift("单本")
                novel.textCount = novel.length
                novel.latestChapter = novel.title
                novel.description = novel.desc
                // novel.coverUrl = novel.coverUrl
                novel.detailedUrl = urlNovelDetailed(novel.id)
            }

            // 优化 未缓存系列目录的情况
            // let series = getAjaxJson(urlSeriesDetailed(novel.seriesId))   // 兼容详情
            let series = this.getSeriesData(novel.seriesId)                  // 兼容搜索
            if (novel.seriesId && series.error) {
                novel.seriesId =novel.series.id
                novel.title = novel.series.title
                novel.tags.unshift("长篇")
                novel.textCount = null  // 无数据
                novel.createDate = null  // 无数据
            }

            if (novel.seriesId && !series.error) {
                java.log(`正在获取系列小说：${novel.seriesId}`)
                // let series = getAjaxJson(urlSeriesDetailed(novel.seriesId))
                let series = this.getSeriesData(novel.seriesId)
                novel.id = series.novels[0].id
                novel.title = series.title
                if (series.tags) {
                    novel.tags = novel.tags.concat(series.tags)
                }
                novel.tags.unshift("长篇")
                novel.textCount = null  // 无数据
                novel.createDate = null  // 无数据
                novel.latestChapter = series.novels.reverse()[0].title
                novel.description = series.caption
                // 后端目前没有系列的 coverUrl 字段
                // novel.coverUrl = series.coverUrl
                novel.coverUrl = series.novels[0].coverUrl
                novel.detailedUrl = urlNovelDetailed(novel.id)

                let firstNovel = getAjaxJson(urlNovelDetailed(novel.id))
                if (firstNovel.error !== true) {
                    novel.tags = novel.tags.concat(firstNovel.tags)
                    novel.createDate = firstNovel.createDate
                    if (novel.description === "") {
                        novel.description = firstNovel.desc
                    }
                }
            }
        })
        return novels
    }

    // 小说信息格式化
    u.formatNovels = function (novels) {
        novels.forEach(novel => {
            novel.title = novel.title.trim()
            if (!novel.userName.startsWith("@")) novel.userName = `@${novel.userName}`
            novel.coverUrl = urlCoverUrl(novel.coverUrl)
            novel.createDate = dateFormat(novel.createDate)

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
            novel.tags = novel.tags.join(",")

            if (util.settings.MORE_INFORMATION) {
                novel.description = `\n书名：${novel.title}\n作者：${novel.userName}\n标签：${novel.tags}\n上传：${novel.createDate}\n简介：${novel.description}`
            } else {
                novel.description = `\n${novel.description}\n上传时间：${novel.createDate}`
            }
        })
        return novels
    }

    // 从网址获取id，返回单篇小说 res，系列返回首篇小说 res
    u.getNovelRes = function (result) {
        let novelId = 0, res = []
        let isJson = isJsonString(result)
        let isHtml = isHtmlString(result)
        if (!isJson && isHtml) {
            let id = baseUrl.match(new RegExp("\\d+"))[0]
            let pattern = "(https?://)?(www\\.)?pixiv\\.net/novel/(series/)?\\d+"
            let isSeries = baseUrl.match(new RegExp(pattern))
            if (isSeries) {
                java.log(`系列ID：${id}`)
                // 优化 未缓存系列目录的情况
                // res = getAjaxJson(urlSeriesDetailed(id))
                res = this.getSeriesData(id)
            } else {
                let pattern = "((furrynovel\\.(ink|xyz))|pixiv\\.net)/(pn|(pixiv/)?novel)/(show\\.php\\?id=)?\\d+"
                let isNovel = baseUrl.match(new RegExp(pattern))
                if (isNovel) {
                    novelId = id
                }
            }
        }
        if (isJson) {
            res = JSON.parse(result)
        }

        if (res.total !== undefined && res.total !== null) {
            novelId = res.novels[0].id
        }
        if (novelId) {
            java.log(`匹配小说ID：${novelId}`)
            res = getAjaxJson(urlNovelDetailed(novelId))
        }
        if (res.error) {
            java.log(`无法从 Linpx 获取当前小说`)
            java.log(JSON.stringify(res))
        }
        return res
    }

    // 从网址获取id，尽可能返回系列 res，单篇小说返回小说 res
    u.getNovelResSeries = function (result) {
        let seriesId = 0, res = []
        let isJson = isJsonString(result)
        let isHtml = isHtmlString(result)
        if (!isJson && isHtml) {
            let id = baseUrl.match(new RegExp("\\d+"))[0]
            let pattern = "(https?://)?(www\\.)?pixiv\\.net(/ajax)?/novel/(series/)?\\d+"
            let isSeries = baseUrl.match(new RegExp(pattern))
            if (isSeries) {
                seriesId = id
            } else {
                let pattern = "((furrynovel\\.(ink|xyz))|pixiv\\.net)/(pn|(pixiv/)?novel)/(show\\.php\\?id=)?\\d+"
                let isNovel = baseUrl.match(new RegExp(pattern))
                if (isNovel) {
                    java.log(`匹配小说ID：${id}`)
                    res = getAjaxJson(urlNovelDetailed(id))
                }
            }
        }
        if (isJson) {
            res = JSON.parse(result)
        }

        if (res.series !== undefined && res.series !== null) {
            seriesId = res.series.id
        }
        if (seriesId) {
            java.log(`系列ID：${seriesId}`)
            // 优化 未缓存系列目录的情况
            // res = getAjaxJson(urlSeriesDetailed(seriesId))
            res = this.getSeriesData(seriesId)
        }
        if (res.error) {
            java.log(`无法从 Linpx 获取当前小说`)
            java.log(JSON.stringify(res))
            return []
        }
        return res
    }

    util = u
    java.put("util", objStringify(u))
}

publicFunc()
if (result.code() === 200) getWebViewUA()
java.getStrResponse(null, null)