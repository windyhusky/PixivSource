var util = {}

function objStringify(obj) {
    return JSON.stringify(obj, (n, v) => {
        if (typeof v == "function")
            return v.toString();
        return v;
    });
}

function isBackupSource() {
    let isBackupSource = source.bookSourceName.includes("备用")
    cache.put("isBackupSource", isBackupSource)
    return isBackupSource
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

function publicFunc() {
    let u = {}, settings = {}
    // 输出书源信息
    java.log(`🅿️ ${source.bookSourceComment.split("\n")[0]}`)
    java.log(`📌 ${source.bookSourceComment.split("\n")[2]}`)
    if (isSourceRead()) {
        java.log(`📆 更新时间：${java.timeFormat(source.lastUpdateTime)}`)
        java.log("📱 软件平台：🍎 源阅 SourceRead")
    } else {
        java.log(`📆 更新时间：${timeFormat(source.lastUpdateTime)}`)
        java.log("📱 软件平台：🤖 开源阅读 Leagdo")
    }

    // 获取设置，备用书源使用旧版设置，书源从缓存获取设置
    if (isBackupSource()) {
        settings = JSON.parse(String(source.variableComment).match(RegExp(/{([\s\S]*?)}/gm)))
    } else {
        // cache.delete("pixivSettings")
        settings = getFromCache("pixivSettings")
    }
    if (settings !== null) {
        java.log("⚙️ 使用自定义设置")
    } else {
        settings = {}
        settings.SEARCH_AUTHOR = true       // 搜索：默认搜索作者名称
        settings.CONVERT_CHINESE = true     // 搜索：搜索时进行繁简转换
        settings.MORE_INFORMATION = false   // 详情：书籍简介显示更多信息
        settings.SHOW_UPDATE_TIME = true    // 目录：显示更新时间，但会增加少许请求
        settings.SHOW_ORIGINAL_LINK = true  // 目录：显示原始链接，但会增加大量请求
        settings.REPLACE_TITLE_MARKS = true // 正文：注音内容为汉字时，替换为书名号
        settings.SHOW_CAPTIONS = true       // 正文：章首显示描述
        settings.SHOW_COMMENTS = true       // 正文：章尾显示评论
        settings.FAST  = false              // 全局：快速模式
        settings.DEBUG = false              // 全局：调试模式
        java.log("⚙️ 使用默认设置（无自定义设置 或 自定义设置有误）")
    }
    if (settings.FAST === true) {
        settings.SEARCH_AUTHOR = false        // 搜索：默认搜索作者名称
        settings.CONVERT_CHINESE = false      // 搜索：繁简通搜
        settings.SHOW_UPDATE_TIME = false     // 目录：显示章节更新时间
        settings.SHOW_ORIGINAL_LINK = false   // 目录：显示章节源链接
        settings.SHOW_COMMENTS = false        // 正文：显示评论
    } else {
        settings.SEARCH_AUTHOR = true        // 搜索：默认搜索作者名称
    }

    settings.IS_LEGADO = !isSourceRead()
    settings.IS_SOURCE_READ = isSourceRead()
    settings.IS_BACKUP_SOURCE = isBackupSource()
    u.settings = settings
    putInCache("pixivSettings", settings)  // 设置写入缓存

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
        cache.delete("csfrToken")  // 与登录设备有关
        cache.delete("headers")
    }

    // 获取 Csrf Token，以便进行收藏等请求
    // 获取方法来自脚本 Pixiv Previewer
    // https://github.com/Ocrosoft/PixivPreviewer
    // https://greasyfork.org/zh-CN/scripts/30766-pixiv-previewer/code
    u.getCsrfToken = function() {
        let csfrToken = cache.get("csfrToken")
        if (!csfrToken) {
            let html = java.webView(null, "https://www.pixiv.net/", null)
            try {
                csfrToken = html.match(/token\\":\\"([a-z0-9]{32})/)[1]
                cache.put("csfrToken", csfrToken)  // 与登录设备有关，无法存储 nul
            } catch (e) {
                csfrToken = null
                cache.delete("csfrToken")  // 与登录设备有关，无法存储 nul
                // sleepToast("⚠️ 未登录账号(csfrToken)")
            }
            java.log(`csfrToken:\n${csfrToken}`)
        }
        return csfrToken
    }

    // 将多个长篇小说解析为一本书
    u.combineNovels = function(novels) {
        return novels.filter(novel => {
            // 单本直接解析为一本书
            if (novel.seriesId === undefined || novel.seriesId === null) {
                return true
            }
            // 集合中没有该系列解析为一本书
            if (!seriesSet.has(novel.seriesId)) {
                seriesSet.add(novel.seriesId)
                return true
            }
            return false
        })
    }

    // 处理 novels 列表
    u.handNovels = function(novels) {
        novels.forEach(novel => {
            // novel.id = novel.id
            // novel.title = novel.title
            // novel.userName = novel.userName
            // novel.userId = novel.userId
            // novel.tags = novel.tags
            cache.put(`${novel.userName}`, novel.userId)  // 加入缓存，便于搜索作者
            if (novel.tags === undefined || novel.tags === null) {
                novel.tags = []
            }
            // 搜索单篇
            if (novel.isOneshot === undefined) {
                // novel.seriesId = novel.seriesId
                // novel.seriesTitle = novel.seriesTitle
                // novel.textCount = novel.textCount
                // novel.description = novel.description
                novel.coverUrl = novel.url
                // novel.createDate = novel.createDate
                // novel.updateDate = novel.updateDate
            }

            // 搜索系列
            if (novel.isOneshot !== undefined) {
                if (novel.isOneshot === true) {
                    novel.seriesId = undefined
                    novel.id = novel.novelId  // 获取真正的 novelId
                    novel.seriesTitle = undefined
                } else {
                    novel.seriesId = novel.id
                    novel.id = novel.novelId = novel.latestEpisodeId  // 获取真正的 novelId
                    novel.seriesTitle = novel.title
                    // novel.isWatched = novel.isWatched  // 搜索系列可获取
                }
                novel.textCount = novel.textLength
                novel.description = novel.caption
                novel.coverUrl = novel.cover.urls["480mw"]
                novel.createDate = novel.createDateTime
                novel.updateDate = novel.updateDateTime
            }

            // 单篇正文详情页
            if (novel.content) {
                novel.novelId = novel.id
                novel.tags = novel.tags.tags.map(item => item.tag)
                novel.textCount = novel.userNovels[`${novel.id}`].textCount
                // novel.latestChapter = novel.title
                // novel.description = novel.description
                novel.coverUrl = novel.userNovels[`${novel.id}`].url
                // novel.createDate = novel.createDate
                novel.updateDate = novel.uploadDate

                if (novel.seriesNavData) {
                    novel.seriesId = novel.seriesNavData.seriesId
                    novel.seriesTitle = novel.seriesNavData.title
                }
            }

            // 系列详情
            if (novel.firstNovelId) {
                novel.seriesId = novel.id
                novel.id = novel.novelId = novel.firstNovelId
                novel.seriesTitle = novel.title
                novel.coverUrl = novel.cover.urls["480mw"]
                // novel.isWatched = novel.isWatched  // 搜索系列可获取
            }

            // 单篇加更多信息
            if (!novel.seriesId) {
                novel.tags.unshift("单本")
                novel.latestChapter = novel.title
                novel.detailedUrl = urlNovelDetailed(novel.id)
                novel.total = 1
                if (novel.bookmarkData) {
                    novel.isBookmark = true
                } else {
                    novel.isBookmark = false
                }
            }
            // 系列添加更多信息
            if (novel.seriesId) {
                let series = getAjaxJson(urlSeriesDetailed(novel.seriesId)).body
                novel.id = series.firstNovelId
                novel.title = series.title
                novel.tags = novel.tags.concat(series.tags)
                novel.tags.unshift("长篇")
                novel.textCount = series.publishedTotalCharacterCount
                novel.description = series.caption
                novel.coverUrl = series.cover.urls["480mw"]
                novel.detailedUrl = urlSeriesDetailed(novel.seriesId)
                novel.createDate = series.createDate
                novel.updateDate = series.updateDate
                novel.total = series.publishedContentCount
                novel.isWatched = series.isWatched

                // 发送请求获取第一章 获取标签与简介
                let firstNovel = {}
                try {
                    firstNovel = getAjaxJson(urlNovelDetailed(series.firstNovelId)).body
                    novel.tags = novel.tags.concat(firstNovel.tags.tags.map(item => item.tag))
                    if (firstNovel.bookmarkData) {
                        firstNovel.isBookmark = true
                    }
                } catch (e) {  // 防止系列首篇无权限获取
                    try {
                        firstNovel = getAjaxJson(urlSeriesNovels(novel.seriesId, 30, 0)).body.thumbnails.novel[0]
                        novel.id = novel.firstNovelId = firstNovel.id
                        novel.tags = novel.tags.concat(firstNovel.tags)
                    } catch (e) { // 防止系列首篇无权限获取
                        firstNovel = {}
                        firstNovel.description = ""
                    }
                }
                novel.tags.unshift("长篇")
                if (novel.description === "") {
                    novel.description = firstNovel.description
                }
            }
        })
        util.debugFunc(() => {
            java.log(`处理小说完成`)
        })
        return novels
    }

    // 小说信息格式化
    u.formatNovels = function(novels) {
        novels.forEach(novel => {
            if (novel.title) novel.title = novel.title.trim()
            if (!novel.userName.startsWith("@")) novel.userName = `@${novel.userName}`
            novel.coverUrl = urlCoverUrl(novel.coverUrl)
            novel.readingTime = `${novel.readingTime / 60} 分钟`
            novel.createDate = dateFormat(novel.createDate)
            novel.updateDate = dateFormat(novel.updateDate)

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
            if (novel.seriesId) {
                collectMsg = `追更：${util.checkStatus(novel.isWatched)}追更系列`
            } else {
                collectMsg = `收藏：${util.checkStatus(novel.isBookmark)}加入收藏`
            }

            if (util.settings.MORE_INFORMATION) {
                novel.description = `\n登录：${util.checkStatus(isLogin())}登录账号
                ${collectMsg}\n书名：${novel.title}\n作者：${novel.userName}
                标签：${novel.tags}\n⬆️ 上传：${novel.createDate}
                更新：${novel.updateDate}\n简介：${novel.description}`
            } else {
                novel.description = `\n登录：${util.checkStatus(isLogin())}登录账号
                ${collectMsg}\n上传：${novel.createDate}\n更新：${novel.updateDate}
                简介：${novel.description}`
            }
        })
        return novels
    }

    // 正文，详情，搜索：从网址获取id，返回单篇小说 res，系列返回首篇小说 res
    // pixiv 默认分享信息中有#号，不会被识别成链接，无法使用添加网址
    u.getNovelRes = function(result) {
        let novelId = 0, res = {"body": {}}
        let isJson = isJsonString(result)
        let isHtml = isHtmlString(result)

        if (!isJson && isHtml) {
            let id = baseUrl.match(new RegExp("\\d+"))[0]
            let pattern = "(https?://)?(www\\.)?pixiv\\.net(/ajax)?/users?/\\d+"
            let isAuthor = baseUrl.match(new RegExp(pattern))
            if (isAuthor) {
                java.log(`作者ID：${id}`)
                novelId = Object.keys(getAjaxJson(urlUserWorkLatest(id)).body.novels).reverse()[0]
            }

            pattern = "(https?://)?(www\\.)?pixiv\\.net/novel/series/\\d+"
            let isSeries = baseUrl.match(new RegExp(pattern))
            if (isSeries) {
                java.log(`系列ID：${id}`)
                try {
                    novelId = getAjaxJson(urlSeriesDetailed(id)).body.firstNovelId
                } catch (e) {
                    novelId = getAjaxJson(urlSeriesNovels(id, 30, 0)).body.thumbnails.novel[0].id
                }
            } else {
                let pattern = "(https?://)?(www\\.)?pixiv\\.net/novel/(show\\.php\\?id=)?\\d+"
                let isNovel = baseUrl.match(new RegExp(pattern))
                if (isNovel) {
                    novelId = id
                }
            }
        }
        if (isJson) {
            res = JSON.parse(result)
        }

        if (novelId) {
            java.log(`匹配小说ID：${novelId}`)
            res = getAjaxJson(urlNovelDetailed(novelId))
        }
        if (res.error === true) {
            java.log(`无法从 Pixiv 获取当前小说`)
            java.log(JSON.stringify(res))
        }
        return res.body
    }

    // 目录：从网址获取id，尽可能返回系列 res，单篇小说返回小说 res
    u.getNovelResSeries = function(result) {
        let seriesId = 0, res = {"body": {}}
        let isJson = isJsonString(result)
        let isHtml = isHtmlString(result)

        if (!isJson && isHtml) {
            let id = baseUrl.match(new RegExp("\\d+"))[0]
            let pattern = "(https?://)?(www\\.)?pixiv\\.net/novel/series/\\d+"
            let isSeries = baseUrl.match(new RegExp(pattern))
            if (isSeries) {
                seriesId = id
            } else {
                let pattern = "(https?://)?(www\\.)?pixiv\\.net/novel/(show\\.php\\?id=)?\\d+"
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

        if (res.body && res.body.seriesNavData) {
            seriesId = res.body.seriesNavData.seriesId
        }
        if (seriesId) {
            java.log(`系列ID：${seriesId}`)
            res = getAjaxJson(urlSeriesDetailed(seriesId))
        }
        if (res.error === true) {
            java.log(`无法从 Pixiv 获取当前小说`)
            java.log(JSON.stringify(res))
        }
        return res.body
    }

    util = u
    java.put("util", objStringify(u))
}

function checkMessageThread(checkTimes) {
    if (checkTimes === undefined) {
        checkTimes = Number(cache.get("checkTimes"))
    }
    if (checkTimes === 0 && isLogin()) {
        let latestMsg = getAjaxJson(urlMessageThreadLatest(5))
        if (latestMsg.error === true) {
            java.log(JSON.stringify(latestMsg))
        } else if (latestMsg.body.total >= 1) {
            let msg = latestMsg.body.message_threads.filter(item => item.thread_name === "pixiv事務局")[0]
            if (msg && new Date().getTime()- 1000*msg.modified_at <= 3*24*60*60*1000) { // 3天内进行提示
                sleepToast(`您于 ${timeFormat(1000*msg.modified_at)} 触发 Pixiv 【过度访问】，请修改密码并重新登录。\n如已修改请忽略`, 3)
                sleepToast(`${msg.latest_content}`, 5)
                java.startBrowser("https://accounts.pixiv.net/password/change",'修改密码')
            }
        }
    }
    cache.put("checkTimes", checkTimes + 1, 4*60*60)  // 缓存4h，每4h提醒一次
    // cache.put("checkTimes", checkTimes + 1, 60)  // 测试用，缓存60s，每分钟提醒一次
    // java.log(checkTimes + 1)
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
    getPixivUid(); util.getCsrfToken()
    if (!util.FAST) checkMessageThread()   // 检测过度访问
}
java.getStrResponse(null, null)