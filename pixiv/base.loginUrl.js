function login() {
    sleepToast("🔄 正在检测登陆状态，请稍候")
    if (isLogin()) {
        sleepToast("️🅿️ 登录账号\n✅ 已经登录过账号了\n\n可以点击【🔙 退出账号】来切换账号")
        return false
    }

    let resp = java.startBrowserAwait(`https://accounts.pixiv.net/login,
    {"headers": {"User-Agent": ${getWebViewUA()}}}`, '登录账号', false)
    if (resp.code() === 200) {
        getCookie(); getCsrfToken()
        return true
    } else {
        java.log(resp.code()); sleepToast("🅿️ 登录账号\n\n⚠️ 登录失败")
        return false
    }
}

function logout() {
    removeCookie()
    java.startBrowser("https://www.pixiv.net/logout.php", "退出账号")
    removeCookie()
    sleepToast(`✅ 已退出当前账号\n\n退出后请点击右上角的 ✔️ 退出\n\n登录请点击【登录账号】进行登录`)
}

function removeCookie() {
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
function getCsrfToken() {
    let csfrToken
    let html = java.webView(null, "https://www.pixiv.net/", null)
    try {
        csfrToken = html.match(/token\\":\\"([a-z0-9]{32})/)[1]
    } catch (e) {
        csfrToken = null
    }
    // java.log(csfrToken)
    cache.put("csfrToken", csfrToken)  // 与登录设备有关
    return csfrToken
}

function getCookie() {
    let pixivCookie = String(java.getCookie("https://www.pixiv.net/", null))
    if (pixivCookie.includes("first_visit_datetime")) {
        // java.log(pixivCookie)
        cache.put("pixivCookie", pixivCookie, 60*60)
        return pixivCookie
    } else {
        cache.delete("pixivCookie")
        sleepToast("未登录账号(pixivCookie)")
        return null
    }
}

function getNovel() {
    let novel = source.getLoginInfoMap()
    if (novel === undefined) novel = getFromCache("novel")
    return novel
}

function getPostBody(url, body, headers) {
    if (headers === undefined) headers = getFromCache("headers")
    if (isJsonString(body)) {
        headers["content-type"] = "application/json; charset=utf-8"
    } else if (typeof(body) == "string") {
        headers["content-type"] = "application/x-www-form-urlencoded; charset=utf-8"
    }
    try {
        return JSON.parse(java.post(url, body, headers).body())
    } catch (e) {
        // sleepToast(e)
        // sleepToast(JSON.stringify(headers))
        if (String(e).includes(400)) sleepToast(`⚠️ 缺少 headers`, 1)
        else if (String(e).includes(403)) sleepToast(`⚠️ 缺少 cookie 或 cookie 过期`, 1)
        else if (String(e).includes(404)) sleepToast(`⚠️ 404`, 1)
        else if (String(e).includes(422)) sleepToast(`⚠️ 请求信息有误`, 1)
        return {error: true}
    }
}

function novelBookmarkAdd(restrict=0) {
    let novel = getNovel()
    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/add",
        JSON.stringify({"novel_id": novel.id, "restrict": restrict, "comment":"", "tags":[]})
    )
    if (resp.error === true) sleepToast(`❤️ 收藏小说
    \n\n⚠️ 收藏【${novel.title}】失败`)
    else if (resp.body === null) sleepToast(`❤️ 收藏小说\n\n✅ 已经收藏【${novel.title}】了`)
    else {
        cache.put(`collect${novel.id}`, resp.body)
        sleepToast(`❤️ 收藏小说\n\n✅ 已收藏【${novel.title}】`)

        let likeNovels = getFromCache("likeNovels")
        likeNovels.push(Number(novel.id))
        putInCache("likeNovels", likeNovels)

        let novelObj = getAjaxJson(urlNovelDetailed(novel.id))
        novelObj.body.isBookmark = true
        putInCache(urlNovelDetailed(novel.id), novelObj, cacheSaveSeconds)
    }
}

function getNovelBookmarkId(novelId) {
    let bookmarkId = getFromCache(`collect${novelId}`)
    if (bookmarkId === null) {
        bookmarkId = getAjaxJson(urlNovelBookmarkData(novelId), true).body.bookmarkData.id
    }
    return bookmarkId
}

