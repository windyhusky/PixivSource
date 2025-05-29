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

function login() {
    resp = java.startBrowserAwait(`https://accounts.pixiv.net/login,{"headers": {"User-Agent": "${cache.get("userAgent")}"}}`, '登录账号', false).body()
    getCsrfToken(); getCookie()
}
function logout() {
    removeCookie()
    java.startBrowser("https://www.pixiv.net/logout.php", "退出账号")
    removeCookie()
    sleepToast(`已退出当前账号\n退出后请点击右上角的✔️退出\n登录请点击“登录账号”进行登录`)
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

function startPixivSettings() {
    java.startBrowser("https://www.pixiv.net/settings/viewing", "账号设置")
}
function startGithub() {
    java.startBrowser("https://github.com/windyhusky/PixivSource", "书源介绍")
}
function startGithubIssue() {
    java.startBrowser("https://github.com/windyhusky/PixivSource/issues", "反馈问题")
}
function startGithubReadme() {
    java.startBrowser("https://github.com/windyhusky/PixivSource/blob/main/doc/Pixiv.md", "使用指南")
}

function getPostBody(url, body, headers) {
    if (headers === undefined) headers = JSON.parse(cache.get("headers"))
    if (isJsonString(body)) {
        headers["content-type"] = "application/json; charset=utf-8"
    } else if (typeof(body) == "string") {
        headers["content-type"] = "application/x-www-form-urlencoded; charset=utf-8"
    }
    headers["user-agent"] = cache.get("userAgent")
    headers["x-csrf-token"] = cache.get("csfrToken")
    headers["Cookie"] = cache.get("pixivCookie")
    return JSON.parse(java.post(url, body, headers).body())
}

function getNovelBookmarkId(novelId) {
    let bookmarkId = cache.get(`collect${novelId}`)
    if (bookmarkId === null) {
        bookmarkId = getAjaxJson(urlNovelBookmarkData(novelId), true).body.bookmarkData.id
    }
    return bookmarkId
}

function novelBookmarkAdd(restrict=0) {
    let novel = source.getLoginInfoMap()
    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/add",
        JSON.stringify({"novel_id": novel.id, "restrict": restrict, "comment":"", "tags":[]})
    )
    if (resp.error === true) sleepToast(`收藏【${novel.title}】失败`)
    else if (resp.body === null) sleepToast(`已经收藏【${novel.title}】了`)
    else {
        cache.put(`collect${novel.id}`, resp.body);
        sleepToast(`已收藏【${novel.title}】`)
    }
}
function novelBookmarkDelete() {
    let novel = source.getLoginInfoMap()
    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/delete",
        `del=1&book_id=${getNovelBookmarkId(novel.id)}`
    )
    if (resp.error === true) sleepToast(`取消收藏【${novel.title}】失败`)
    else sleepToast(`已取消收藏【${novel.title}】`)
}
function novelsBookmarkDelete(novelIds) {
    let bookmarkIds = []
    novelIds.forEach(novelId => {bookmarkIds.push(getNovelBookmarkId(novelId))})
    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/remove",
        JSON.stringify({"bookmarkIds": bookmarkIds})
    )
    if (resp.error === true) sleepToast("取消收藏失败")
    else sleepToast("已取消收藏")
}

function seriesWatch() {
    let novel = source.getLoginInfoMap()
    if (novel.seriesId) {
        let resp = getPostBody(
            `https://www.pixiv.net/ajax/novel/series/${novel.seriesId}/watch`,
            JSON.stringify({})
        )
        if (resp.error === true) sleepToast(`追更【${novel.title}】失败`)
        else sleepToast(`已追更【${novel.title}】`)
    }
}
function seriesUnWatch() {
    let novel = source.getLoginInfoMap()
    if (novel.seriesId) {
        let resp = getPostBody(
            `https://www.pixiv.net/ajax/novel/series/${novel.seriesId}/unwatch`,
            JSON.stringify({})
        )
        if (resp.error === true) sleepToast(`取消追更【${novel.title}】失败`)
        else sleepToast(`已取消追更【${novel.title}】`)
    }
}

