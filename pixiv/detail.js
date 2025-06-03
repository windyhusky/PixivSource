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
    novel = util.formatNovels(util.handNovels([novel], true))[0]
    if (novel.seriesId === undefined || novel.seriesId === null) {
        novel.detailedUrl = urlNovelUrl(novel.id)
        novel.catalogUrl = urlNovelDetailed(novel.id)
    } else {
        novel.detailedUrl = urlSeriesUrl(novel.seriesId)
        novel.catalogUrl = urlSeriesDetailed(novel.seriesId)
    }
    source.putLoginInfo(JSON.stringify(novel))  // 放入信息以便登陆界面使用
    return novel
}

(() => {
    return novelHandler(util.getNovelRes(result))
})()