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
    let id = baseUrl.match(new RegExp("\\d+"))[0]
    java.log(`当前小说ID：${id}`)
    // 处理详情页链接
    if (isHtml) {
        let matchResult = baseUrl.match(new RegExp("pn|pixiv/novel|pixiv.net/novel"))
        if (matchResult == null) {
            return []
        }
        res = util.getAjaxJson(util.urlNovelUrl(id))
    } else {
        // 处理 json ，自搜索或 api 链接
        res = JSON.parse(res)
        if (res.error === true || res.total === 0) {
            java.log(`Linpx 上暂无该小说(${id})，无法获取相关内容`)
            return []
        }
    }


    //为了兼顾导入书架直接走详情页逻辑
    //这里不能直接用book.xxx 来复用搜索页处理结果
    // java.log(JSON.stringify(res))
    let info = {}
    info.author = res.userName
    info.tags = res.tags
    info.count = res.length
    info.desc = res.desc
    info.cover_url = util.urlCoverUrl(res.coverUrl)

    if (res.series === undefined || res.series === null) {
        info.name = info.latest_chapter = res.title
        info.tags.unshift('单本')
        // info.catalog = `https://api.furrynovel.ink/pixiv/novel/${res.id}/cache`
        info.catalog = util.urlNovelUrl(res.id)

    } else {
        info.name = res.series.title
        info.tags.unshift('长篇')
        // info.catalog = `https://api.furrynovel.ink/pixiv/series/${res.series.id}/cache`
        info.catalog = util.urlSeriesUrl(res.series.id)
    }
    info.tags = info.tags.join(",")
    return info

})(result)
