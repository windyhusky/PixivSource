function login() {
    let resp = java.startBrowserAwait(`https://accounts.pixiv.net/login,{"headers": {"User-Agent": "${cache.get("userAgent")}"}}`, '登录账号', false)
    if (resp.code() === 200) {
        getCookie(); getCsrfToken()
    } else {
        java.log(resp.code()); sleepToast("⚠️ 登录失败")
    }
    return resp.body()
}

function logout() {
    removeCookie()
    java.startBrowser("https://www.pixiv.net/logout.php", "退出账号")
    removeCookie()
    sleepToast(`✅已退出当前账号\n\n退出后请点击右上角的 ✔️ 退出\n\n登录请点击【登录账号】进行登录`)
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
    let csfrToken = getWebviewJson("https://www.pixiv.net/", html => {
        return JSON.stringify(html.match(/token\\":\\"([a-z0-9]{32})/)[1])
    })
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
    }
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
        java.log(e)
        if (String(e).includes(400)) sleepToast(`⚠️ 缺少 headers`)
        else if (String(e).includes(403)) sleepToast(`⚠️ 缺少 cookie 或 cookie 过期`)
        else if (String(e).includes(422)) sleepToast(`⚠️ 请求信息有误`)
        return {error: true}
    }
}

function novelBookmarkAdd(restrict=0) {
    let novel = source.getLoginInfoMap()
    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/add",
        JSON.stringify({"novel_id": novel.id, "restrict": restrict, "comment":"", "tags":[]})
    )
    if (resp.error === true) sleepToast(`⚠️ 收藏【${novel.title}】失败`)
    else if (resp.body === null) sleepToast(`✅ 已经收藏【${novel.title}】了`)
    else {
        cache.put(`collect${novel.id}`, resp.body);
        sleepToast(`✅ 已收藏【${novel.title}】`)
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
    let novel = source.getLoginInfoMap()
    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/delete",
        `del=1&book_id=${getNovelBookmarkId(novel.id)}`
    )
    if (resp.error === true) sleepToast(`⚠️ 取消收藏【${novel.title}】失败`)
    else {
        sleepToast(`✅ 已取消收藏【${novel.title}】`)
        cache.delete(`collect${novel.id}`)
    }
}

function novelsBookmarkDelete(novelIds) {
    let bookmarkIds = []
    novelIds.forEach(novelId => {bookmarkIds.push(getNovelBookmarkId(novelId))})
    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/remove",
        JSON.stringify({"bookmarkIds": bookmarkIds})
    )
    if (resp.error === true) sleepToast("⚠️ 取消收藏失败")
    else {
        sleepToast("✅ 已取消收藏")
        novelIds.forEach(novelId => {cache.delete(`collect${novelId}`)})
    }
}

function novelBookmarkFactory(code) {
    let novel = source.getLoginInfoMap()
    let collectId = getFromCache(`collect${novel.id}`)
    if (collectId >= 1) code = 0

    if (code === 0) novelBookmarkDelete()
    else if (code === 1) novelBookmarkAdd(0)
    else if (code === 2) novelBookmarkAdd(1)
}

function novelMarker(page=1) {
    let novel = source.getLoginInfoMap()
    let lastMarker = getFromCache(`marker${novel.id}`)
    if (lastMarker === true) page = 0

    let resp = getPostBody(
        "https://www.pixiv.net/novel/rpc_marker.php",
        `mode=save&i_id=${novel.id}&u_id=${getFromCache("pixiv:uid")}&page=${page}`
    )
    java.log(`mode=save&i_id=${novel.id}&u_id=${getFromCache("pixiv:uid")}&page=${page}`)
    if (resp.error === true) sleepToast("⚠️ 操作失败")
    else if (lastMarker === true) {
        cache.put(`marker${novel.id}`, false)
        sleepToast(`✅ 已删除书签`)
    } else {
        cache.put(`marker${novel.id}`, true)
        sleepToast(`✅ 已加入书签`)
    }
}

function seriesWatch() {
    let novel = source.getLoginInfoMap()
    let resp = getPostBody(
        `https://www.pixiv.net/ajax/novel/series/${novel.seriesId}/watch`,
        "{}"
    )
    if (resp.error === true) sleepToast(`⚠️ 追更【${novel.seriesTitle}】失败`)
    else {
        sleepToast(`✅ 已追更【${novel.seriesTitle}】`)
        cache.put(`watch${novel.seriesId}`, true)
    }
}

