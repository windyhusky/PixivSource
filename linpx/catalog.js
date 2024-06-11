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
            // v['url'] = `https://api.furrynovel.ink/pixiv/novel/${v.id}${cache}`
            v['url'] = util.urlNovelUrl(v.id)
        })
        return res.novels
    }
    return [{
        id: res.id,
        title: res.title
    }]
})(result)
