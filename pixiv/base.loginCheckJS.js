var util = {}

function objStringify(obj) {
    return JSON.stringify(obj, (n, v) => {
        if (typeof v == "function")
            return v.toString();
        return v;
    });
}

function publicFunc() {
    let u = {}, settings
    java.log(String(source.bookSourceComment).split("\n")[0])       // 输出书源信息
    java.log(`本地书源更新时间：${java.timeFormat(source.lastUpdateTime)}`) // 输出书源信息

    // 获取设置，备用书源使用旧版设置，书源从缓存获取设置
    if (source.bookSourceName.includes("备用")) {
        settings = JSON.parse(String(source.variableComment).match(RegExp(/{([\s\S]*?)}/gm)))
    } else {
        settings = getFromCache("pixivSettings")
    }
    if (settings !== null) {
        java.log("⚙️ 使用自定义设置")
    } else {
        settings = {}
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

    if (u.FAST === true) {
        settings.CONVERT_CHINESE = false      // 搜索：繁简通搜
        settings.SHOW_UPDATE_TIME = false     // 目录：显示章节更新时间
        settings.SHOW_ORIGINAL_LINK = false   // 目录：显示章节源链接
        settings.SHOW_CAPTIONS = false        // 正文：显示评论
    } else {
        settings.CONVERT_CHINESE = true       // 搜索：繁简通搜
        settings.SHOW_UPDATE_TIME = true      // 目录：显示章节更新时间
        settings.SHOW_ORIGINAL_LINK = true    // 目录：显示章节源链接
        settings.SHOW_CAPTIONS = true         // 正文：显示评论
    }
    u.settings = settings
    cache.put("pixivSettings", JSON.stringify(settings))  // 设置写入缓存

    u.debugFunc = (func) => {
        if (util.settings.DEBUG) {
            func()
        }
    }

    u.isLogin = function() {
        return cache.get("csfrToken") !== null
    }

    u.login = function() {
        let resp = java.startBrowserAwait(`https://accounts.pixiv.net/login,
    {"headers": {"User-Agent": "${java.getWebViewUA()}"}}`, '登录账号', false)
        if (resp.code() === 200) {
            this.getCookie(); this.getCsrfToken()
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
        if (pixivCookie.includes("first_visit_datetime")) {
            // java.log(pixivCookie)
            cache.put("pixivCookie", pixivCookie, 60*60)
            return pixivCookie
        }
    }

    u.removeCookie = function() {
        cookie.removeCookie('https://www.pixiv.net')
        cookie.removeCookie('https://accounts.pixiv.net')
        cookie.removeCookie('https://accounts.google.com')
        cookie.removeCookie('https://api.weibo.com')
        cache.delete("pixivCookie")
        cache.delete("csfrToken")  // 与登录设备有关
        cache.delete("headers")
    }

    // 获取 Csrf Token，以便进行收藏等请求
    // 获取方法来自脚本 Pixiv Previewer
    // https://github.com/Ocrosoft/PixivPreviewer
    // https://greasyfork.org/zh-CN/scripts/30766-pixiv-previewer/code
    u.getCsrfToken = function() {
        let csfrToken
        let html = java.webView(null, "https://www.pixiv.net/", null)
        try {
            csfrToken = html.match(/token\\":\\"([a-z0-9]{32})/)[1]
        } catch (e) {
            csfrToken = null
        }
        // java.log(csfrToken)
        cache.put("csfrToken", JSON.stringify(csfrToken))  // 与登录设备有关
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
    u.handNovels = function(novels, detailed=false) {
        let authors = getFromCache("blockAuthorList")  // 屏蔽作者
        if (authors !== null) {
            java.log(`屏蔽作者ID：${JSON.stringify(authors)}`)
            authors.forEach(author => {
                novels = novels.filter(novel => novel.userId !== String(author))
            })
        }

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
            // 默认搜索
            if (novel.isOneshot === undefined) {
                // novel.seriesId = novel.seriesId
                // novel.seriesTitle = novel.seriesTitle
                // novel.textCount = novel.textCount
                // novel.description = novel.description
                novel.coverUrl = novel.url
                // novel.createDate = novel.createDate
                // novel.updateDate = novel.updateDate
            } else {  // 搜索系列
                if (novel.isOneshot === true) {
                    novel.seriesId = undefined
                    novel.id = novel.novelId  // 获取真正的 novelId
                    novel.seriesTitle = undefined
                } else {
                    novel.seriesId = novel.id
                    novel.id = novel.novelId = novel.latestEpisodeId  // 获取真正的 novelId
                    novel.seriesTitle = novel.title
                }
                novel.textCount = novel.textLength
                novel.description = novel.caption
                novel.coverUrl = novel.cover.urls["480mw"]
                novel.createDate = novel.createDateTime
                novel.updateDate = novel.updateDateTime
            }

            // 正文详情页
            if (novel.content !== undefined) {
                novel.novelId = novel.id
                novel.tags = novel.tags.tags.map(item => item.tag)
                novel.textCount = novel.userNovels[`${novel.id}`].textCount
                // novel.latestChapter = novel.title
                // novel.description = novel.description
                novel.coverUrl = novel.userNovels[`${novel.id}`].url
                // novel.createDate = novel.createDate
                novel.updateDate = novel.uploadDate
                if (novel.seriesNavData !== undefined && novel.seriesNavData !== null) {
                    novel.seriesId = novel.seriesNavData.seriesId
                    novel.seriesTitle = novel.seriesNavData.title
                }
            }
            // 系列详情
            if (novel.firstNovelId !== undefined) {
                novel.seriesId = novel.id
                novel.id = novel.novelId = novel.firstNovelId
                novel.seriesTitle = novel.title
                novel.coverUrl = novel.cover.urls["480mw"]
            }

            if (novel.seriesId === undefined || novel.seriesId === null) {  // 单篇
                novel.tags.unshift("单本")
                novel.latestChapter = novel.title
                novel.detailedUrl = urlNovelDetailed(novel.id)
                novel.total = 1
            }
            if (novel.seriesId !== undefined && detailed === false) {
                novel.id = novel.seriesId
                novel.firstNovelId = novel.novelId
                novel.title = novel.seriesTitle
                novel.tags.unshift("长篇")
                novel.detailedUrl = urlSeriesDetailed(novel.seriesId)
                // novel.seriesNavData = {}
                // novel.seriesNavData.seriesId = novel.seriesId
                // novel.seriesNavData.title = novel.seriesTitle
            }

            if (novel.seriesId !== undefined && detailed === true) {
                let series = getAjaxJson(urlSeriesDetailed(novel.seriesId)).body
                novel.id = series.firstNovelId
                book.name = novel.title = series.title
                book.author = novel.userName
                novel.tags = novel.tags.concat(series.tags)
                novel.tags.unshift("长篇")
                book.wordCount = novel.textCount = series.publishedTotalCharacterCount
                novel.description = series.caption
                book.coverUrl = novel.coverUrl = series.cover.urls["480mw"]
                novel.createDate = series.createDate
                novel.updateDate = series.updateDate
                book.totalChapterNum = novel.total = series.publishedContentCount

                // 发送请求获取第一章 获取标签与简介
                let firstNovel = {}
                try {
                    firstNovel = getAjaxJson(urlNovelDetailed(series.firstNovelId)).body
                    novel.tags = novel.tags.concat(firstNovel.tags.tags.map(item => item.tag))
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
            novel.title = novel.title.replace(RegExp(/^\s+|\s+$/g), "")
            novel.coverUrl = urlCoverUrl(novel.coverUrl)
            novel.readingTime = `${novel.readingTime / 60} 分钟`
            novel.createDate = dateFormat(novel.createDate);
            novel.updateDate = dateFormat(novel.updateDate);

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
                novel.description = `\n书名：${novel.title}\n作者：${novel.userName}\n标签：${novel.tags}\n上传：${novel.createDate}\n更新：${novel.updateDate}\n简介：${novel.description}`
            } else {
                novel.description = `\n${novel.description}\n上传时间：${novel.createDate}\n更新时间：${novel.updateDate}`
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
            let pattern = "(https?://)?(www\\.)?pixiv\\.net/novel/series/\\d+"
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

        if (res.body !== undefined && res.body.seriesNavData !== undefined && res.body.seriesNavData !== null) {
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
    if (checkTimes === 0 && util.isLogin()) {
        let latestMsg = getAjaxJson(urlMessageThreadLatest(5))
        if (latestMsg.error === true) {
            java.log(JSON.stringify(latestMsg))
        } else if (latestMsg.body.total >= 1) {
            let msg = latestMsg.body.message_threads.filter(item => item.thread_name === "pixiv事務局")[0]
            if (msg !== undefined && new Date().getTime()- 1000*msg.modified_at <= 3*24*60*60*1000) { // 3天内进行提示
                sleepToast(`您于 ${java.timeFormat(1000*msg.modified_at)} 触发 Pixiv 【过度访问】，请修改密码并重新登录。\n如已修改请忽略`, 3)
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
    let uid = java.getResponse().headers().get("x-userid")
    if (uid != null) {
        cache.put("pixiv:uid", String(uid))
    }
}

function getHeaders() {
    let headers = {
        "accept": "application/json",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "zh-CN",
        // "content-type": "application/json; charset=utf-8",
        // "content-type": "application/x-www-form-urlencoded; charset=utf-8",
        "origin": "https//www.pixiv.net",
        "referer": "https://www.pixiv.net/",
        // "sec-ch-ua": `"Not/A)Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"`,
        // "sec-ch-ua-mobile": "?0",
        // "sec-ch-ua-platform": "Windows",
        // "sec-fetch-dest": "empty",
        // "sec-fetch-mode": "cors",
        // "sec-fetch-site": "same-origin",
        "user-agent": String(java.getUserAgent()),
        "x-csrf-token": cache.get("csfrToken"),
        "Cookie": cache.get("pixivCookie")
    }
    cache.put("headers", JSON.stringify(headers))
    return headers
}

function getBlockAuthorsFromSource() {
    let authors = []
    try {
        authors = JSON.parse(`[${source.getVariable()}]`)
        // sleepToast(JSON.stringify(authors))
    } catch (e) {
        sleepToast("🚫 屏蔽作者\n⚠️ 【书源】源变量设置有误\n输入作者ID，以英文逗号间隔，保存")
    }
    return authors
}

function syncBlockAuthorList() {
    let authors1 = getFromCache("blockAuthorList")
    let authors2 = getBlockAuthorsFromSource()
    if (authors1 === null) {
        cache.put("blockAuthorList", JSON.stringify(authors2))
    } else if (authors1.length > authors2.length) {
        cache.put("blockAuthorList", JSON.stringify(authors2))
        java.log("屏蔽作者：已将源变量同步至内存")
    }
}

publicFunc(); syncBlockAuthorList()
if (result.code() === 200) {
    getPixivUid(); util.getCookie(); getHeaders()
    if (!util.settings.FAST) checkMessageThread()   // 检测过度访问
}
util.debugFunc(() => {
    java.log(`DEBUG = ${util.settings.DEBUG}\n`)
    java.log(JSON.stringify(util.settings, null, 4))
    java.log(`${java.getUserAgent()}\n`)
    java.log(`${cache.get("csfrToken")}\n`)
    java.log(`${cache.get("pixivCookie")}\n`)
})
java.getStrResponse(null, null)