function seriesUnWatch() {
    let novel = source.getLoginInfoMap()
    let resp = getPostBody(
        `https://www.pixiv.net/ajax/novel/series/${novel.seriesId}/unwatch`,
        "{}"
    )
    if (resp.error === true) sleepToast(`⚠️ 取消追更【${novel.seriesTitle}】失败`)
    else {
        sleepToast(`✅ 已取消追更【${novel.seriesTitle}】`)
        cache.delete(`watch${novel.seriesId}`)
    }
}

function seriesWatchFactory(code=1) {
    let novel = source.getLoginInfoMap()
    if (!novel.seriesId) {
        return sleepToast(`⚠️ 【${novel.title}】非系列小说，无法加入追更列表`)
    }

    let lastStatus = getFromCache(`watch${novel.seriesId}`)
    if (lastStatus === true) code = 0
    if (code === 0) seriesUnWatch()
    else if (code === 1) seriesWatch()
}

function userFollow(restrict=0) {
    let novel = source.getLoginInfoMap()
    let resp = getPostBody(
        "https://www.pixiv.net/bookmark_add.php",
        `mode=add&type=user&user_id=${novel.userId}&tag=""&restrict=${restrict}&format=json`
    )
    if (resp.error === true) sleepToast(`⚠️ 关注【${novel.userName}】失败`)
    else {
        sleepToast(`✅ 已关注【${novel.userName}】`)
        cache.put(`follow${novel.userId}`, true)
    }
}

function userUnFollow() {
    let novel = source.getLoginInfoMap()
    let resp = getPostBody(
        "https://www.pixiv.net/rpc_group_setting.php",
        `mode=del&type=bookuser&id=${novel.userId}`
    )
    if (resp.error === true) sleepToast(`⚠️ 取消关注【${novel.userName}】失败`)
    else {
        sleepToast(`✅ 已取消关注【${novel.userName}】`)
        cache.delete(`follow${novel.userId}`)
    }
}

function userFollowFactory(code=1) {
    let novel = source.getLoginInfoMap()
    let lastStatus = getFromCache(`follow${novel.userId}`)
    if (lastStatus === true) code = 0

    if (code === 0) userUnFollow()
    else if (code === 1) userFollow()
}

function userBlackList() {
    let action = "block"  // 拉黑作者，非屏蔽作恶者作品
    let novel = source.getLoginInfoMap()
    let lastStatus = getFromCache(`block${novel.userId}`)
    if (lastStatus === true) action = "unblock"

    let resp = getPostBody(
        `https://www.pixiv.net/ajax/block/save`,
        JSON.stringify({"user_id": novel.userId, "action": action})
    )
    // java.log(JSON.stringify({"user_id": novel.userId, "action": action}))
    if (resp.error === true) sleepToast("⚠️ 操作失败")
    else if (lastStatus === true) {
        cache.put(`block${novel.userId}`, false)
        sleepToast(`✅ 已取消拉黑${novel.userName}`)
    } else {
        cache.put(`block${novel.userId}`, true)
        sleepToast(`✅ 已拉黑${novel.userName}`)
    }
}

function userBlock() {
    let authors = getFromCache("blockAuthorList")
    let novel = source.getLoginInfoMap()
    if (authors.includes(Number(novel.userId))) {
        authors = authors.filter(author => author !== Number(novel.userId))
        sleepToast(`✅ 已将【${novel.userName}】移出本地屏蔽名单`)
    } else if (novel.userId !== undefined && novel.userId !== null) {
        authors.push(Number(novel.userId))
        sleepToast(`✅ 已将【${novel.userName}】加入本地屏蔽名单`)
    }
    cache.put("blockAuthorList", JSON.stringify(authors))
    source.setVariable(authors.toString())
    // sleepToast(JSON.stringify(authors))
}

