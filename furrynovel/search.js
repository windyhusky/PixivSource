@js:
function urlNovelUrl(novelId) {
    return `https://furrynovel.com/zh/novel/${novelId}`
}
function urlNovelDetail(novelId) {
    return `https://api.furrynovel.com/api/zh/novel/${novelId}`
}

function urlPixivNovelUrl(pixivNovelId) {
    return `https://www.pixiv.net/novel/show.php?id=${pixivNovelId}`
}
function urlPixivSeriesUrl(pixivSeriesId) {
    return `https://www.pixiv.net/novel/series/${pixivSeriesId}`
}
function urlBiliNovelUrl(biliNovelId) {
    return `https://www.bilibili.com/read/readlist/rl${biliNovelId}/`
}

function urlSourceUrl(source, oneShot, id) {
    if (source === "bilibili") {
        return urlBiliNovelUrl(id)
    }
    if (source === "pixiv" && oneShot === true) {
        return urlPixivNovelUrl(id)
    }
    if (source === "pixiv" && oneShot === false) {
        return urlPixivSeriesUrl(id)
    }
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


function dateFormat(text) {
    return `${text.slice(0, 10)}`
}
function timeTextFormat(text) {
    return `${text.slice(0, 10)} ${text.slice(11, 19)}`
}


// 小说信息格式化
function formatNovels(novels) {
    novels.forEach(novel => {
        novel.title = novel.title.replace(RegExp(/^\s+|\s+$/g), "")
        novel.tags = novel.tags.join(",")
        novel.createDate = dateFormat(novel.createDate)
        novel.updateDate = dateFormat(novel.updateDate)
        novel.syncDate = dateFormat(novel.syncDate)
        if (MORE_INFO_IN_DESCRIPTION) {
            novel.description = `\n书名：${novel.title}\n作者：${novel.userName}\n标签：${novel.tags}\n上传：${novel.createDate}\n更新：${novel.updateDate}\n同步：${novel.syncDate}\n简介：${novel.description}`
        } else {
            novel.description = `\n${novel.description}\n上传时间：${novel.createDate}\n更新时间：${novel.updateDate}\n
            同步时间：${novel.syncDate}`
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