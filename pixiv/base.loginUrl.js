function getPostResultBody(url, body, headers) {
    headers = JSON.parse(cache.get("headers"))
    return JSON.parse(java.post(url, body, headers).body())
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


novelBookmarkAdd(23314322, 0)