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

function urlIllust(novelId){
    if (util.SHOW_ORIGINAL_ILLUST_LINK) {
        return urlIllustUrl(novelId)
    } else {
        return urlIllustDetailed(novelId)
    }
}

function oneShotHandler(res) {
    return [{
        title: res.title.replace(RegExp(/^\s+|\s+$/g), ""),
        chapterUrl: urlIllust(res.id),
        chapterInfo: `${timeTextFormat(res.createDate)}`
    }]
}

function seriesHandler(res) {
    // todo：漫画目录翻页
    res = getAjaxJson(urlSeriesDetailed(res.seriesId)).body
    let page = res.page.total
    // let page = res.illustSeries.total
    let illusts_id = res.page.series.map(item => item.workId).reverse()
    let illusts = res.thumbnails.illust.filter(illust => illusts_id.includes(illust.id)).reverse()
    java.log(JSON.stringify(illusts_id))
    illusts.forEach(illust => {
        illust.title = illust.title.replace(RegExp(/^\s+|\s+$/g), "")
        illust.chapterUrl = urlIllust(illust.id)
        illust.chapterInfo = timeTextFormat(illust.createDate)
    })
    // java.log(JSON.stringify(illusts))
    return illusts
}

(() => {
    let res = util.getIllustRes(result)
    if (res.seriesNavData !== null) {
        return seriesHandler(res)
    } else {
        return oneShotHandler(res)
    }
})()