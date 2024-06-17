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
    result = {} //兼容搜索 for 循环
    result.novels = []
    // java.log(JSON.stringify(res))
    let isHtml = res.startsWith("<!DOCTYPE html>")
    if (isHtml) {
        let matchResult = baseUrl.match(new RegExp("pn|pixiv/novel|pixiv.net/novel"))
        if (matchResult == null) {
            return []
        }
        let id = baseUrl.match(new RegExp("\\d+"))[0]
        java.log(`匹配小说ID：${id}`)
        // res = util.getAjaxJson(util.urlNovelUrl(id))
        result.novels.push(util.getAjaxJson(util.urlNovelUrl(id)))
    } else {
        // 兼容 api 链接
        let isApiJson = baseUrl.match(new RegExp("pn|pixiv/novel|pixiv.net/novel"))
        if (isApiJson && typeof(JSON.parse(res)) === "object") {
            result.novels.push(JSON.parse(res))
        } else {
            result = JSON.parse(res)
            if (result.total === 0) {
                return []
            }
        }
    }


    // api更新后，需要使用 for 循环
    for (let i in result.novels) {
        res = result.novels[i]
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
            prop.tags.unshift('单本')
            // prop.catalog = `https://api.furrynovel.ink/pixiv/novel/${res.id}/cache`
            prop.catalog = util.urlNovelUrl(res.id)

        } else {
            prop.name = res.series.title
            prop.tags.unshift('长篇')
            // prop.catalog = `https://api.furrynovel.ink/pixiv/series/${res.series.id}/cache`
            prop.catalog = util.urlSeriesUrl(res.series.id)
        }
        prop.tags = prop.tags.join(",")
        return prop
    }
})(result)
