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
    info.noveId = res.id
    info.title = res.title
    info.userName = res.userName
    // info.tags = res.tags 　// complex array 不好取数据
    // info.textCount = res.textCount  // 无数据
    info.tags = res.userNovels[`${info.noveId}`].tags
    // info.textCount = res.userNovels[`${info.noveId}`].textCount
    // info.readingTime = `${res.userNovels[`${info.noveId}`].readingTime / 60} 分钟`
    info.latestChapter = ""
    info.description = res.description
    info.coverUrl = res.coverUrl
    info.catalogUrl = util.urlNovelDetailed(info.noveId)

    if (res.seriesNavData === undefined || res.seriesNavData === null) {
        info.title = info.latestChapter = res.title
        info.userName = res.userName
        // info.tags = res.userNovels[`${info.noveId}`].tags
        info.tags.unshift('单本')
        info.textCount = res.userNovels[`${info.noveId}`].textCount
        info.latestChapter = res.title
        info.description = res.description
        info.coverUrl = res.coverUrl
        info.catalog = util.urlNovelDetailed(info.noveId)
        info.createDate = res.createDate
        info.updateDate = res.uploadDate

    } else {  // 系列小说
        info.seriesId = res.seriesNavData.seriesId
        info.title = res.seriesNavData.title
        java.log(`${info.seriesId}，${info.title}`)
        res2 = JSON.parse(java.ajax(util.urlSeries(res.seriesNavData.seriesId))).body
        // java.log(JSON.stringify(res2))
        // info.title = res2.title
        // info.userName = res2.userName
        info.tags.push.apply(res2.tags)   //合并当前章节 tags
        info.tags.unshift('长篇')
        info.textCount = res2.publishedTotalCharacterCount
        info.readingTime = `${res2.publishedReadingTime / 60} 分钟`
        info.latestChapter = ""
        info.description = `${res2.caption}\n当前章节简介：\n${info.description}`
        // info.coverUrl = res2.firstEpisode.url   // 第一章封面
        info.coverUrl = res2.cover.urls["480mw"] // 240mw, 480mw, 1200x1200, 128x128, original
        info.catalog = util.urlSeries(info.seriesId)
        info.createDate = res2.createDate
        info.updateDate = res2.updateDate
        info.totalChapterNum = res2.displaySeriesContentCount  //章节总数
        // info.language = res2.language
        // info.total = res2.total
        // info.firstNovelId = res2.firstNovelId
        // info.latestNovelId = res2.latestNovelId
    }
    info.tags = info.tags.join(",")
    const time = util.dateFormat(info.updateDate)
    info.description  = `${info.description}\n更新时间:${time}`
    //info.description = `\n书名：${info.title}\n作者：${info.userName}\n标签：${info.tags}\n更新：${time}\n简介：${info.description}`
    return info
})();