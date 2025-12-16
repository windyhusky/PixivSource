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
    cache.delete("pixiv:uid")
    cache.delete("pixivCsrfToken")  // 与登录设备有关
    cache.delete("headers")
}

function removeCacheList(listName) {
    let list = getFromCache(listName)
    list.forEach(item => cache.delete(`collect${item}`))
    if (listName !== "blockAuthorList") cache.delete(listName)
}

function removeLikeDataCache() {
    // 删除 likeNovels 与 watchedSeries
    removeCacheList("likeNovels")
    removeCacheList("watchedSeries")
}

function removeSettingsCache() {
    // 删除 自动翻页的最大页码
    cache.delete("maxPagesKey")
    cache.delete("novelsMaxPages")
    cache.delete("seriesMaxPages")

    // 删除 屏蔽作者名单
    // removeCacheList("blockAuthorList")
    // 删除  屏蔽关键词
    // cache.delete("tagsBlockWords")
    // cache.delete("captionBlockWords")
}

function getCookie() {
    let pixivCookie = String(java.getCookie("https://www.pixiv.net/", null))
    if (isLogin()) cache.put("pixivCookie", pixivCookie, 60*60)
}

// 获取 Csrf Token，以便进行收藏等请求
// 获取方法来自脚本 Pixiv Previewer
// https://github.com/Ocrosoft/PixivPreviewer
// https://greasyfork.org/zh-CN/scripts/30766-pixiv-previewer/code
function getCsrfToken() {
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

function getNovel() {
    let environment = getFromCache("pixivEnvironment")
    if (environment.IS_LYC_BRUNCH) {
        try {
            let novel = {}
            novel.id = chapter.url.match(/\d+/)[0]
            novel.title = chapter.title
            novel.userName = book.author.replace("@", "")
            if (book.bookUrl.includes("series")) {
                novel.seriesId = book.bookUrl.match(/\d+/)[0]
                novel.seriesTitle = book.name
            } else {
                novel.seriesId = 0
                novel.seriesTitle = ""
            }

            let resp = getAjaxJson(urlIP(urlNovelDetailed(novel.id))).body
            novel.userId = resp.userId
            if (resp.pollData) {
                novel.pollChoicesCount = resp.pollData.choices.length
            } else {
                novel.pollChoicesCount = 0
            }
            return novel
        } catch (e) {
            // 无法阻止后续函数在日志中报错
            return sleepToast("🔰 功能提示\n\n⚠️ 请在【小说正文】使用该功能")
        }
    } else {  // 兼容用
        let novel = source.getLoginInfoMap()
        if (!novel) novel = getFromCache("novel")
        return novel
    }
}

function getPostBody(url, body, headers) {
    if (headers === undefined) headers = getFromCache("headers")
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

function novelBookmarkAdd(restrict) {
    if (restrict === undefined) restrict = 0
    let novel = getNovel()
    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/add",
        JSON.stringify({"novel_id": novel.id, "restrict": restrict, "comment":"", "tags":[]})
    )
    if (resp.error === true) {
        sleepToast(`❤️ 收藏小说\n\n⚠️ 收藏【${novel.title}】失败`)
        shareFactory("novel")
    } else if (resp.body === null) {
        sleepToast(`❤️ 收藏小说\n\n✅ 已经收藏【${novel.title}】了`)
    } else {
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
    if (resp.error === true) {
        sleepToast(`❤️ 收藏小说\n\n⚠️ 取消收藏【${novel.title}】失败`)
        shareFactory("novel")
    } else {
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

function novelsBookmarkDelete() {
    let novel = getNovel()
    if (!novel.seriesId) {
        sleepToast(`🖤 取消收藏系列\n\n⚠️ 【${novel.title}】非系列小说，现已取消收藏本篇小说`)
        return novelBookmarkDelete(0)
    } else {
        sleepToast(`🖤 取消收藏系列\n\n🔄 正在取消收藏系列【${novel.seriesTitle}】，请稍后……`, 2)
    }

    let bookmarkIds = []
    let novelIds = getFromCache(`novelIds${novel.seriesId}`)
    novelIds.forEach(novelId => {bookmarkIds.push(getNovelBookmarkId(novelId))})
    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/remove",
        JSON.stringify({"bookmarkIds": bookmarkIds})
    )
    if (resp.error === true) {
        sleepToast(`🖤 取消收藏系列\n\n⚠️ 取消收藏【${novel.seriesTitle}】的篇目失败`, 2)
        shareFactory("series")
    } else {
        sleepToast(`🖤 取消收藏系列\n\n✅ 已取消收藏【${novel.seriesTitle}】的全部篇目`)
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

function novelsBookmarkAdd() {
    let novel = getNovel()
    if (!novel.seriesId) {
        sleepToast(`❤️ 收藏系列\n\n⚠️ 【${novel.title}】非系列小说，现已收藏本篇小说`)
        return novelBookmarkAdd(0)
    } else {
        sleepToast(`❤️ 收藏系列\n\n🔄 正在收藏系列【${novel.seriesTitle}】，请稍后……`, 2)
    }

    let novelIds = getFromCache(`novelIds${novel.seriesId}`)
    let likeNovels = getFromCache("likeNovels")
    if (likeNovels === null) likeNovels = []
    novelIds.forEach(novelId => {
        if (likeNovels && !likeNovels.includes(Number(novelId))) {
            sleep(0.5 * 1000 * Math.random())
            let resp = getPostBody(
                "https://www.pixiv.net/ajax/novels/bookmarks/add",
                JSON.stringify({"novel_id": novelId, "restrict": 0, "comment": "", "tags": []})
            )

            if (resp.error === true) {
                sleepToast(`❤️ 收藏系列\n\n⚠️ 收藏【${novelId}】失败`)
                shareFactory("series")
            } else if (resp.body === null) {
                // sleepToast(`❤️ 收藏小说\n\n✅ 已经收藏【${novel.title}】了`)
            } else {
                cache.put(`collect${novelId}`, resp.body)
                likeNovels.push(Number(novelId))

                let novelObj = getAjaxJson(urlNovelDetailed(novelId))
                novelObj.body.isBookmark = true
                putInCache(urlNovelDetailed(novelId), novelObj, cacheSaveSeconds)
            }
        }
    })
    putInCache("likeNovels", likeNovels)
    sleepToast(`❤️ 收藏系列\n\n✅ 已经收藏【${novel.seriesTitle}】全部章节`)
}

function novelBookmarkFactory(code) {
    let novel = getNovel()
    let collectId = getFromCache(`collect${novel.id}`)
    if (collectId >= 1) code = 0

    if (code === 0) novelBookmarkDelete()
    else if (code === 1) novelBookmarkAdd(0)
    else if (code === 2) novelBookmarkAdd(1)
}

function novelMarker(page) {
    if (page === undefined) page = 1
    let novel = getNovel()
    let lastMarker = getFromCache(`marker${novel.id}`)
    if (lastMarker === true) page = 0

    let resp = getPostBody(
        "https://www.pixiv.net/novel/rpc_marker.php",
        `mode=save&i_id=${novel.id}&u_id=${getFromCache("pixiv:uid")}&page=${page}`
    )
    java.log(`mode=save&i_id=${novel.id}&u_id=${getFromCache("pixiv:uid")}&page=${page}`)
    if (resp.error === true) {
        sleepToast("🏷️ 添加书签\n\n⚠️ 操作失败", 1)
        shareFactory("novel")
    } else if (lastMarker === true) {
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
    if (resp.error === true) {
        sleepToast(`📃 追更系列\n\n⚠️ 追更【${novel.seriesTitle}】失败`, 1)
        shareFactory("series")
    } else {
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
    if (resp.error === true) {
        sleepToast(`📃 追更系列\n\n⚠️ 取消追更【${novel.seriesTitle}】失败`, 1)
        shareFactory("series")
    } else {
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

function seriesWatchFactory(code) {
    if (code === undefined) code = 1
    let novel = getNovel()
    if (!novel.seriesId) {
        return sleepToast(`📃 追更系列\n\n⚠️ 【${novel.title}】非系列小说，无法加入追更列表`)
    }

    let lastStatus = getFromCache(`watch${novel.seriesId}`)
    if (lastStatus === true) code = 0
    if (code === 0) seriesUnWatch()
    else if (code === 1) seriesWatch()
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
        cache.put(`follow${novel.userId}`, true)
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
    if (!authors) authors = []
    let authorsMap = getFromCacheMap("blockAuthorMap")
    if (!authorsMap || authorsMap.size === 0) {
        authorsMap = new Map()
        authors.forEach(author => {
            authorsMap.set(author, getAjaxJson(urlUserDetailed(author)).body.name)
        })
    }

    let novel = getNovel()
    if (authorsMap.has(String(novel.userId))) {
        authorsMap.delete(String(novel.userId))
        sleepToast(`🚫 屏蔽作者\n\n✅ 已取消屏蔽【${novel.userName}】\n现已恢复显示其小说`)
    } else if (!!novel.userId) {
        authorsMap.set(String(novel.userId), novel.userName)
        sleepToast(`🚫 屏蔽作者\n\n✅ 本地已屏蔽【${novel.userName}】\n今后不再显示其小说`)
    }

    authors = Array.from(authorsMap.keys())
    putInCache("blockAuthorList", authors)
    putInCacheMap("blockAuthorMap", authorsMap)
    // source.setVariable(authors.toString())
    // sleepToast(JSON.stringify(authors))
}

function novelCommentAdd() {
    let resp, novel = getNovel()
    let userId = getFromCache("pixiv:uid")
    let comment = String(result.get("输入内容")).trim()
    if (comment === "") {
        return sleepToast(`✅ 发送评论\n⚠️ 请在【输入内容】输入评论\n\n输入【评论内容；评论ID】可回复该条评论，如【非常喜欢；123456】\n\n📌 当前章节：${novel.title}\n如非当前章节，请刷新正文`)
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

    if (resp.error === true) {
        sleepToast("✅ 发送评论\n\n⚠️ 评论失败", 1)
        shareFactory("novel")
    } else {
        sleepToast(`✅ 发送评论\n\n✅ 已在【${novel.title}】发布评论：\n${comment}`)
    }
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
    let comment = String(result.get("输入内容")).trim()
    if (comment === "") {
        return sleepToast(`🗑 删除评论\n⚠️ 请在【输入内容】输入需要删除的【评论ID】\n或输入需要删除的【评论内容】\n\n📌 当前章节：${novel.title}\n如非当前章节，请刷新正文`)
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
        if (resp.error === true) {
            sleepToast("🗑 删除评论\n\n⚠️ 评论删除失败", 1)
            shareFactory("novel")
        } else {
            sleepToast(`🗑 删除评论\n\n✅ 已在【${novel.title}】删除评论：\n${comment}`)
        }
    })
}

function novelPollAnswer() {
    let novel = getNovel()
    // novel.pollChoicesCount = getAjaxJson(urlNovelDetailed(novel.id)).body.pollData.selectedValue
    if (!novel.pollChoicesCount) {
        return sleepToast(`📃 小说投票\n\n⚠️ 该小说【${novel.title}】无投票信息，建议【清除缓存】【刷新】后重试`)
    }

    let choiceId = String(result.get("输入内容")).trim()
    if (!choiceId) {
        return sleepToast(`📃 小说投票\n\n⚠️ 投票失败：请在【输入内容】输入投票选项(数字)`)
    } else if (Number(choiceId) > novel.pollData.selectedValue) {
        return sleepToast(`📃 小说投票\n\n⚠️ 投票失败：选项${choiceId}超出范围`)
    } else if (Number(choiceId) <= 0 || Number(choiceId) > novel.pollChoicesCount) {
        return sleepToast(`📃 小说投票\n\n⚠️ 投票失败：选项${choiceId}超出范围`)
    }

    let resp = getPostBody(
        `https://www.pixiv.net/ajax/novel/${novel.id}/poll/answer`,
        JSON.stringify({"choice_id": choiceId})
    )
    // 200 成功，403 重复投票，400 选项超过范围
    if (resp.error === true) {
        if (resp.errMsg.includes("403")) {
            sleepToast(`📃 小说投票\n\n✅ 已经投过票了`)
        } else {
            sleepToast(`📃 小说投票\n\n⚠️ 投票失败`)
            shareFactory("novel")
        }
    } else {
        sleepToast(`📃 小说投票\n\n✅ 投票成功`)
    }
}

let wordsType = {
    "caption": "📃 简介屏蔽列表",
    "tags": "#️ 标签屏蔽列表",
    "authors": "👤 作者屏蔽列表"
}

function printAuthorMap(map) {
    let text = ""
    map.forEach((value, key) => {
        text += `@${value} ${key}\n`
    })
    return text.trim()
}

function blockShowFactory() {
    let keys = Object.keys(wordsType)
    let key = getFromCache("wordsType")

    // 切换屏蔽列表
    let index = keys.indexOf(key) + 1
    if (index === keys.length) index = 0
    key = keys[index]
    putInCache("wordsType", key)

    if (key === "authors") {
        let words = printAuthorMap(getFromCacheMap("blockAuthorMap"))
        if (!words) words = ""
        sleepToast(`👀 查看屏蔽\n${wordsType[key]}\n\n${words}`, 2)
    } else {
        let words = getFromCache(`${key}BlockWords`)
        if (!words) words = []
        sleepToast(`👀 查看屏蔽\n${wordsType[key]}\n\n${words.join("\n")}`, 2)
    }
}

function blockWordAdd() {
    let method = getFromCache("wordsType")
    let blockWords = getFromCache(`${method}BlockWords`)
    if (blockWords === null) blockWords = []

    let word = String(result.get("输入内容")).trim()
    if (word === "") {
        sleepToast(`🚫 添加屏蔽\n${wordsType[method]}\n\n⚠️ 输入内容不能为空`)
    } else if (blockWords.includes(word)) {
        sleepToast(`🚫 添加屏蔽\n${wordsType[method]}\n\n✅ 【${word}】已经加入屏蔽列表了`)
    } else {
        blockWords.push(word)
        putInCache(`${method}BlockWords`, blockWords)
        sleepToast(`🚫 添加屏蔽\n${wordsType[method]}\n\n✅ 已将【${word}】加入屏蔽列表中`)
    }
}

function blockWordDelete() {
    let method = getFromCache("wordsType")
    let blockWords = getFromCache(`${method}BlockWords`)
    if (blockWords === null) blockWords = []

    let word = String(result.get("输入内容")).trim()
    if (word === "") {
        sleepToast(`⭕️ 删除屏蔽\n${wordsType[method]}\n\n⚠️ 输入内容不能为空`)
    } else if (!blockWords.includes(word)) {
        sleepToast(`⭕️ 删除屏蔽\n${wordsType[method]}\n\n⚠️ 【${word}】不在屏蔽列表\n请检查是否有错别字或标点符号是否一致`)
    } else {
        blockWords = blockWords.filter(item => item !== word)
        putInCache(`${method}BlockWords`, blockWords)
        sleepToast(`⭕️ 删除屏蔽\n${wordsType[method]}\n\n✅ 已删除屏蔽词【${word}】`)
    }
}

function blockAuthorAdd() {
    let method = getFromCache("wordsType")
    let blockAuthors = getFromCacheMap(`blockAuthorMap`)

    let word = String(result.get("输入内容")).trim()
    if (word === "") {
        sleepToast(`🚫 添加屏蔽\n${wordsType[method]}\n\n⚠️ 输入内容不能为空\n⚠️ 输入【用户ID】可屏蔽该作者`)
    } else if (blockAuthors.has(word)) {
        let text = `${blockAuthors.get(word)} ${word}`
        sleepToast(`🚫 添加屏蔽\n${wordsType[method]}\n\n✅ 【${text}】已经加入屏蔽列表了`)
    }
    // 输入纯数字，添加对应ID的作者
    else if (!isNaN(word)) {
        let user = getAjaxJson(urlUserDetailed(word)).body
        blockAuthors.set(user.userId, user.name)
        let text = `@${user.name} ${user.userId}`
        sleepToast(`🚫 添加屏蔽\n${wordsType[method]}\n\n✅ 已将【${text}】加入屏蔽列表中`)
    }
    else if (word) {
        sleepToast(`🚫 添加屏蔽\n${wordsType[method]}\n\n⚠️ 输入【用户ID】可屏蔽该作者`)
    }
    putInCacheMap(`blockAuthorMap`, blockAuthors)
}

function blockAuthorDelete() {
    let method = getFromCache("wordsType")
    let blockAuthors = getFromCacheMap(`blockAuthorMap`)

    let word = String(result.get("输入内容")).trim()
    if (word === "") {
        sleepToast(`⭕️ 删除屏蔽\n${wordsType[method]}\n\n⚠️ 输入内容不能为空\n⚠️ 输入【用户ID】可屏蔽该作者`)
    }
    // 输入纯数字，删除对应ID的作者
    else if (!isNaN(word) && blockAuthors.has(word)) {
        let text = `@${blockAuthors.get(word)} ${word}`
        blockAuthors.delete(word)
        sleepToast(`⭕️ 删除屏蔽\n${wordsType[method]}\n\n✅ 已删除【${text}】`)
    }
    //作者名称
    else if (Array.from(blockAuthors.values()).includes(word)) {
        let index = Array.from(blockAuthors.values()).indexOf(word)
        let key = Array.from(blockAuthors.keys())[index]
        let text = `@${blockAuthors.get(key)} ${key}`
        blockAuthors.delete(key)
        sleepToast(`⭕️ 删除屏蔽\n${wordsType[method]}\n\n✅ 已删除【${text}】`)
    }
    else if (word) {
        sleepToast(`⭕️ 删除屏蔽\n${wordsType[method]}\n\n⚠️ 输入【用户ID】可屏蔽该作者`)
    }
    putInCacheMap(`blockAuthorMap`, blockAuthors)
}

function blockAddFactory() {
    if (getFromCache("wordsType") === "authors") return blockAuthorAdd()
    else return blockWordAdd()
}

function blockDeleteFactory() {
    if (getFromCache("wordsType") === "authors") return blockAuthorDelete()
    else return blockWordDelete()
}


function likeTagsShow() {
    let likeTags = getFromCache(`likeTags`)
    if (likeTags === null) likeTags = []
    sleepToast(`👀 查看标签\n📌 喜欢标签\n\n${likeTags.join("、")}`, 5)
}

function likeTagsAdd() {
    let likeTags = getFromCache(`likeTags`)
    if (likeTags === null) likeTags = []

    let word = String(result.get("输入内容")).trim()
    if (word === "") {
        sleepToast(`📌 添加标签\n📌 喜欢标签\n\n⚠️ 输入内容不能为空\n请直接输入标签内容`)
    } else if (word.startsWith("@") || word.startsWith("＠")) {
        sleepToast(`📌 添加标签\n📌 喜欢标签\n\n⚠️ 仅支持添加【标签】\n不支持添加 @作者名称`)
    } else if (word.startsWith("#") || word.startsWith("＃")) {
        sleepToast(`📌 添加标签\n📌 喜欢标签\n\n⚠️ 仅支持添加【标签】\n不支持添加 #标签名称`)
    } else if (likeTags.includes(word)) {
        sleepToast(`📌 添加标签\n📌 喜欢标签\n\n✅ 【${word}】已经加入喜欢标签了\n请于发现页刷新后查看`)
    } else {
        likeTags.push(word)
        putInCache(`likeTags`, likeTags)
        sleepToast(`📌 添加标签\n📌 喜欢标签\n\n✅ 已将【${word}】加入喜欢标签了\n请于发现页刷新后查看`)
    }
}

function likeTagsDelete() {
    let likeTags = getFromCache(`likeTags`)
    if (likeTags === null) likeTags = []

    let word = String(result.get("输入内容")).trim()
    if (word === "") {
        sleepToast(`🗑 删除标签\n\n⚠️ 输入内容不能为空`)
    } else if (!likeTags.includes(word)) {
        sleepToast(`🗑 删除标签\n\n⚠️ 【${word}】不在喜欢标签\n请检查是否有错别字`)
    } else {
        likeTags = likeTags.filter(item => item !== word)
        putInCache(`likeTags`, likeTags)
        sleepToast(`🗑 删除标签\n\n✅ 已删除该标签【${word}】`)
    }
}


function likeAuthorsShow() {
    let text = printAuthorMap(getFromCacheMap(`likeAuthors`))
    sleepToast(`👀 查看收藏\n❤️ 他人收藏\n\n${text.trim()}`, 2)
}

function likeAuthorsAdd() {
    let likeAuthors = getFromCacheMap(`likeAuthors`)
    let word = String(result.get("输入内容")).trim()
    if (word.startsWith("@") || word.startsWith("＠")) {
        return sleepToast(`❤️ 添加收藏\n❤️ 他人收藏\n\n⚠️ 仅支持通过【作者ID】关注\n不支持添加 @作者名称`)
    } else if (word.startsWith("#") || word.startsWith("＃")) {
        return sleepToast(`❤️ 添加收藏\n❤️ 他人收藏\n\n⚠️ 仅支持通过【作者ID】关注\n不支持添加 #标签名称`)
    } else if (likeAuthors.has(word)) {
        let text = `${likeAuthors.get(word)} ${word}`
        sleepToast(`❤️ 添加收藏\n❤️ 他人收藏\n\n✅ 【${text}】已经加入收藏列表了，请于发现页刷新后查看`)
    }

    // 无输入内容，添加当前小说的作者
    if (word === "") {
        let novel = getNovel()
        likeAuthors.set(String(novel.userId), novel.userName)
        let text = `@${novel.userName} ${novel.userId}`
        sleepToast(`❤️ 添加收藏\n❤️ 他人收藏\n\n✅ 已将【${text}】加入收藏列表了，请于发现页刷新后查看\n\n⚠️ 输入【用户ID】可关注其他用户的收藏\n默认关注当前作者(用户)`)
    }
    // 输入纯数字，添加对应ID的作者
    else if (!isNaN(word)) {
        let user = getAjaxJson(urlUserDetailed(word)).body
        likeAuthors.set(user.userId, user.name)
        let text = `@${user.name} ${user.userId}`
        sleepToast(`❤️ 添加收藏\n❤️ 他人收藏\n\n✅ 已将【${text}】加入收藏列表了，请于发现页刷新后查看`)
    }

    else if (word) {
        sleepToast(`❤️ 添加收藏\n❤️ 他人收藏\n\n⚠️ 输入【用户ID】可关注其他用户的收藏`)
    }
    putInCacheMap(`likeAuthors`, likeAuthors)
}

function likeAuthorsDelete() {
    let likeAuthors = getFromCacheMap(`likeAuthors`)
    let word = String(result.get("输入内容")).trim()
    if (word.startsWith("@") || word.startsWith("＠")) {
        return sleepToast(`🖤 取消收藏\n❤️ 他人收藏\n\n⚠️ 仅支持通过【作者ID/作者名称】取关\n不支持输入 @作者名称`)
    } else if (word.startsWith("#") || word.startsWith("＃")) {
        return sleepToast(`🖤 取消收藏\n❤️ 他人收藏\n\n⚠️ 仅支持通过【作者ID/作者名称】取关\n不支持输入 #标签名称`)
    }

    if (word === "") {
        let novel = getNovel()
        likeAuthors.delete(novel.userId)
        let text = `@${novel.userName} ${novel.userId}`
        sleepToast(`🖤 取消收藏\n❤️ 他人收藏\n\n✅ 已取关【${text}】\n\n输入【用户ID】可取关其他用户\n默认取关当前作者(用户)`)

    // 输入纯数字，删除对应ID的作者
    } else if (!isNaN(word) && likeAuthors.has(word)) {
        let text = `@${likeAuthors.get(word)} ${word}`
        likeAuthors.delete(word)
        sleepToast(`🖤 取消收藏\n❤️ 他人收藏\n\n✅ 已取关【${text}】`)

    //作者名称
    } else if (Array.from(likeAuthors.values()).includes(word)) {
        let index = Array.from(likeAuthors.values()).indexOf(word)
        let key = Array.from(likeAuthors.keys())[index]
        let text = `@${likeAuthors.get(key)} ${key}`
        likeAuthors.delete(key)
        sleepToast(`🖤 取消收藏\n❤️ 他人收藏\n\n✅ 已取关【${text}】`)
    }
    else if (word) {
        sleepToast(`🖤 取消收藏\n❤️ 他人收藏\n\n⚠️ 输入【用户ID】可取关其他用户的收藏`)
    }
    putInCacheMap(`likeAuthors`, likeAuthors)
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
    startBrowser("https://github.com/DowneyRem/PixivSource/issues", "反馈问题")
}
function startGithubReadme() {
    startBrowser("https://downeyrem.github.io/PixivSource/Pixiv", "使用指南")
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
    "SHOW_ORIGINAL_LINK": "🔗 原始链接",
    "CONVERT_CHINESE": "🀄️ 繁简通搜",
    "SHOW_UPDATE_TIME": "📅 更新时间",
    "SHOW_COMMENTS": "💬 显示评论",
    "MORE_INFORMATION": "📖 更多简介",
    "REPLACE_TITLE_MARKS": "📚 恢复《》",
    "SHOW_CAPTIONS": "🖼️ 显示描述",
    "SHOW_LIKE_NOVELS" :"❤️ 显示收藏",
    "SHOW_WATCHED_SERIES" :"📃 显示追更",
    "IPDirect": "✈️ 直连模式",
    "FAST": "⏩ 快速模式",
    "DEBUG": "🐞 调试模式",
    // "":"Pixiv 设置",
    // "HIDE_AI_WORKS":"隐藏AI作品",
    // "SENSITIVE_VIEW":"敏感作品",
    // "USER_X_RESTRICT":"成人设置",
    // "READING_STATUS":"阅读进度",
}

// function getPixivSettings() {
//     let settings = getFromCache("pixivSettings")
//     let resp = getAjaxJson("https://www.pixiv.net/ajax/settings/self")
//     if (resp.error !== true) {
//         let siteSettings = resp.body.user_status
//         settings.HIDE_AI_WORKS = siteSettings.hide_ai_works
//         settings.SENSITIVE_VIEW = siteSettings.sensitive_view_setting
//         settings.USER_X_RESTRICT = siteSettings.user_x_restrict
//         settings.READING_STATUS = siteSettings.reading_status_enabled
//     } else {
//         settings.HIDE_AI_WORKS = false
//         settings.SENSITIVE_VIEW = 0
//         settings.USER_X_RESTRICT = 0
//         settings.READING_STATUS = false
//     }
//     putInCache("pixivSettings", settings)
//     return settings
// }
//
// function editPixivSettingsHideAI() {
//     let settings = getPixivSettings()
//     // let settings = getFromCache("pixivSettings")
//     let hideAiWorks = Number(!settings.HIDE_AI_WORKS)
//     let resp = getPostBody(
//         "https://www.pixiv.net/ajax/settings/self?lang=zh",
//         {"hideAiWorks": hideAiWorks}
//     )
//
//     if (resp.error === true) sleepToast(`⚠️ 隐藏AI作品 失败`, 1)
//     else if (hideAiWorks === 1) sleepToast(`⚠️ 隐藏AI作品\n\n✅ 已 隐藏AI作品`)
//     else sleepToast(`⚠️ 隐藏AI作品\n\n✅ 已取消 隐藏AI作品`)
//     settings.HIDE_AI_WORKS = Boolean(hideAiWorks)
//     putInCache("pixivSettings", settings)
// }
//
// function editPixivSettingsXRestrict() {
//     let settings = getPixivSettings()
//     // let settings = getFromCache("pixivSettings")
//     let userXRestrict = settings.USER_X_RESTRICT + 1
//     if (userXRestrict === 3) userXRestrict = 0
//     let resp = getPostBody(
//         "https://www.pixiv.net/ajax/settings/user_x_restrict",
//         {"userXRestrict": userXRestrict}
//     )
//
//     if (resp.error === true) sleepToast(`⚠️ 成人作品 失败`, 1)
//     else if (hideAiWorks === 0) sleepToast(`⚠️ 成人作品\n\n✅ 已关闭 成人作品`)
//     else if (hideAiWorks === 1) sleepToast(`⚠️ 成人作品\n\n✅ 已开启 R-18作品`)
//     else sleepToast(`⚠️ 成人作品\n\n✅ 已开启 R-18G作品`)
//     settings.HIDE_AI_WORKS = userXRestrict
//     putInCache("pixivSettings", settings)
// }
//
// function editPixivSettingsSensitiveView() {
//     let settings = getPixivSettings()
//     // let settings = getFromCache("pixivSettings")
//     let sensitiveView = Number(!settings.SENSITIVE_VIEW)
//     let resp = getPostBody(
//         "https://www.pixiv.net/ajax/settings/sensitive_view_setting",
//         {"sensitiveViewSetting": sensitiveView}
//     )
//
//     if (resp.error === true) sleepToast(`⚠️ 敏感作品 失败`, 1)
//     else if (sensitiveView === 0) {sleepToast(`⚠️ 敏感作品\n\n✅ 已隐藏 敏感作品`)}
//     else sleepToast(`⚠️ 敏感作品\n\n✅ 已显示 敏感作品`)
//     settings.SENSITIVE_VIEW = sensitiveView
//     putInCache("pixivSettings", settings)
// }

function statusMsg(status) {
    if (status === true) return "✅ 已开启"
    else if (status === false) return "🚫 已关闭"
    else return "🈚️ 未设置"
}

// 检测快速模式修改的4个设置
function getSettingStatus(mode) {
    if (mode === undefined) mode = ""
    let keys = [], msgList = []
    let settings = getFromCache("pixivSettings")
    if (mode === "FAST") {
        keys = Object.keys(settingsName).slice(0, 5)
    } else if (mode === "IPDirect") {
        keys = Object.keys(settingsName).slice(0, 2)
    } else {
        keys = Object.keys(settingsName)
    }
    for (let i in keys) {
        msgList.push(`${statusMsg(settings[keys[i]])}　${settingsName[keys[i]]}`)
    }
    return msgList.join("\n").trim()
}

function showSettings() {
    sleepToast(`⚙️ 当前设置\n\n${getSettingStatus()}`)
}

function setDefaultSettingsLoginUrl() {
    setDefaultSettings()
    sleepToast(`\n✅ 已恢复　🔧 默认设置\n\n${getSettingStatus()}`)
}

function editSettings(settingName) {
    let msg, status
    let settings = getFromCache("pixivSettings")
    if (!settings) settings = setDefaultSettings()
    if (!!settings[settingName]) {
        status = settings[settingName] = !settings[settingName]
    } else {
        status = settings[settingName] = true
    }
    putInCache("pixivSettings", settings)

    if (settingName === "FAST" || (settingName === "IPDirect")) {
        if (settings.IPDirect && !isLogin()) {
            msg = "✈️ 直连模式\n\n✈️ 直连模式 需登录账号\n当前未登录账号，现已关闭直连模式"
            settings.IPDirect = false
            checkSettings()
            putInCache("pixivSettings", settings)
        } else {
            checkSettings()
            msg = `\n${statusMsg(status)}　${settingsName[settingName]}\n\n${getSettingStatus(settingName)}`
        }
    } else {
        msg = `\n${statusMsg(status)}　${settingsName[settingName]}`
    }
    sleepToast(msg)
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

    // 切换列表
    let index = keys.indexOf(key) + 1
    if (index === keys.length) index = 0
    key = keys[index]
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
