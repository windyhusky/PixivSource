var util = objParse(String(java.get("util")))

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (typeof v == "string" && v.match("()")) {
            return eval(`(${v})`)
        }
        return v;
    })
}

function getArtwork() {
    if (JSON.parse(result).error !== true) {
        cache.put(urlSearchArtwork(java.get("key"), java.get("page")), result, cacheSaveSeconds)  // 加入缓存
        return JSON.parse(result).body.illustManga.data
    } else {
        return []
    }
}

function search(name, page) {
    let resp = getAjaxJson(urlSearchArtwork(name, page))
    java.log(urlSearchArtwork(name, page))
    if (resp.error === true || resp.total === 0) {
        return {"data": [], "total":0, "lastPage": 0}
    }
    return resp.body.illustManga
}

function getConvertArtwork() {
    let illusts = []
    let name = String(java.get("key"))
    let name1 = String(java.s2t(name))
    let name2 = String(java.t2s(name))
    if (name1 !== name) illusts = illusts.concat(search(name1, 1).data)
    if (name2 !== name) illusts = illusts.concat(search(name2, 1).data)
    return illusts
}

(() => {
    let artworks = []
    artworks = artworks.concat(getArtwork())
    if (util.CONVERT_CHINESE) artworks = artworks.concat(getConvertArtwork())
    // java.log(JSON.stringify(artworks))
    // 返回空列表中止流程
    if (artworks.length === 0) {
        return []
    }
    return util.formatIllusts(util.handIllusts(artworks))
})()