function novelBookmarkDelete() {
    let novel = getNovel()
    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/delete",
        `del=1&book_id=${getNovelBookmarkId(novel.id)}`
    )
    if (resp.error === true) sleepToast(`❤️ 收藏小说\n\n⚠️ 取消收藏【${novel.title}】失败`)
    else {
        cache.delete(`collect${novel.id}`)
        sleepToast(`❤️ 收藏小说\n\n✅ 已取消收藏【${novel.title}】`)

        let likeNovels = getFromCache("likeNovels")
        likeNovels = likeNovels.filter(item => item !== Number(novel.id))
        putInCache("likeNovels", likeNovels)

        let novelObj = getAjaxJson(urlNovelDetailed(novel.id))
        novelObj.body.isBookmark = false
        putInCache(urlNovelDetailed(novel.id), novelObj, cacheSaveSeconds)
    }
}

function novelsBookmarkDelete(novelIds) {
    let bookmarkIds = []
    novelIds.forEach(novelId => {bookmarkIds.push(getNovelBookmarkId(novelId))})
    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/remove",
        JSON.stringify({"bookmarkIds": bookmarkIds})
    )
    if (resp.error === true) sleepToast("❤️ 收藏小说\n\n⚠️ 取消收藏失败", 1)
    else {
        sleepToast("❤️ 收藏小说\n\n✅ 已取消收藏")
        novelIds.forEach(novelId => {cache.delete(`collect${novelId}`)})

        let likeNovels = getFromCache("likeNovels")
        likeNovels = likeNovels.filter(item => !novelIds.includes(Number(item)))
        putInCache("likeNovels", likeNovels)

        novelIds.forEach(novelId => {
            let novelObj = getAjaxJson(urlNovelDetailed(novelId))
            novelObj.body.isBookmark = false
            putInCache(urlNovelDetailed(novelId), novelObj, cacheSaveSeconds)
        })
    }
}

function novelBookmarkFactory(code) {
    let novel = getNovel()
    let collectId = getFromCache(`collect${novel.id}`)
    if (collectId >= 1) code = 0

    if (code === 0) novelBookmarkDelete()
    else if (code === 1) novelBookmarkAdd(0)
    else if (code === 2) novelBookmarkAdd(1)
}

function novelMarker(page=1) {
    let novel = getNovel()
    let lastMarker = getFromCache(`marker${novel.id}`)
    if (lastMarker === true) page = 0

    let resp = getPostBody(
        "https://www.pixiv.net/novel/rpc_marker.php",
        `mode=save&i_id=${novel.id}&u_id=${getFromCache("pixiv:uid")}&page=${page}`
    )
    java.log(`mode=save&i_id=${novel.id}&u_id=${getFromCache("pixiv:uid")}&page=${page}`)
    if (resp.error === true) sleepToast("🏷️ 添加书签\n\n⚠️ 操作失败", 1)
    else if (lastMarker === true) {
        cache.put(`marker${novel.id}`, false)
        sleepToast(`🏷️ 添加书签\n\n✅ 已删除书签`)
    } else {
        cache.put(`marker${novel.id}`, true)
        sleepToast(`🏷️ 添加书签\n\n✅ 已加入书签`)
    }
}

function seriesWatch() {
    let novel = getNovel()
    let resp = getPostBody(
        `https://www.pixiv.net/ajax/novel/series/${novel.seriesId}/watch`,
        "{}"
    )
    if (resp.error === true) sleepToast(`📃 追更系列\n\n⚠️ 追更【${novel.seriesTitle}】失败`, 1)
    else {
        cache.put(`watch${novel.seriesId}`, true)
        sleepToast(`📃 追更系列\n\n✅ 已追更【${novel.seriesTitle}】`)

        let watchedSeries = getFromCache("watchedSeries")
        watchedSeries.push(Number(novel.seriesId))
        putInCache("watchedSeries", watchedSeries)

        let novelObj = getAjaxJson(urlSeriesDetailed(novel.seriesId))
        novelObj.body.isWatched = true
        putInCache(urlSeriesDetailed(novel.seriesId), novelObj, cacheSaveSeconds)
    }
}

