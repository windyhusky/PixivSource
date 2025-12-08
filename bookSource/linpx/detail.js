var util = objParse(String(java.get("util")))

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (typeof v == "string" && v.match("()")) {
            return eval(`(${v})`)
        }
        return v;
    })
}

function novelHandler(novel) {
    novel = util.formatNovels(util.handNovels([novel]))[0]
    novel.detailedUrl = urlNovelUrl(novel.id)
    if (!novel.seriesId) {
        novel.catalogUrl = urlNovelDetailed(novel.id)
    } else {
        novel.catalogUrl = urlSeriesDetailed(novel.seriesId)
    }
    return novel
}

(() => {
    return novelHandler(util.getNovelRes(result))
})();