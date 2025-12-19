var util = objParse(String(java.get("util")))

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (typeof v == "string" && v.match("()")) {
            return eval(`(${v})`)
        }
        return v;
    })
}

function urlNovelChapter(novelId, chapterId) {
    if (util.settings.SHOW_ORIGINAL_LINK) {
        return urlNovelChapterUrl(novelId, chapterId)
    } else {
        return urlNovelChapterDetail(novelId, chapterId)
    }
}

function novelHandler(novels) {
    novels.forEach(novel => {
        novel.chapterId = novel.id
        novel.novelId = baseUrl.match(RegExp(/\d+/))[0]
        novel.detailedUrl = urlNovelUrl(novel.novelId)
        novel.chapterName = novel.title = novel.name
        novel.chapterUrl =  urlNovelChapter(novel.novelId, novel.chapterId)
        novel.chapterInfo = `${novel.created_at}　　${novel.text_count}字`
    })
    return novels
}

(function () {
    return novelHandler(util.getNovelRes(result, "catalog"))
})()