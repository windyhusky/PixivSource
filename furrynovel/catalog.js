@js:

function urlNovelUrl(novelId) {
    return `https://furrynovel.com/zh/info/${novelId}`
}
function urlNovelDetail(novelId) {
    return `https://api.furrynovel.com/api/zh/info/${novelId}`
}
function urlNovelChapterInfo(novelId) {
    return `https://api.furrynovel.com/api/zh/novel/${novelId}/chapter`
}
function urlNovelChapterUrl(novelId, chapterId) {
    return `https://furrynovel.com/zh/novel/${novelId}/chapter/${chapterId}`
}
function urlNovelChapterDetail(novelId, chapterId) {
    return `https://api.furrynovel.com/api/zh/novel/${novelId}/chapter/${chapterId}`
}

function novelhandler(novels) {
    novels.forEach(novel => {
        novel.chapterId = novel.id
        novel.novelId = baseUrl.match(RegExp(/\d+/))[0]
        novel.chapterName = novel.title = novel.name
        novel.chapterUrl = urlNovelChapterDetail(novel.novelId, novel.chapterId)
        novel.chapterInfo = `${novel.created_at}　　${novel.text_count}字`
    })
    return novels
}

(function () {
    res = JSON.parse(result).data
    return novelhandler(res)
})()