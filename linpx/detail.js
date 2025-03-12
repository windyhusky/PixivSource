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

function novelHandler(novel){
    novel = util.formatNovels(util.handNovels([novel]))[0]
    novel.detailedUrl = urlNovelUrl(novel.id)
    if (novel.seriesId === undefined || novel.seriesId === null) {
        novel.catalogUrl = urlNovelDetailed(novel.id)
    } else {
        novel.catalogUrl = urlSeriesDetailed(novel.seriesId)
    }
    return novel
}

(() => {
    try {
        return novelHandler(util.getNovelRes(result)) // 系列数据过少，暂不分流
    } catch (e) {
        java.log(e)
        java.log(`受 Linpx 的限制，无法获取当前小说的数据`)
    }
})();