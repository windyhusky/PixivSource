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
            v.createDate = util.getAjaxJson(v.url).createDate
            v.updateDate = `${v.createDate.slice(0, 10)} ${v.createDate.slice(11, 19)}`
        })
        return res.novels
    }
    return [{
        id: res.id,
        title: res.title,
        updateDate:`${res.createDate.slice(0, 10)} ${res.createDate.slice(11, 19)}`
    }]
})(result)