function seriesUnWatch() {
    let novel = getNovel()
    let resp = getPostBody(
        `https://www.pixiv.net/ajax/novel/series/${novel.seriesId}/unwatch`,
        "{}"
    )
    if (resp.error === true) sleepToast(`📃 追更系列\n\n⚠️ 取消追更【${novel.seriesTitle}】失败`, 1)
    else {
        cache.delete(`watch${novel.seriesId}`)
        sleepToast(`📃 追更系列\n\n✅ 已取消追更【${novel.seriesTitle}】`)

        let watchedSeries = getFromCache("watchedSeries")
        watchedSeries = watchedSeries.filter(item => item !== Number(novel.seriesId))
        putInCache("watchedSeries", watchedSeries)

        let novelObj = getAjaxJson(urlSeriesDetailed(novel.seriesId))
        novelObj.body.isWatched = false
        putInCache(urlSeriesDetailed(novel.seriesId), novelObj, cacheSaveSeconds)
    }
}

function seriesWatchFactory(code=1) {
    let novel = getNovel()
    if (!novel.seriesId) {
        return sleepToast(`📃 追更系列\n\n⚠️ 【${novel.title}】非系列小说，无法加入追更列表`)
    }

    let lastStatus = getFromCache(`watch${novel.seriesId}`)
    if (lastStatus === true) code = 0
    if (code === 0) seriesUnWatch()
    else if (code === 1) seriesWatch()
}

function userFollow(restrict=0) {
    let novel = getNovel()
    let resp = getPostBody(
        "https://www.pixiv.net/bookmark_add.php",
        `mode=add&type=user&user_id=${novel.userId}&tag=""&restrict=${restrict}&format=json`
    )
    if (resp.error === true) sleepToast(`⭐️ 关注作者\n\n⚠️ 关注【${novel.userName}】失败`, 1)
    else {
        sleepToast(`⭐️ 关注作者\n\n✅ 已关注【${novel.userName}】`)
        cache.put(`follow${novel.userId}`, true)
    }
}

function userUnFollow() {
    let novel = getNovel()
    let resp = getPostBody(
        "https://www.pixiv.net/rpc_group_setting.php",
        `mode=del&type=bookuser&id=${novel.userId}`
    )
    if (resp.error === true) sleepToast(`⭐️ 关注作者\n\n⚠️ 取消关注【${novel.userName}】失败`, 1)
    else {
        sleepToast(`⭐️ 关注作者\n\n✅ 已取消关注【${novel.userName}】`)
        cache.delete(`follow${novel.userId}`)
    }
}

function userFollowFactory(code=1) {
    let novel = getNovel()
    let lastStatus = getFromCache(`follow${novel.userId}`)
    if (lastStatus === true) code = 0

    if (code === 0) userUnFollow()
    else if (code === 1) userFollow()
}

function userBlackList() {
    let action = "block"  // 拉黑作者，非屏蔽作者作品
    let novel = getNovel()
    let lastStatus = getFromCache(`block${novel.userId}`)
    if (lastStatus === true) action = "unblock"

    let resp = getPostBody(
        `https://www.pixiv.net/ajax/block/save`,
        JSON.stringify({"user_id": novel.userId, "action": action})
    )
    // java.log(JSON.stringify({"user_id": novel.userId, "action": action}))
    if (resp.error === true) sleepToast("⚠️ 操作失败", 1)
    else if (lastStatus === true) {
        cache.put(`block${novel.userId}`, false)
        sleepToast(`✅ 已取消拉黑【${novel.userName}】\n\n已允许其点赞、评论、收藏、关注、私信等`)
    } else {
        cache.put(`block${novel.userId}`, true)
        sleepToast(`✅ 已拉黑【${novel.userName}】(Pixiv)\n\n已禁止其点赞、评论、收藏、关注、私信等`)
    }
}

function userBlock() {
    let authors = getFromCache("blockAuthorList")
    let novel = getNovel()
    if (authors.includes(Number(novel.userId))) {
        authors = authors.filter(author => author !== Number(novel.userId))
        sleepToast(`🚫 屏蔽作者\n\n✅ 已取消屏蔽【${novel.userName}】\n现已恢复显示其小说`)
    } else if (novel.userId !== undefined && novel.userId !== null) {
        authors.push(Number(novel.userId))
        sleepToast(`🚫 屏蔽作者\n\n✅ 本地已屏蔽【${novel.userName}】\n今后不再显示其小说`)
    }
    putInCache("blockAuthorList", authors)
    source.setVariable(authors.toString())
    // sleepToast(JSON.stringify(authors))
}

