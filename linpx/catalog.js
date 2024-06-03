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
    let cache = function () {
        if (baseUrl.includes("/cache")) {
            return "/cache"
        }
        return ""
    }()

    if (res.novels !== undefined) {
        res.novels.forEach(v => {
            v['url'] = `https://api.furrynovel.ink/pixiv/novel/${v.id}${cache}`
        })
        return res.novels
    }
    return [{
        id: res.id,
        title: res.title
    }]
})(result)
