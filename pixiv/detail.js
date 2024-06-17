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

(function (res) {
    // 获取网址id，请求并解析数据
    let isHtml = result.startsWith("<!DOCTYPE html>")
    if (isHtml) {
        var novelId = 0
        let isSeries = baseUrl.match(new RegExp("pixiv.net/(ajax/|)novel/series"))
        if (isSeries) {
            let seriesId = baseUrl.match(new RegExp("\\d+"))[0]
            java.log(`系列ID：${seriesId}`)
            // 获取系列第一篇小说的 id
            let url = util.urlSeriesNovels(seriesId, 30, 0)
            res = util.cacheGetAndSet(url, () => {
                return JSON.parse(java.ajax(url))
            })
            novelId = res.body.thumbnails.novel[0].id
            java.log(`首篇小说ID：${novelId}`)
            res = util.getAjaxJson(util.urlNovelDetailed(novelId)).body
            // java.log(JSON.stringify(res))
        } else {
            let isNovel = baseUrl.match(new RegExp("pixiv.net/(ajax/|)novel"))
            if (isNovel) {
                novelId = baseUrl.match(new RegExp("\\d+"))[0]
                java.log(`匹配小说ID：${novelId}`)
                res = util.getAjaxJson(util.urlNovelDetailed(novelId)).body
                // java.log(JSON.stringify(res))
            } else {
                return []
            }
        }
    } else {
        // 从搜索直接获取 json
        res = JSON.parse(result).body
        if (res.total === 0) {
            return []
        }
    }
    // java.log(JSON.stringify(res))
    let info = {}
    info.author = res.userName
    info.name = res.title
    info.tags = res.userNovels[`${res.id}`].tags
    info.wordCount = res.wordCount
    info.latestChapter = null
    info.desc = res.description
    info.coverUrl = res.coverUrl

    if (res.seriesNavData === undefined || res.seriesNavData === null) {
        info.name = res.title
        info.catalog = util.urlNovelDetailed(res.id)
        info.tags.unshift('单本')
    } else {
        info.name = res.seriesNavData.title
        info.catalog = util.urlSeries(res.seriesNavData.id)
        info.tags.unshift('长篇')
    }
    info.tags = info.tags.join(",")

    return info
})();