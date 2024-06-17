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
    let isHtml = res.startsWith("<!DOCTYPE html>")
    if (isHtml) {
        let matchResult = baseUrl.match(new RegExp("pn|pixiv/novel|pixiv.net/novel"))
        if (matchResult == null) {
            return []
        }
        let id = baseUrl.match(new RegExp("\\d+"))[0]
        res = util.getAjaxJson(util.urlNovelUrl(id))
    } else {
        res = JSON.parse(res)
        if (res.total === 0) {
            return []
        }
    }

    let prop = {}
    //为了兼顾导入书架直接走详情页逻辑
    //这里不能直接用book.xxx 来复用搜索页处理结果
    prop.author = res.userName
    prop.tags = res.tags
    prop.count = res.length
    prop.desc = res.desc
    prop.cover_url = util.urlCoverUrl(res.coverUrl)

    if (res.series === undefined || res.series === null) {
        prop.name = res.title
        // prop.catalog = `https://api.furrynovel.ink/pixiv/novel/${res.id}/cache`
        prop.catalog = util.urlNovelUrl(res.id)
        res.tags.unshift('单本')
    } else {
        prop.name = res.series.title
        res.tags.unshift('长篇')
        // prop.catalog = `https://api.furrynovel.ink/pixiv/series/${res.series.id}/cache`
        prop.catalog = util.urlSeriesUrl(res.series.id)
    }
    prop.classes = res.tags.join(",")
    return prop
})(result)
