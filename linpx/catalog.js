@js:
var util = objParse(String(java.get("util")))

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (typeof v == "string" && v.match("()")) {
            return eval(`(${v})`)
        }
        return v;
    })
}

function urlNovel(novelId){
    if (util.SHOW_ORIGINAL_NOVEL_LINK) {
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

(function (res) {
    res = util.getNovelResSeries(result)
    if (res.novels !== undefined) {
        return seriesHandler(res)
    } else {
        return oneShotHandler(res)
    }
})(result)