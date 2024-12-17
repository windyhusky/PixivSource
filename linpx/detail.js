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
    // 为了兼顾导入书架直接走详情页逻辑
    // 这里不能直接用 book.xxx 来复用搜索页处理结果
    res = util.getNovelRes(result)
    try {
        let info = {}
        info.userName = res.userName
        info.tags = res.tags
        info.textCount = res.length
        info.description = res.desc
        info.coverUrl = util.urlCoverUrl(res.coverUrl)

        if (res.series === undefined || res.series === null) {
            info.title = info.latest_chapter = res.title
            info.tags.unshift('单本')
            info.catalog = util.urlNovelDetailed(res.id)
        } else {
            info.title = res.series.title
            info.tags.unshift('长篇')
            info.catalog = util.urlSeriesDetailed(res.series.id)
        }
        info.tags = info.tags.join(",")
        // info.description = `${info.description}\n更新时间：${info.time}`
        if (util.MORE_INFO_IN_DESCRIPTION) {
            info.description = `书名：${info.title}\n作者：${info.userName}\n标签：${info.tags}\n更新：${info.time}\n简介：${info.description}`
        }
        return info

    }catch (e) {
        java.log(e)
        java.log(`受 Linpx 的限制，无法获取当前小说的数据`)
        java.longToast(`受 Linpx 的限制，无法获取当前小说的数据`)
    }
})(result)
