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
    novel.detailedUrl = util.urlNovelUrl(novel.id)
    novel.catalogUrl = util.urlNovelChapterInfo(novel.id)
    return novel
}

(() => {
    res = JSON.parse(result).data
    return novelHandler(res)
})();