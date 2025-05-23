function getPostBody(url, body, headers) {
    if (headers === undefined) headers = JSON.parse(cache.get("headers"))
    if (isJsonString(body)) {
        headers["content-type"]="application/json; charset=utf-8"
    } else if (typeof(body) == "string") {
        headers["content-type"]="application/x-www-form-urlencoded; charset=utf-8"
    }
    return JSON.parse(java.post(url, body, headers).body())
}

function getNovelBookmarkId(novelId) {
    let bookmarkId = cache.get(`collect${novelId}`)
    if (bookmarkId === null) {
        bookmarkId = getAjaxJson(urlNovelBookmarkData(novelId)).body.bookmarkData.id
    }
    return bookmarkId
}

function novelBookmarkAdd(novelId, restrict=0) {
    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/add",
        JSON.stringify({"novel_id": novelId, "restrict": restrict, "comment":"", "tags":[]})
    )
    if (resp.error === true) sleepToast("收藏失败")
    else if (resp.body === null) sleepToast("已经收藏")
    else cache.put(`collect${novelId}`, resp.body); sleepToast("收藏成功")
}
function novelBookmarkDelete(novelId) {
    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/delete",
        `del=1&book_id=${getNovelBookmarkId(novelId)}`
    )
    if (resp.error === true) sleepToast("取消收藏失败")
    else sleepToast("已取消收藏")
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

function seriesWatch(seriesID) {
    let resp = getPostBody(
        `https://www.pixiv.net/ajax/novel/series/${seriesID}/watch`,
        JSON.stringify({})
    )
    if (resp.error === true) sleepToast("追更失败")
    else sleepToast("已成功追更")
}
function seriesUnWatch(seriesID) {
    let resp = getPostBody(
        `https://www.pixiv.net/ajax/novel/series/${seriesID}/unwatch`,
        JSON.stringify({})
    )
    if (resp.error === true) sleepToast("取消追更失败")
    else sleepToast("已取消追更")
}

function userFollow(userId, restrict=0) {
    let resp = getPostBody(
        "https://www.pixiv.net/bookmark_add.php",
        `mode=add&type=user&user_id=${userId}&tag=""&restrict=${restrict}&format=json`
    )
    if (resp.error === true) sleepToast("关注失败")
    else sleepToast("已成功关注")
}
function userUnFollow(userId) {
    let resp = getPostBody(
        "https://www.pixiv.net/rpc_group_setting.php",
        `mode=del&type=bookuser&id=${userId}`
    )
    if (resp.error === true) sleepToast("取消关注失败")
    else sleepToast("已取消关注")
}

(() => {
    // novelBookmarkAdd(123, 0)
    // sleep(3)
    // novelBookmarkDelete(123)
    // novelsBookmarkDelete([123])
    // seriesWatch(123)
    // sleep(3)
    // seriesUnWatch(123)
    // userFollow(123)
    // sleep(3)
    // userUnFollow(123)
    // return novelHandler(util.getNovelRes(result))
})()