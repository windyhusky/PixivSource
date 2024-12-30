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

function oneShotHandler(res) {
    res.textCount =　res.detail.content.length
    res.updateDate = util.timeTextFormat(res.createDate)
    return [{
        title: res.title,
        chapterUrl: util.urlNovel(res.id),
        updateDate:`${res.updateDate}　　${res.textCount}字`
    }]
}

function seriesHandler(res) {
    res.novels.forEach(v => {
        v.title = v.title.replace(RegExp(/（|）|-/g), "")
        v.chapterUrl = util.urlNovel(v.id)
        // v.updateDate = String(v.coverUrl.match(RegExp("\\d{4}/\\d{2}/\\d{2}")))  //fake
        v.detail = util.getAjaxJson(util.urlNovelDetailed(v.id))
        v.textCount = v.detail.content.length
        v.updateDate = util.timeTextFormat(v.detail.createDate)
        v.updateDate = `${v.updateDate}　　${v.textCount}字`
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
