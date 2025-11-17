var util = objParse(String(java.get("util")))

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (typeof v == "string" && v.match("()")) {
            return eval(`(${v})`)
        }
        return v;
    })
}

function illustHandler(illust){
    illust = util.formatIllusts(util.handIllusts([illust]))[0]
    book.bookUrl = illust.detailedUrl = urlIllustUrl(illust.id)
    book.tocUrl = illust.catalogUrl = urlIP(urlIllustDetailed(illust.id))
    return illust
}

(() => {
    return illustHandler(util.getIllustRes(result))
})()