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

function novelHandler(novel) {
    novel = util.formatNovels(util.handNovels([novel]))[0]
    novel.detailedUrl = urlNovelUrl(novel.id)
    novel.catalogUrl = urlNovelChapterInfo(novel.id)
    return novel
}

(() => {
    try {
        return novelHandler(util.getNovelRes(result, "detail"))
    } catch (e) {
        java.log(e)
        java.log(`受 FurryNovel.com 限制，无法获取当前小说数据`)
    }
})();