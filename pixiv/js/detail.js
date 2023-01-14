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
    info.catalogUrl = urlNovelDetailed(res.id)

    return info
})();