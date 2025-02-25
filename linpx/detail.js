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

function novelHandler(res){
    let info = {}
    info.novelId = res.id
    info.title = res.title.replace(RegExp(/^\s+|\s+$/g), "")
    info.userName = res.userName
    info.tags = res.tags
    info.textCount = res.length
    info.description = res.desc
    info.coverUrl = urlCoverUrl(res.coverUrl)
    // info.catalogUrl = urlNovelDetailed(res.id)
    info.createDate = timeTextFormat(res.createDate)

    if (res.series === undefined || res.series === null) {
        info.title = info.latestChapter = info.title
        info.tags.unshift('单本')
        info.detailedUrl = urlNovelUrl(info.novelId)
        info.catalogUrl = urlNovelDetailed(info.novelId)
    } else {
        info.seriesId = res.series.id
        info.title = res.series.title.replace(RegExp(/^\s+|\s+$/g), "")
        info.tags.unshift('长篇')
        info.detailedUrl = urlSeriesUrl(info.seriesId)
        info.catalogUrl = urlSeriesDetailed(info.seriesId)

        let res2 = getAjaxJson(urlSeriesDetailed(info.seriesId))
        info.tags = info.tags.concat(res2.tags)   //合并系列 tags
        info.tags = Array.from(new Set(info.tags))
        info.description = `${res2.caption}\n当前章节简介：\n${info.description}`
    }
    info.tags2 = []
    for (let i in info.tags) {
        tag = info.tags[i]
        if (tag.includes("/")) {
            let tags = tag.split("/")
            info.tags2 = info.tags2.concat(tags)
        } else {
            info.tags2.push(tag)
        }
    }
    info.tags = info.tags2.join(",")
    if (util.MORE_INFO_IN_DESCRIPTION) {
        info.description = `\n书名：${info.title}\n作者：${info.userName}\n标签：${info.tags}\n上传：${info.createDate}\n简介：${info.description}`
    } else {
        info.description = `\n${info.description}\n上传时间：${info.createDate}`
    }
    return info
}

(function (res) {
    // 为了兼顾导入书架直接走详情页逻辑，不能直接用 book.xxx 来复用搜索页处理结果
    res = util.getNovelRes(result)  // 系列数据过少，暂不分流
    try {
        return novelHandler(res)
    }catch (e) {
        java.log(e)
        java.log(`受 Linpx 的限制，无法获取当前小说的数据`)
    }
})(result)