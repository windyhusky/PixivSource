var util = objParse(String(java.get("util")))

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (isFunctionString(v)) {
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
        return startBrowser(baseUrl, "")
    }
}

(() => {
    return handlerFactory()
})()