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
    if (JSON.parse(result).error !== true) {
        cache.put(urlSearchManga(java.get("key"), java.get("page")), result, cacheSaveSeconds)  // 加入缓存
        let illusts = JSON.parse(result).body.illustManga.data
        illusts.forEach(illust => {illust.tags.unshift("漫画")})
        return illusts
    } else {
        return []
    }
}

function search(name, type, page) {
    let resp = getAjaxJson(urlSearchManga(name, page))
    java.log(urlSearchManga(name, page))
    if (resp.error === true || resp.total === 0) {
        return {"data": [], "total":0, "lastPage": 0}
    }
    return resp.body.illustManga.data
}

function getConvertManga() {
    let illusts = []
    let name = String(java.get("key"))
    let name1 = String(java.s2t(name))
    let name2 = String(java.t2s(name))
    if (name1 !== name) illusts = illusts.concat(search(name1, "series", 1).data)
    if (name2 !== name) illusts = illusts.concat(search(name2, "series", 1).data)
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
            break
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