function novelCommentAdd() {
    let resp, novel = getNovel()
    let userId = getFromCache("pixiv:uid")
    let comment = String(result.get("发送评论")).trim()
    if (comment === "") {
        return sleepToast(`✅ 发送评论\n⚠️ 请输入需要发送的评论\n\n输入【评论内容；评论ID】可回复该条评论，如【非常喜欢；123456】\n\n📌 当前章节：${novel.title}\n\n如非当前章节，请刷新正文`)
    }

    let matched = comment.match(RegExp(/(；|;\s*)\d{8,}/))
    if (matched) {
        let commentId = comment.match(new RegExp(/；(\d{8,})/))[1]
        comment = comment.replace(new RegExp(`(；|;\s*)${commentId}`), "")
        resp = getPostBody(
            "https://www.pixiv.net/novel/rpc/post_comment.php",
            `type=comment&novel_id=${novel.id}&author_user_id=${userId}&comment=${encodeURI(comment)}&parent_id=${commentId}`)
    } else {
        resp = getPostBody(
            "https://www.pixiv.net/novel/rpc/post_comment.php",
            `type=comment&novel_id=${novel.id}&author_user_id=${userId}&comment=${encodeURI(comment)}`
        )
    }

    if (resp.error === true) sleepToast("✅ 发送评论\n\n⚠️ 评论失败", 1)
    else sleepToast(`✅ 发送评论\n\n✅ 已在【${novel.title}】发布评论：\n${comment}`)
}

function getNovelCommentID(novelId, commentText) {
    let list = [], uid = String(getFromCache("pixiv:uid"))
    let resp = getAjaxJson(urlNovelComments(novelId, 0, 50), true)
    resp.body.comments.forEach(comment => {
        if (comment.userId === uid && comment.comment === commentText) list.push(comment.id)

        if (comment.hasReplies === true) {
            let resp = getAjaxJson(urlNovelCommentsReply(comment.id, 1), true)
            resp.body.comments.forEach(comment => {
                if (comment.userId === uid && comment.comment === commentText) list.push(comment.id)
            })
        }
    })
    // java.log(JSON.stringify(list))
    return list
}

function novelCommentDelete() {
    let commentIDs, novel = getNovel()
    let comment = String(result.get("发送评论")).trim()
    if (comment === "") {
        return sleepToast(`🗑 删除评论\n⚠️ 请输入需要删除的【评论ID】\n或输入需要删除的【评论内容】\n\n📌 当前章节：${novel.title}\n\n如非当前章节，请刷新正文`)
    }

    let matched = comment.match(RegExp(/\d{8,}/))
    if (matched) {
        commentIDs = [matched[0]]
    } else {
        commentIDs = getNovelCommentID(novel.id, comment)
        java.log(JSON.stringify(commentIDs))
        if (commentIDs.length === 0) {
            return sleepToast(`🗑 删除评论\n\n⚠️ 未能找到这条评论\n请检查是否有错别字或标点符号是否一致`)
        }
    }

    commentIDs.forEach(commentID =>{
        let resp = getPostBody(
            "https://www.pixiv.net/novel/rpc_delete_comment.php",
            `i_id=${novel.id}&del_id=${commentID}`
        )
        // java.log(JSON.stringify(resp))
        if (resp.error === true) sleepToast("🗑 删除评论\n\n⚠️ 评论删除失败", 1)
        else sleepToast(`🗑 删除评论\n\n✅ 已在【${novel.title}】删除评论：\n${comment}`)
    })
}

function startBrowser(url, title) {
    let msg = "", headers = `{"headers": {"User-Agent":"${getWebViewUA()}"}}`
    if (url.includes("https://www.pixiv.net")) {
        if (url.includes("settings")) msg += "⚙️ 账号设置"
        else msg += "⤴️ 分享小说"
        msg += "\n\n即将打开 Pixiv\n请确认已开启代理/梯子/VPN等"
    } else if (url.includes("https://github.com")) {
        if (url.includes("issues")) msg += "🐞 反馈问题"
        else if (url.includes("doc")) msg += "🔰 使用指南"
        else msg += "⭐️ 收藏项目"
        msg += "\n\n即将打开 Github\n请确认已开启代理/梯子/VPN等"
    }
    sleepToast(msg, 0.01)
    java.startBrowser(`${url}, ${headers}`, title)
}

function shareFactory(type) {
    let novel = getNovel()
    if (novel === undefined || novel === null) return sleepToast("⚠️ 请在小说阅读页面，使用本功能")
    if (type.includes("author")) {
        startBrowser(urlUserUrl(novel.userId), novel.userName)
    }
    else if (type.includes("novel") || (!novel.seriesId)) {
        startBrowser(urlNovelUrl(novel.id), novel.title)
    }
    else if (type.includes("series") && novel.seriesId) {
        startBrowser(urlSeriesUrl(novel.seriesId), novel.seriesTitle)
    }
}

