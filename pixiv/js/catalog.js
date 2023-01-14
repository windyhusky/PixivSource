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

function seriesHandler(res) {
    const limit = 30
    let returnList = [];
    let seriesID = res.seriesNavData.seriesId
    let allChaptersCount = (() => {
        let result = util.cacheGetAndSet(util.urlSeries(seriesID), () => {
            return JSON.parse(java.ajax(util.urlSeries(seriesID)))
        }).body.total
        util.debugFunc(() => {
            java.log(`本目录一共有:${result} 章节`);
        })
        return result;
    })();

    //发送请求获得相应数量的目录列表
    function sendAjaxForGetChapters(lastIndex) {
        let url = util.urlSeriesNovels(seriesID, limit, lastIndex)
        res = util.cacheGetAndSet(url, () => {
            return JSON.parse(java.ajax(url))
        })
        res = res.body.page.seriesContents
        res.forEach(v => {
            v.chapterUrl = util.urlNovelDetailed(v.id)
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
        returnList.concat(list)
    }
    return returnList
}

function aloneHandler() {
    return [{title: book.name, chapterUrl: baseUrl}]
}

(() => {
    let res = JSON.parse(result).body
    if (res.seriesNavData === null || res.seriesNavData === undefined) {
        return aloneHandler()
    }
    return seriesHandler(res)
})()