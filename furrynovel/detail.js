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

function getNovelRes(result){
    let res = {}
    let isHtml = result.startsWith("<!DOCTYPE html>")
    let pattern = "(https?://)?(www\\.)?furrynovel\\.com/(zh|en|ja)/novel/\\d+(/chapter/d+)?"
    let fnWebpage = baseUrl.match(new RegExp(pattern))
    if (isHtml && fnWebpage) {
        let novelId = baseUrl.match(new RegExp("\\d+"))[0]
        res = util.getAjaxJson(util.urlNovelDetail(novelId))
    } else {
        res = JSON.parse(result)
    }
    if (res.data.length === 0) {
        java.log(`无法从 FurryNovel.com 获取当前小说`)
        java.log(JSON.stringify(res))
    }
    return res.data
}

(() => {
    try {
        return novelHandler(getNovelRes(result))
    } catch (e) {
        java.log(e)
        java.log(`受 FurryNovel.com 限制，无法获取当前小说数据`)
    }
})();