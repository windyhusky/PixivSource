@js:
function urlNovelUrl(novelId) {
    return `https://furrynovel.com/zh/novel/${novelId}`
}
function urlNovelDetail(novelId) {
    return `https://api.furrynovel.com/api/zh/novel/${novelId}`
}

function getNovels(){
    if (JSON.parse(result).code === 200 && JSON.parse(result).count > 0){
        return JSON.parse(result).data
    } else {
        return []
    }
}

function handNovels(novels){
    novels.forEach(novel =>{
        // novel.id = novel.id
        novel.title = novel.name
        // novel.tags = novel.tags
        novel.userName = novel.author.name
        // novel.userId = novel.author.id
        novel.textCount = null
        novel.latestChapter =novel.latest_chapters[0].name
        novel.description = novel.desc
        novel.coverUrl = novel.cover
        novel.detailedUrl = urlNovelDetail(novel.id)

        // novel.source = novel.source
        novel.oneShot = novel.ext_data.oneShot
        novel.sourceId = novel.source_id
        novel.sourceUrl = urlSourceUrl(novel.source, novel.oneShot, novel.sourceId)

        novel.createDate = novel.created_at
        novel.updateDate = novel.updated_at
        novel.syncDate = novel.fetched_at
        // novel.status = novel.status
        if (novel.status !== "publish"){  // suspend
            java.log(urlNovelUrl(novel.id))
            java.log(novel.sourceUrl)
        }
    })
    return novels
}

(() => {
    let novels = []
    novels = novels.concat(getNovels())
    // 返回空列表中止流程
    if (novels.length === 0) {
        return []
    }
    return formatNovels(handNovels(novels))
    // return util.formatNovels(util.handNovels(novels))
})();