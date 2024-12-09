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
    return [{
        title: res.title,
        chapterUrl: util.urlNovel(res.id),
        updateDate: util.timeTextFormat(res.createDate)
    }]
}

function seriesHandler(res) {
    res.novels.forEach(v => {
        v.title = v.title.replace(`${res.title}`, "").replace(RegExp(/（|）|-/g), "")
        v.chapterUrl = util.urlNovel(v.id)
        // v.updateDate = String(v.coverUrl.match(RegExp("\\d{4}/\\d{2}/\\d{2}")))  //fake
        v.updateDate = util.timeTextFormat(util.getAjaxJson(util.urlNovelDetailed(v.id)).createDate)
        util.debugFunc(() => {
            java.log(`${v.title}`)
        })
    })
    return res.novels
}

(function (res) {
    // 获取网址id，请求并解析数据，调试用
    let isHtml = res.startsWith("<!DOCTYPE html>")
    let id = baseUrl.match(new RegExp("\\d+"))[0]
    if (isHtml) {
        let matchResult = baseUrl.match(new RegExp("pn|pixiv(\\.net)?/(ajax/)?novel"))
        if (matchResult == null) {
            return []
        }
        res = util.getAjaxJson(util.urlNovelDetailed(id))
        java.log(`目录：当前小说ID：${id}`)
        if (res.series !== undefined) {
            java.log(`目录：当前系列ID：${res.series.id}${res.series.title}`)
            res = util.getAjaxJson(util.urlSeriesDetailed(res.series.id))
        }
    } else {
        res = JSON.parse(res)
        if (res.error === true || res.total === 0) {
            java.log(`Linpx 上暂无该小说(${id})，无法获取相关内容`)
            return []
        }
    }

    if (res.novels === undefined) {
        return oneShotHandler(res)
    }
    return seriesHandler(res)
})(result)
