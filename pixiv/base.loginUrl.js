function getPostResultBody(url, body, headers) {
    headers = JSON.parse(cache.get("headers"))
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
    let resp = getPostResultBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/add",
        JSON.stringify({"novel_id": novelId, "restrict": restrict, "comment":"", "tags":[]})
    )
    if (resp.error === true) sleepToast("收藏失败")
    else if (resp.body === null) sleepToast("已经收藏")
    else cache.put(`collect${novelId}`, resp.body); sleepToast("收藏成功")
}

// todo
function novelBookmarkDelete(novelId) {
    let bookmarkId = getNovelBookmarkId(novelId)
    java.log(bookmarkId)
    // let resp = getPostResultBody(
    //     "https://www.pixiv.net/ajax/novels/bookmarks/delete",
    //     `del=1&book_id=${bookmarkId}`
    // )

    let url  = "https://www.pixiv.net/ajax/novels/bookmarks/delete"
    let body = `del=1&book_id=${bookmarkId}`
    let headers = JSON.parse(cache.get("headers"))

    let result = java.post(url, String(body), headers)
    let resp = result.body()
    java.log(result.code())
    java.log(result)
    java.log(JSON.stringify(result))
    java.log(resp)
    java.log(JSON.stringify(resp))
    if (resp.error === true) sleepToast("取消收藏失败")
}

function novelsBookmarkDelete(novelIds) {
    let bookmarkIds = []
    novelIds.forEach(novelId => {bookmarkIds.push(getNovelBookmarkId(novelId))})
    let resp = getPostResultBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/remove",
        JSON.stringify({"bookmarkIds": bookmarkIds})
    )
    if (resp.error === true) sleepToast("取消收藏失败")
    else sleepToast("已取消收藏")
}

function seriesWatch(seriesID) {
    let resp = getPostResultBody(
        `https://www.pixiv.net/ajax/novel/series/${seriesID}/watch`,
        JSON.stringify({})
    )
    if (resp.error === true) sleepToast("追更失败")
    else sleepToast("已成功追更")
}
function seriesUnWatch(seriesID) {
    let resp = getPostResultBody(
        `https://www.pixiv.net/ajax/novel/series/${seriesID}/unwatch`,
        JSON.stringify({})
    )
    if (resp.error === true) sleepToast("取消追更失败")
    else sleepToast("已取消追更")
}

(() => {
    // novelBookmarkAdd(123, 0)
    // sleep(3)
    novelBookmarkDelete(123)
    // novelsBookmarkDelete([123])
    // seriesWatch(123)
    // sleep(3)
    // seriesUnWatch(123)
    // return novelHandler(util.getNovelRes(result))
})()