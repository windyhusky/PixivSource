var util = objParse(String(java.get("util")))

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (typeof v == "string" && v.match("()")) {
            return eval(`(${v})`)
        }
        return v;
    })
}

function urlNovel(novelId) {
    if (util.SHOW_ORIGINAL_LINK) {
        return urlNovelUrl(novelId)
    } else {
        return urlNovelDetailed(novelId)
    }
}

function oneShotHandler(res) {
    res.textCount =　res.content.length
    res.updateDate = timeTextFormat(res.createDate)
    return [{
        title: res.title.replace(RegExp(/^\s+|\s+$/g), ""),
        chapterUrl: urlNovel(res.id),
        chapterInfo:`${res.updateDate}　　${res.textCount}字`
    }]
}

function seriesHandler(res) {
    res.novels.forEach(v => {
        v.title = v.title.replace(RegExp(/^\s+|\s+$/g), "").replace(RegExp(/（|）|-/g), "")
        v.chapterUrl = urlNovel(v.id)
        // v.updateDate = String(v.coverUrl.match(RegExp("\\d{4}/\\d{2}/\\d{2}")))  //fake
        v.detail = getAjaxJson(urlNovelDetailed(v.id))
        try{
            v.textCount = v.detail.content.length
            v.updateDate = timeTextFormat(v.detail.createDate)
            v.chapterInfo = `${v.updateDate}　　${v.textCount}字`
        } catch (e) {}
        util.debugFunc(() => {
            java.log(`${v.title}`)
        })
    })
    return res.novels
}

function seriesHandler(resp) {
    let novels = [], prevNovels = [], nextNovels = []
    while (resp.series.prev !== null && resp.series.prev !== undefined) {
        prevNovels.push(resp.series.prev)
        resp = getAjaxJson(urlNovelDetailed(resp.series.prev.id))
    }
    nextNovels.push({id: resp.id, order: resp.series.order, title: resp.title})
    while (resp.series.next !== null && resp.series.prev !== undefined) {
        nextNovels.push(resp.series.next)
        resp = getAjaxJson(urlNovelDetailed(resp.series.next.id))
    }
    novels = novels.concat(prevNovels.reverse())
    novels = novels.concat(nextNovels)
    novels.forEach(novel => {
        novel.chapterUrl = urlNovel(novel.id)
        novel.detail = getAjaxJson(urlNovelDetailed(novel.id))
        novel.textCount = novel.detail.content.length
        novel.updateDate = timeTextFormat(novel.detail.createDate)
        novel.chapterInfo = `${novel.updateDate}　　${novel.textCount}字`
        delete novel.detail
    })
    // java.log(JSON.stringify(novels))
    return novels
}

(() => {
    if (isJsonString(result)) {
        result = JSON.parse(result)
        if (result.series) {
            return seriesHandler(result)
        } else {
            return oneShotHandler(result)
        }
    }

    // let res = util.getNovelRes(result)
    // java.log(JSON.stringify(res))
    // if (res.novels !== undefined) {
    //     return seriesHandler(res)
    // } else {
    //     return oneShotHandler(res)
    // }
})()