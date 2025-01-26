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
    info.seriesId = undefined
    info.id = info.novelId = res.id
    info.title = info.latestChapter = res.title.replace(RegExp(/^\s+|\s+$/g), "")
    info.userName = res.userName
    info.tags = res.tags.tags.map(item => item.tag)
    info.tags.unshift('单本')
    // info.textCount = res.textCount  // 无数据
    info.textCount = res.userNovels[`${info.novelId}`].textCount
    info.description = res.description
    info.coverUrl = util.urlCoverUrl(res.coverUrl)
    info.detailedUrl = util.urlNovelUrl(info.novelId)
    info.catalogUrl = util.urlNovelDetailed(info.novelId)
    info.createDate = util.dateFormat(res.createDate)
    info.updateDate = util.dateFormat(res.uploadDate)

    info.readingTime = `${res.userNovels[`${info.novelId}`].readingTime / 60} 分钟`
    return info
}

function seriesHandler(res) {
    let info = {}
    info.seriesId = res.id
    info.id = info.novelId = res.firstNovelId
    info.title = res.title.replace(RegExp(/^\s+|\s+$/g), "")
    info.userName = res.userName
    info.tags = res.tags   //合并当前章节 tags
    info.tags.unshift('长篇')
    info.textCount = res.publishedTotalCharacterCount
    info.description = res.caption
    info.coverUrl = util.urlCoverUrl(res.cover.urls["480mw"]) // 240mw, 480mw, 1200x1200, 128x128, original
    info.detailedUrl = util.urlSeriesUrl(info.seriesId)
    info.catalogUrl = util.urlSeriesDetailed(info.seriesId)
    info.createDate = util.dateFormat(res.createDate)
    info.updateDate = util.dateFormat(res.updateDate)

    // 发送请求获取第一章 获取标签与简介
    let firstNovel = {}
    try {
        firstNovel = util.getAjaxJson(util.urlNovelDetailed(info.novelId)).body
        info.tags = info.tags.concat(firstNovel.tags.tags.map(item => item.tag))
    } catch (e) {  // 防止系列首篇无权限获取
        firstNovel = util.getAjaxJson(util.urlSeriesNovels(info.seriesId, 30, 0)).body.thumbnails.novel[0]
        info.id = info.novelId = firstNovel.id
        info.tags = info.tags.concat(firstNovel.tags)
    }
    info.tags = Array.from(new Set(info.tags))
    if (info.description === "") {
        info.description = firstNovel.description
    }

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
    }
})();