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

function illustHandler(illust){
    illust = util.formatIllusts(util.handIllusts([illust]))[0]
    book.bookUrl = illust.detailedUrl = urlIllustUrl(illust.id)
    book.tocUrl = illust.catalogUrl = urlIllustDetailed(illust.id)
    return illust
}

(() => {
    try {
        return illustHandler(util.getIllustRes(result))
    } catch (e) {
        java.log(e)
        java.log(`受 Pixiv 的限制，无法获取当前插画的数据`)
    }
})()