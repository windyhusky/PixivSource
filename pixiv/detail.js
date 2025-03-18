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
    if (novel.seriesId === undefined || novel.seriesId === null) {
        novel.detailedUrl = urlNovelUrl(novel.id)
        novel.catalogUrl = urlNovelDetailed(novel.id)
    } else {
        novel.detailedUrl = urlSeriesUrl(novel.seriesId)
        novel.catalogUrl = urlSeriesDetailed(novel.seriesId)
    }
    return novel
}

(() => {
    try {
        return novelHandler(util.getNovelRes(result))
    } catch (e) {
        java.log(e)
        java.log(`受 Pixiv 的限制，无法获取当前小说数据`)
    }
})()