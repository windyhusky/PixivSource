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

function handlerFactory() {
    if (baseUrl.includes("https://cdn.jsdelivr.net")) {
        return updateSource()
    }
    if (baseUrl.includes("furrynovel.com")) {
        return util.formatNovels(util.handNovels(util.getNovels()))
    }
    else {
        return []
    }
}

(() => {
    return handlerFactory()
})()