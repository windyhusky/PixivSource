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
    if (JSON.parse(result).error !== true){
        java.log(JSON.parse(result).length)
        illusts = JSON.parse(result).body.illustManga.data
        illusts.forEach(illust =>{
            illust.tags.unshift("漫画")
        })
        return illusts
    } else {
        return []
    }

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
    illusts.forEach(illust =>{
        illust.tags.unshift("插画")
    })
    return illusts
}

(() => {
    let artworks = []
    artworks = artworks.concat(getManga())
    // artworks = artworks.concat(getIllust())
    // java.log(JSON.stringify(artworks))
    // 返回空列表中止流程
    if (artworks.length === 0) {
        return []
    }
    return util.formatIllusts(util.handIllusts(artworks))
})()