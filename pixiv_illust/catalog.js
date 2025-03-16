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
    let limit = 12, total = 0, illusts = []
    let seriesId = res.seriesNavData.seriesId
    if (res.seriesId === undefined) {
        total = getAjaxJson(urlSeriesDetailed(res.seriesNavData.seriesId)).body.page.total
    } else {
        total = res.total
    }
    util.debugFunc(() => {
        java.log(`本系列 ${seriesId} 一共有${total}章`);
    })

    //要爬取的总次数
    let max = (total / limit) + 1
    for (let page = 1; page < max; page++) {
        // java.log(urlSeriesDetailed(seriesId, page))
        res = getAjaxJson(urlSeriesDetailed(seriesId, page)).body
        let illusts_id = res.page.series.map(item => item.workId)
        illusts = illusts.concat(res.thumbnails.illust.filter(illust => illusts_id.includes(illust.id)))
    }
    illusts.reverse().forEach(illust => {
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