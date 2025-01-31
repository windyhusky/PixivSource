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

(function () {
    res = JSON.parse(result).data
    return novelHandler(res)
})()