function startPixivSettings() {
    startBrowser("https://www.pixiv.net/settings/viewing", "账号设置")
}
function startGithubIssue() {
    startBrowser("https://github.com/windyhusky/PixivSource/issues", "反馈问题")
}
function startGithubReadme() {
    startBrowser("https://github.com/windyhusky/PixivSource/blob/main/doc/Pixiv.md", "使用指南")
}

function checkStatus(status) {
    if (eval(String(status)) === true) return "❤️"
    else return "🖤"
}

function charpterReading() {
    let novel = getNovel()
    // let novel = source.getLoginInfoMap()
    let msg = `📌 当前章节\n\n${checkStatus(novel.isWatched)} 系列：${novel.seriesTitle}\n${checkStatus(novel.isBookmark)} 章节：${novel.title}\n👤 作者：${novel.userName}\n\n如非当前章节，请刷新正文`
    msg = msg.replace("🖤 系列：\n", "")
    sleepToast(msg, 2)
}

function readMeLogin() {
    return sleepToast(`🅿️ 登录界面功能\n
    使用收藏、追更、关注作者、评论等功能时，需要登录
    使用前请先刷新正文，获取当前章节信息\n
    点击【📌 当前章节】查看书源内部章节信息`.replace("    ",""), 5)
}

function readMeSearch() {
    return sleepToast(`🔍 搜索说明\n
    标签之间需要以【空格】间隔
    ➖ 排除标签：#标签1 -标签2
    👤 作者专搜：@搜索作者名称
    #️ 标签专搜：#标签1 标签2 
    ⏬ 字数筛选1：#标签1 标签2 字数3k5
    ⏬ 字数筛选2：@作者的名称 字数3w5`.replace("    ",""), 5)
}

let settingsName = {
    "SEARCH_AUTHOR": "🔍 搜索作者",
    "CONVERT_CHINESE": "🀄️ 繁简通搜",
    "SHOW_UPDATE_TIME": "📅 更新时间",
    "SHOW_ORIGINAL_LINK": "🔗 原始链接",
    "SHOW_COMMENTS": "💬 显示评论",
    "MORE_INFORMATION": "📖 更多简介",
    "REPLACE_TITLE_MARKS": "📚 恢复《》",
    "SHOW_CAPTIONS": "🖼️ 显示描述",
    "SHOW_LIKE_NOVELS" :"❤️ 显示收藏",
    "SHOW_WATCHED_SERIES" :"📃 显示追更",
    "FAST": "⏩ 快速模式",
    "DEBUG": "🐞 调试模式"
}

function statusMsg(status) {
    if (status === true) return "✅ 已开启"
    else if (status === false) return "🚫 已关闭"
    else return "🈚️ 未设置"
}

// 检测快速模式修改的4个设置
function getSettingStatus(mode="") {
    let keys = [], msgList = []
    let settings = getFromCache("pixivSettings")
    if (mode !== "FAST") keys = Object.keys(settingsName)
    else keys = Object.keys(settingsName).slice(0, 5)
    for (let i in keys) {
        msgList.push(`${statusMsg(settings[keys[i]])}　${settingsName[keys[i]]}`)
    }
    return msgList.join("\n").trim()
}

function showSettings() {
    sleepToast(`⚙️ 当前设置\n\n${getSettingStatus()}`)
}

