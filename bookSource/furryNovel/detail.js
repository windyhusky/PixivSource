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
    book.bookUrl = novel.detailedUrl = urlNovelUrl(novel.id)
    book.tocUrl = novel.catalogUrl = urlNovelChapterInfo(novel.id)
    return novel
}

(() => {
    return novelHandler(util.getNovelRes(result, "detail"))
})();