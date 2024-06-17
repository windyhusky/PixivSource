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

(() => {
    if (result.startsWith("<!DOCTYPE html>")) {
        return {}
    }

    // java.log(`详情信息:${result}`)
    let res = JSON.parse(result).body
    info = {}
    info.author = book.author
    info.name = book.name
    info.tags = book.kind
    info.wordCount = book.wordCount
    info.latestChapter = null
    info.desc = book.intro
    info.coverUrl = book.coverUrl
    info.catalogUrl = util.urlNovelDetailed(res.id)
    return info
})();