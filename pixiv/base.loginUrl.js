
function getPostReusult(url, body, headers) {
    return JSON.parse(java.post(url, body, headers).body())
}

function novelBookmarkAdd(novelId, restrict=0) {
    let url  = "https://www.pixiv.net/ajax/novels/bookmarks/add"
    let body = {"novel_id": novelId, "restrict": restrict, "comment":"", "tags":[]}
    let headers = JSON.parse(cache.get("headers"))

    let resp = JSON.parse(java.post(url, JSON.stringify(body), headers).body())
    if (resp.error === true) sleepToast("收藏失败")
    else if (resp.body === null) sleepToast("已经收藏")
    else cache.put(`collect${novelId}`, resp.body); sleepToast("收藏成功")
}


novelBookmarkAdd(23314322, 0)