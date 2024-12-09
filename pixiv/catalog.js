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
    const limit = 30
    let returnList = []
    let seriesID = res.id
    let allChaptersCount = res.total
    util.debugFunc(() => {
        java.log(`本目录一共有:${allChaptersCount}章`);
    })

    //发送请求获得相应数量的目录列表
    function sendAjaxForGetChapters(lastIndex) {
        res = util.getAjaxJson(util.urlSeriesNovels(seriesID, limit, lastIndex)).body.thumbnails.novel
        res.forEach(v => {
            v.title = v.title.replace(`${v.seriesTitle}`, "").replace(RegExp(/（|）|-/g), "")
            v.chapterUrl = util.urlNovel(v.id)
            v.updateDate = util.timeTextFormat(v.createDate)
            util.debugFunc(() => {
                java.log(`${v.title}`)
            })
        })
        return res;
    }

    //逻辑控制者 也就是使用上面定义的两个函数来做对应功能
    //要爬取的总次数
    let max = (allChaptersCount / limit) + 1
    for (let i = 0; i < max; i++) {
        //java.log("i的值:"+i)
        let list = sendAjaxForGetChapters(i * limit);
        //取出每个值
        returnList = returnList.concat(list)
        // java.log(JSON.stringify(returnList))
    }
    return returnList
}

(() => {
    // 获取网址id，请求并解析数据，调试用
    var novelId = 0, res = ""
    let isHtml = result.startsWith("<!DOCTYPE html>")
    if (isHtml) {
        let isSeries = baseUrl.match(new RegExp("pixiv.net/(ajax/|)novel/series"))
        if (isSeries) {
            let seriesId = baseUrl.match(new RegExp("\\d+"))[0]
            java.log(`系列ID：${seriesId}`)
            novelId = util.getAjaxJson(util.urlSeriesDetailed(seriesId)).body.firstNovelId
            java.log(`首篇小说ID：${novelId}`)
            res = util.getAjaxJson(util.urlNovelDetailed(novelId)).body
        } else {
            let isNovel = baseUrl.match(new RegExp("pixiv.net/(ajax/|)novel"))
            if (isNovel) {
                novelId = baseUrl.match(new RegExp("\\d+"))[0]
                java.log(`详情：匹配小说ID：${novelId}`)
                res = util.getAjaxJson(util.urlNovelDetailed(novelId)).body
            } else {
                return []
            }
        }
    } else {
        res = JSON.parse(result).body
        if (res.total === 0) {
            return []
        }
    }

    if (res.firstNovelId !== null || res.firstNovelId !== undefined) {
        return seriesHandler(res)
    }
    if (res.seriesNavData === null || res.seriesNavData === undefined) {
        return oneShotHandler(res)
    }
})()