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

(function (res) {
    res = JSON.parse(res)
    if (res.novels !== undefined) {
        res.novels.forEach(v => {
            // v.url = `https://api.furrynovel.ink/pixiv/novel/${v.id}${cache}`
            v.url = util.urlNovelUrl(v.id)
            // v.updateDate = String(v.coverUrl.match(RegExp("\\d{4}/\\d{2}/\\d{2}")))  //fake
            v.updateDate = util.timeTextFormat(util.getAjaxJson(v.url).createDate)
        })
        return res.novels
    }
    return [{
        id: res.id,
        title: res.title,
        updateDate: util.timeTextFormat(res.createDate)
    }]
})(result)
