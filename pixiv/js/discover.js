@js:

// 存储seriesID 有BUG无法处理翻页
var seriesSet = new Set();

function urlCoverUrl(url) {
    return `${url},{"headers": {"Referer":"https://www.pixiv.net/"}}`
}

// 将多个长篇小说解析为一本书
function combineNovels(novels) {
    return novels.filter(novel => {
        //单本直接解析为一本书
        if (novel.seriesId === undefined || novel.seriesId === null) {
            return true
        }

        //集合中没有该系列解析为一本书
        if (!seriesSet.has(novel.seriesId)) {
            seriesSet.add(novel.seriesId)
            return true
        }

        return false
    })
}

function urlNovelDetailed(nid) {
    return `https://www.pixiv.net/ajax/novel/${nid}`
}

function handNovels(novels) {
    novels.forEach(novel => {
        if (novel.tags === undefined || novel.tags === null) {
            novel.tags = []
        }

        if (novel.seriesId === undefined || novel.seriesId === null) {
            novel.tags.unshift("单本")
        } else {
            novel.tags.unshift("长篇")
            // todo 暂时不做字数统计
            novel.textCount = null
        }
    })
    return novels
}

function formatNovels(novels) {
    novels.forEach(novel => {
        novel.detailedUrl = urlNovelDetailed(novel.id)
        novel.tags = novel.tags.join(",")
        novel.coverUrl = urlCoverUrl(novel.url)
    })
    return novels
}


(() => {
    // java.log(result)
    let res = JSON.parse(result)
    // return b.score - a.score
    const recommend = res.body.page.recommend
    const novels = res.body.thumbnails.novel
    let nidSet = new Set(recommend.ids)
    // java.log(nidSet.size)

    let list = novels.filter(novel => {
        return nidSet.has(String(novel.id))
    })
    // java.log(`过滤结果:${JSON.stringify(list)}`)

    let r = formatNovels(handNovels(combineNovels(list)))
    // java.log(`返回结果:${JSON.stringify(r)}`)
    return r
})()