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

function getContent(res) {
    let content = [""]
    // li = "mini thumb small regular original".split(" ")
    let illustLink = getAjaxJson(urlIllustDetailed(res.id)).body.urls.original
    for (let order = 0; order < res.pageCount; order++) {
        content.push(`<img src="${illustLink}">`)
        illustLink = illustLink.replace(`_p${order}`, `_p${order + 1}`)
    }
    content = content.join("\n")
    return content
}

(function () {
    return getContent(util.getIllustRes(result))
})()