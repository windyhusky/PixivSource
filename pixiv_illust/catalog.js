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

function urlIllust(novelId){
    if (util.SHOW_ORIGINAL_NOVEL_LINK) {
        return urlIllustUrl(novelId)
    } else {
        return urlIllustDetailed(novelId)
    }
}

function oneShotHandler(res) {
    return [{
        title: res.title.replace(RegExp(/^\s+|\s+$/g), ""),
        // chapterUrl: urlIllust(res.id),
        chapterUrl: urlIllustDetailed(res.id),
        chapterInfo: `${timeTextFormat(res.createDate)}`
    }]
}

(() => {
    return oneShotHandler(JSON.parse(result).body)
})()