function editSettings(object) {
    let msg, status
    let settings = getFromCache("pixivSettings")
    if (object === "") {
        settings.SEARCH_AUTHOR = true       // 搜索：默认搜索作者名称
        settings.CONVERT_CHINESE = true     // 搜索：搜索时进行繁简转换
        settings.SHOW_LIKE_NOVELS = true    // 搜索：搜索结果显示收藏小说
        settings.SHOW_WATCHED_SERIES = true // 搜索：搜索结果显示追整系列小说
        settings.MORE_INFORMATION = false   // 详情：书籍简介显示更多信息
        settings.SHOW_UPDATE_TIME = true    // 目录：显示更新时间，但会增加少许请求
        settings.SHOW_ORIGINAL_LINK = true  // 目录：显示原始链接，但会增加大量请求
        settings.REPLACE_TITLE_MARKS = true // 正文：注音内容为汉字时，替换为书名号
        settings.SHOW_CAPTIONS = true       // 正文：章首显示描述
        settings.SHOW_COMMENTS = true       // 正文：章尾显示评论
        settings.FAST  = false              // 全局：快速模式
        settings.DEBUG = false              // 全局：调试模式
        putInCache("pixivSettings", settings)
        msg = `\n✅ 已恢复　🔧 默认设置\n\n${getSettingStatus()}`

    } else if (object === "FAST") {
        if (settings[object] === true) {
            putInCache("pixivLastSettings", settings)
            settings.CONVERT_CHINESE = false      // 搜索：繁简通搜
            settings.SEARCH_AUTHOR = false        // 搜索：默认搜索作者
            settings.SHOW_UPDATE_TIME = false     // 目录：显示章节更新时间
            settings.SHOW_ORIGINAL_LINK = false   // 目录：显示章节源链接
            settings.SHOW_COMMENTS = false        // 正文：显示评论
        } else {
            settings = getFromCache("pixivLastSettings")
            settings.SEARCH_AUTHOR = true
            settings.FAST = false
        }
        putInCache("pixivSettings", settings)
        let status = settings[object]
        let message = getSettingStatus("FAST")
        msg = `\n${statusMsg(status)}　${settingsName[object]}\n\n${message}`

    } else {
        if (settings[object] !== undefined) {
            status = settings[object] = (!settings[object])
        } else {
            status = settings[object] = true  // 无设置则默认开启
        }
        msg = `${statusMsg(status)}　${settingsName[object]}`
    }
    sleepToast(msg)
    putInCache("pixivSettings", settings)
}

function cleanCache() {
    let novel = getNovel()
    cache.delete(`${urlNovelUrl(novel.id)}`)
    cache.delete(`${urlNovelDetailed(novel.id)}`)
    // cache.delete(`${urlSearchNovel(novel.title, 1)}`)
    // if (novel.seriesId) {
    //     cache.delete(`${urlSeriesUrl(novel.seriesId)}`)
    //     cache.delete(`${urlSeriesDetailed(novel.seriesId)}`)
    //     cache.delete(`${urlSearchSeries(novel.seriesTitle, 1)}`)
    // }
    sleepToast(`🧹 清除缓存\n\n📌 当前章节：${novel.title}\n\n已清除本章正文缓存，刷新正文以更新`, 5)
}

let maxPagesName = {
    "seriesMaxPages": "系列最大页码",
    "novelsMaxPages": "单篇最大页码"
}

function showMaxPages() {
    let keys = Object.keys(maxPagesName)
    let key = getFromCache("maxPagesKey")
    if (!key) key = keys[0]
    if (key === keys[0]) key = keys[1]
    if (key === keys[1]) key = keys[0]
    putInCache("maxPagesKey", key)
    return sleepToast(`📄 搜索页码\n设置 #️⃣ 搜索标签的最大页码数\n
    当前${maxPagesName[keys[0]]}：${getFromCache(keys[0])}\n当前${maxPagesName[keys[1]]}：${getFromCache(keys[1])}\n
    点击 ⏫ 增加页码/ ⏬ 减少页码\n调整【${maxPagesName[key]}】\n
    📌 页码越多，小说越多，速度越慢`.replace("    ", ""))
}

function editMaxPages(method) {
    let msg = "", key = getFromCache("maxPagesKey")
    if (!key) key = Object.keys(maxPagesName)[0]
    let maxPages = getFromCache(key)
    if (!maxPages) maxPages = 1
    if (method.includes("add")) maxPages += 1
    if (method.includes("min")) maxPages -= 1

    if (maxPages <= 1) {
        maxPages = 1
        msg += "⚠️ 搜索页码不能再减小了\n"
    }
    if (maxPages >= 3) {
        msg += "⚠️ 搜索页码越多，搜索速度越慢\n"
    }
    if (maxPages >= 10) {
        maxPages = 10
        msg += "⚠️ 搜索页码不能再增大了\n"
    }
    putInCache(`${key}`, maxPages)
    sleepToast(`📄 搜索页码\n\n当前搜索【${maxPagesName[key]}】：${maxPages}\n\n${(msg)}`.trim())
    return maxPages
}

function sleepToast(text, second=0) {
    java.log(text)
    // java.toast(text)
    java.longToast(text)
    sleep(1000*second)
}