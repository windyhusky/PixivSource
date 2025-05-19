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

function getManga() {
    if (JSON.parse(result).error === true) {
        return []
    }
    let illusts = JSON.parse(result).body.illustManga.data
    illusts.forEach(illust => {illust.tags.unshift("漫画")})
    return illusts
}

function getConvertManga() {
    let MAXPAGES = 2, illusts = []
    let novelName = String(java.get("key"))
    let name = java.s2t(java.t2s(java.s2t(novelName)))
    let resp = getAjaxJson(urlSearchManga(name, 1)).body
    java.log(urlSearchManga(name, 1))
    illusts = illusts.concat(resp.illustManga.data)
    // for (let page = 2; page < resp.lastPage, page < MAXPAGES; page++) {
    //     illusts = illusts.concat(getAjaxJson(urlSearchManga(name, page)).body.illustManga.data)
    //     java.log(urlSearchManga(name, page))
    // }
    illusts.forEach(illust => {illust.tags.unshift("漫画")})
    return illusts
}

function getIllust() {
    let MAXPAGES = 3, illusts = []
    let name = String(java.get("key"))
    java.log(urlSearchIllust(name, 1))
    let resp = getAjaxJson(urlSearchIllust(name, 1))
    if (resp.error === true) {
        return []
    }
    illusts = illusts.concat(resp.body.illustManga.data)
    for (let page = Number(java.get("page")) + 1; page < resp.body.illustManga.lastPage, page < MAXPAGES; page++) {
        java.log(`正在搜索第${page}页`)
        let resp = getAjaxJson(urlSearchIllust(name, page))
        if (resp.error === true) {
            return []
        }
        illusts = illusts.concat(resp.body.illustManga.data)
    }
    illusts.forEach(illust => {illust.tags.unshift("插画")})
    return illusts
}

(() => {
    let artworks = []
    artworks = artworks.concat(getManga())
    if (util.CONVERT_CHINESE) artworks = artworks.concat(getConvertManga())
    if (util.SEARCH_ILLUSTS) artworks = artworks.concat(getIllust())
    // java.log(JSON.stringify(artworks))
    // 返回空列表中止流程
    if (artworks.length === 0) {
        return []
    }
    return util.formatIllusts(util.handIllusts(artworks))
})()