function userFollow(restrict=0) {
    let novel = source.getLoginInfoMap()
    let resp = getPostBody(
        "https://www.pixiv.net/bookmark_add.php",
        `mode=add&type=user&user_id=${novel.userId}&tag=""&restrict=${restrict}&format=json`
    )
    if (resp.error === true) sleepToast(`关注【${novel.userName}】失败`)
    else sleepToast(`已关注【${novel.userName}】`)
}
function userUnFollow() {
    let novel = source.getLoginInfoMap()
    let resp = getPostBody(
        "https://www.pixiv.net/rpc_group_setting.php",
        `mode=del&type=bookuser&id=${novel.userId}`
    )
    if (resp.error === true) sleepToast(`取消关注【${novel.userName}】失败`)
    else sleepToast(`已取消关注【${novel.userName}】`)
}

function userBlock() {
    let action = "block"
    let novel = source.getLoginInfoMap()
    let lastBlock = JSON.parse(cache.get(`block${novel.userId}`))
    if (lastBlock === true) action = "unblock"

    let resp = getPostBody(
        `https://www.pixiv.net/ajax/block/save`,
        JSON.stringify({"user_id": novel.userId, "action": action})
    )
    // java.log(JSON.stringify({"user_id": novel.userId, "action": action}))
    if (resp.error === true) sleepToast("操作失败")
    else if (lastBlock === true) {
        cache.put(`block${novel.userId}`, false)
        sleepToast(`已取消拉黑${novel.userName}`)
    } else {
        cache.put(`block${novel.userId}`, true)
        sleepToast(`已拉黑${novel.userName}`)
    }
}

function novelCommentAdd() {
    let userId = cache.get("pixiv:uid")
    let novel = source.getLoginInfoMap()
    let novelId = novel.id
    let comment = String(result.get("发送评论"))
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

    if (resp.error === true) sleepToast("评论失败")
    else sleepToast(`已在【${novel.title}】发布评论：\n${comment}`)
}

function getNovelCommentID(novelId, comment) {
    let resp = getAjaxJson(urlNovelComments(novelId, 0, 50), true)
    let list = resp.body.comments.filter(item =>
        (item.userId === String(cache.get("pixiv:uid")) && item.comment === comment)
    )
    // java.log(JSON.stringify(list))
    // let commentID = list.map(item => item.id)
    // java.log(JSON.stringify(commentIDs))
    return list.map(item => item.id)
}

function novelCommentDelete() {
    let novel = source.getLoginInfoMap()
    let novelId = novel.id
    let comment = String(result.get("发送评论"))
    let commentIDs = getNovelCommentID(novelId, comment)
    // java.log(JSON.stringify(commentIDs))
    commentIDs.forEach(commentID =>{
        let resp = getPostBody(
            "https://www.pixiv.net/novel/rpc_delete_comment.php",
            `i_id=${novelId}&del_id=${commentID}`
        )
        java.log(JSON.stringify(resp))
        if (resp.error === true) sleepToast("评论删除失败")
        else sleepToast(`已在【${novel.title}】删除评论：\n${comment}`)
    })
}

// todo 获取正确的章节 id
// todo 显示系列 章节 作者 名称

function shareFactory(type) {
    let novel = source.getLoginInfoMap()
    let headers = `{"headers": {"User-Agent":"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36 Reader"}}`
    if (type.includes("series") && novel.seriesId) {
        java.startBrowserAwait(`${urlSeriesUrl(novel.seriesId)},${headers}`, novel.title, false).body()
    }
    if (type.includes("novel")) {
        java.startBrowserAwait(`${urlNovelUrl(novel.novelId)},${headers}`, novel.title, false).body()
    }
    if (type.includes("author")) {
        java.startBrowserAwait(`${urlUserUrl(novel.userId)},${headers}`, novel.userName, false).body()
    }
}