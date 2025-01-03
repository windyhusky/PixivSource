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
    let info = {}
    info.noveId = res.id
    info.title = info.latestChapter = res.title
    info.userName = res.userName
    // info.tags = res.tags 　// complex array 不好取数据
    info.tags = res.userNovels[`${info.noveId}`].tags
    info.tags.unshift('单本')
    // info.textCount = res.textCount  // 无数据
    info.textCount = res.userNovels[`${info.noveId}`].textCount
    info.description = res.description
    info.coverUrl = util.urlCoverUrl(res.coverUrl)
    info.catalogUrl = util.urlNovelDetailed(info.noveId)
    info.createDate = util.dateFormat(res.createDate)
    info.updateDate = util.dateFormat(res.uploadDate)

    info.readingTime = `${res.userNovels[`${info.noveId}`].readingTime / 60} 分钟`
    return info
}

function seriesHandler(res) {
    let info = {}
    info.novelId = res.firstNovelId
    info.seriesId = res.id
    info.title = res.title
    info.userName = res.userName
    info.tags = res.tags   //合并当前章节 tags
    info.tags.unshift('长篇')
    info.textCount = res.publishedTotalCharacterCount
    info.description = res.caption
    info.coverUrl = util.urlCoverUrl(res.cover.urls["480mw"]) // 240mw, 480mw, 1200x1200, 128x128, original
    info.catalogUrl = util.urlSeriesDetailed(info.seriesId)
    info.createDate = util.dateFormat(res.createDate)
    info.updateDate = util.dateFormat(res.updateDate)

    let res2 = util.getAjaxJson(util.urlNovelDetailed(info.novelId)).body
    info.tags = info.tags.concat(res2.userNovels[`${info.novelId}`].tags)   //合并首章章节 tags
    info.tags = Array.from(new Set(info.tags))
    info.description = `${res.caption}\n首篇章节简介：\n${res2.description}`

    info.readingTime = `${res.publishedReadingTime / 60} 分钟`
    info.latestChapter = ""
    info.language = res.language
    info.totalChapterNum = info.total = res.total  //章节总数
    info.latestNovelId = res.latestNovelId
    return info
}

function novelHandler(res){
    let info = {}
    if (res.firstNovelId !== undefined) {
        info = seriesHandler(res)
    } else {
        info = oneShotHandler(res)
    }
    info.tags = info.tags.join(",")
    if (util.MORE_INFO_IN_DESCRIPTION) {
        info.description = `\n书名：${info.title}\n作者：${info.userName}\n标签：${info.tags}\n上传：${info.createDate}\n更新：${info.updateDate}\n简介：${info.description}`
    } else {
        info.description = `\n${info.description}\n上传时间：${info.createDate}\n更新时间：${info.updateDate}`
    }
    return info
}

(function (res) {
    res = util.getNovelResSeries(result)
    // res = util.getNovelRes(result)
    // if (res.seriesNavData !== null) {     // 使用 util.getNovelRes(result) 时
    //     res = util.getAjaxJson(util.urlSeriesDetailed(res.seriesNavData.seriesId)).body
    // }
    try {
        return novelHandler(res)
    } catch (e) {
        java.log(e)
        java.log(`受 Pixiv 的限制，无法获取当前小说数据`)
        java.longToast(`受 Pixiv 的限制，无法获取当前小说数据`)
    }
})();