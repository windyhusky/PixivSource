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

function novelCommentAdd(novelId, comment) {
    let userId = cache.get("pixiv:uid")
    let resp = getPostBody(
        "https://www.pixiv.net/novel/rpc/post_comment.php",
        `type=comment&novel_id=${novelId}&author_user_id=${userId}&comment=${encodeURI(comment)}`
    )
    if (resp.error === true) sleepToast("评论失败")
    else sleepToast(`已发布评论：\n${comment}`)
}

function getNovelCommentID(novelId, comment) {
    let resp = getAjaxJson(urlNovelComments(novelId, 0, 50))
    let list = resp.body.comments.filter(item =>
        (item.userId === String(cache.get("pixiv:uid")) && item.comment === comment)
    )
    // java.log(JSON.stringify(list))
    // let commentID = list.map(item => item.id)
    // java.log(JSON.stringify(commentIDs))
    return list.map(item => item.id)
}

function novelCommentDelete(novelId, comment) {
    let commentIDs = getNovelCommentID(novelId, comment)
    // java.log(JSON.stringify(commentIDs))
    commentIDs.forEach(commentID =>{
        let resp = getPostBody(
            "https://www.pixiv.net/novel/rpc_delete_comment.php",
            `i_id=${novelId}&del_id=${commentID}`
        )
        java.log(JSON.stringify(resp))
        if (resp.error === true) sleepToast("评论删除失败")
        else sleepToast(`已删除评论：\n${comment}`)
    })
}

(() => {
    // novelBookmarkAdd(123, 0)
    // novelBookmarkDelete(123)
    // novelsBookmarkDelete([123])
    // seriesWatch(123)
    // seriesUnWatch(123)
    // userFollow(123)
    // userUnFollow(123)
    // novelCommentAdd(123, "写得太好了，非常喜欢")
    // novelCommentAdd(123, "写得太好了，非常喜欢2333")
    // novelCommentDelete(123, "写得太好了，非常喜欢")
    // novelCommentDelete(123, "写得太好了，非常喜欢2333")
    // return novelHandler(util.getNovelRes(result))
})()