function novelCommentAdd() {
    let userId = getFromCache("pixiv:uid")
    let novel = source.getLoginInfoMap()
    let novelId = novel.id
    let comment = String(result.get("发送评论")).trim()
    if (comment === "") {
        return sleepToast("⚠️ 请输入需要发送的评论")
    }
    let resp = getPostBody(
        "https://www.pixiv.net/novel/rpc/post_comment.php",
        `type=comment&novel_id=${novelId}&author_user_id=${userId}&comment=${encodeURI(comment)}`
    )

    // let body = `type=comment&novel_id=${novelId}&author_user_id=${userId}`
    // if (comment.includes("；")) {
    //     let comment = comment.split("；")
    //     body += `&comment=${encodeURI(comment[0])}&parent_id=${comment[1]}`
    // } else body += `&comment=${encodeURI(comment)}`
    // let resp = getPostBody("https://www.pixiv.net/novel/rpc/post_comment.php", body)

    if (resp.error === true) sleepToast("⚠️ 评论失败")
    else sleepToast(`✅ 已在【${novel.title}】发布评论：\n${comment}`)
}

function getNovelCommentID(novelId, comment) {
    let resp = getAjaxJson(urlNovelComments(novelId, 0, 50), true)
    let list = resp.body.comments.filter(item =>
        (item.userId === String(getFromCache("pixiv:uid")) && item.comment === comment)
    )
    // java.log(JSON.stringify(list))
    // let commentID = list.map(item => item.id)
    // java.log(JSON.stringify(commentIDs))
    return list.map(item => item.id)
}

function novelCommentDelete() {
    let novel = source.getLoginInfoMap()
    let novelId = novel.id
    let comment = String(result.get("发送评论")).trim()
    if (comment === "") {
        return sleepToast("⚠️ 请输入需要删除的评论")
    }

    let commentIDs = getNovelCommentID(novelId, comment)
    java.log(JSON.stringify(commentIDs))
    if (commentIDs.length === 0) {
        return sleepToast(`⚠️ 未能找到这条评论\n请检查是否有错别字或标点符号是否一致`)
    }

    commentIDs.forEach(commentID =>{
        let resp = getPostBody(
            "https://www.pixiv.net/novel/rpc_delete_comment.php",
            `i_id=${novelId}&del_id=${commentID}`
        )
        // java.log(JSON.stringify(resp))
        if (resp.error === true) sleepToast("⚠️ 评论删除失败")
        else sleepToast(`✅ 已在【${novel.title}】删除评论：\n${comment}`)
    })
}

function startBrowser(url, title) {
    // let headers = `{"headers": {"User-Agent":"${java.getWebViewUA()}"}}`
    let headers = `{"headers": {"User-Agent":"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36"}}`
    java.startBrowser(`${url},${headers}`, title)
}

function shareFactory(type) {
    let novel = source.getLoginInfoMap()
    if (novel === undefined) return sleepToast("⚠️ 请在小说阅读页面，使用本功能")
    if (type.includes("author")) {
        startBrowser(urlUserUrl(novel.userId), novel.userName)
    }
    else if (type.includes("novel") || novel.seriesId === undefined) {
        startBrowser(urlNovelUrl(novel.novelId), novel.title)
    }
    else if (type.includes("series") && novel.seriesId) {
        startBrowser(urlSeriesUrl(novel.seriesId), novel.seriesTitle)
    }
}

function startPixivSettings() {
    startBrowser("https://www.pixiv.net/settings/viewing", "账号设置")
}
function startGithub() {
    startBrowser("https://github.com/windyhusky/PixivSource", "书源介绍")
}
function startGithubIssue() {
    startBrowser("https://github.com/windyhusky/PixivSource/issues", "反馈问题")
}
function startGithubReadme() {
    startBrowser("https://github.com/windyhusky/PixivSource/blob/main/doc/Pixiv.md", "使用指南")
}

function charpterRead() {
    let novel = source.getLoginInfoMap()
    sleepToast(`内部章节\n【${novel.title}】\n如非当前章节名称，请刷新正文`)
}

function readMeLogin() {
    let novel = source.getLoginInfoMap()
    sleepToast(`登录界面功能说明
    使用收藏、追更、关注作者、评论等功能时，请先刷新正文，获取当前章节信息
    点击【📌 当前章节】查看书源内部章节信息`, 5)
}

function readMeSearch() {
    let novel = source.getLoginInfoMap()
    sleepToast(`搜索说明
    关键词间需要以空格间隔
    作者专搜：@作者名称
    标签专搜：#标签1 标签2
    字数筛选1：标签1 标签2 字数3k5
    字数筛选2：@作者名称 字数3w5`, 5)
}