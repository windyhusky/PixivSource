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

function novelHandler(novels) {
    novels.forEach(novel => {
        novel.chapterId = novel.id
        novel.novelId = baseUrl.match(RegExp(/\d+/))[0]
        novel.chapterName = novel.title = novel.name
        novel.chapterUrl =  util.urlNovelChapterDetail(novel.novelId, novel.chapterId)
        novel.chapterInfo = `${novel.created_at}　　${novel.text_count}字`
    })
    return novels
}

function getNovelRes(result){
    let res = {}
    let isHtml = result.startsWith("<!DOCTYPE html>")
    let pattern = "(https?://)?(www\\.)?furrynovel\\.com/(zh|en|ja)/novel/\\d+(/chapter/d+)?"
    let fnWebpage = baseUrl.match(new RegExp(pattern))
    if (isHtml && fnWebpage) {
        let novelId = baseUrl.match(new RegExp("\\d+"))[0]
        // res = util.getAjaxJson(util.urlNovelDetail(novelId))
        res = util.getAjaxJson(util.urlNovelChapterInfo(novelId))
    } else {
        res = JSON.parse(result)
    }
    if (res.data.length === 0) {
        java.log(`无法从 FurryNovel.com 获取当前小说`)
        java.log(JSON.stringify(res))
    }
    return res.data
}

(function () {
    return novelHandler(getNovelRes(result))
})()