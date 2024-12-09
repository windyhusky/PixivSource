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
    var novelId = 0
    let isHtml = res.startsWith("<!DOCTYPE html>")
    if (isHtml) {
        let isSeries = baseUrl.match(new RegExp("pixiv(\\.net|)/(ajax/)?(novel/)?series/\\d+"))
        if (isSeries) {
            let seriesId = baseUrl.match(new RegExp("\\d+"))[0]
            java.log(`系列ID：${seriesId}`)
            novelId = util.getAjaxJson(util.urlSeriesDetailed(seriesId)).novels[0].id
        } else {
            let isNovel = baseUrl.match(new RegExp("pn|pixiv(\\.net)?/(ajax/)?novel"))
            if (isNovel) {
                novelId = baseUrl.match(new RegExp("\\d+"))[0]
            }
        }
        java.log(`详情：匹配小说ID：${novelId}`)
        res = util.getAjaxJson(util.urlNovelDetailed(novelId))

    } else {
        // 处理 json ，自搜索或 api 链接
        res = JSON.parse(res)
        if (res.error === true || res.total === 0) {
            java.log(`Linpx 上暂无该小说(${id})，无法获取相关内容`)
            return []
        }
    }


    // 为了兼顾导入书架直接走详情页逻辑
    // 这里不能直接用 book.xxx 来复用搜索页处理结果
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
        java.log(`受 Linpx 的限制，无法获取小说ID： ${novelId} 的数据`)
        java.longToast(`受 Linpx 的限制，无法获取小说ID： ${novelId} 的数据`)
    }
})(result)
