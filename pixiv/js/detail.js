@js:

function urlNovelDetailed(nid) {
    return `https://www.pixiv.net/ajax/novel/${nid}`
}

(() => {
    let res = JSON.parse(result).body
    java.put("novel",res)

    info = {}
    info.author = book.author
    info.name = book.name
    info.tags = book.kind
    info.wordCount = book.wordCount
    info.latestChapter = null
    info.desc = book.intro
    info.coverUrl = book.coverUrl
    info.catalogUrl = (() => {
        const hasChapters = res.seriesNavData !== null && res.seriesNavData !== undefined;
        //判断有无系列章节
        //没有系列章节的就直接返回源地址
        if (hasChapters) {
            return "https://www.pixiv.net/ajax/novel/series_content/" + res.seriesNavData.seriesId + "?limit=10&last_order=0&order_by=asc&lang=zh"
        } else {
            return urlNovelDetailed(res.id)
        }
    })();

    return info
})();