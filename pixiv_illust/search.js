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
    for (let page = Number(java.get("page")) + 1; page < resp.body.novel.lastPage, page < MAXPAGES; page++) {
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

function handIllusts(illusts) {
    illusts.forEach(illust => {
        // illust.id = illust.id
        // illust.title = illust.title
        // illust.userName = illust.userName
        // illust.tags = illust.tags
        illust.textCount = null
        // illust.pageCount = illust.pageCount
        // illust.latestChapter = illust.latestChapter
        // illust.description = illust.description

        if (isNotUndefined(illust.url)) {
            illust.coverUrl = illust.url
        } else {
            illust.coverUrl = illust.urls.regular
        }
        illust.detailedUrl = urlIllustDetailed(illust.id)

        // illust.createDate = illust.createDate
        if (isNotUndefined(illust.updateDate)) {
            // illust.updateDate = illust.updateDate
        } else {
            illust.updateDate = illust.uploadDate
        }
        // illust.aiType = illust.aiType
    })
    return illusts
}

function formatIllusts(illusts) {
    illusts.forEach(illust => {
        illust.title = illust.title.replace(RegExp(/^\s+|\s+$/g), "")
        illust.tags = Array.from(new Set(illust.tags))
        illust.tags = illust.tags.join(",")
        illust.coverUrl = urlCoverUrl(illust.coverUrl)
        illust.createDate = dateFormat(illust.createDate)
        illust.updateDate = dateFormat(illust.updateDate)
        if (util.MORE_INFO_IN_DESCRIPTION) {
            illust.description = `\n书名：${illust.title}\n作者：${illust.userName}\n标签：${illust.tags}\n上传：${illust.createDate}\n更新：${illust.updateDate}\n简介：${illust.description}`
        } else {
            illust.description = `\n${illust.description}\n上传时间：${illust.createDate}\n更新时间：${illust.updateDate}`
        }
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
    // return util.formatIllusts(util.handIllusts(artworks))
    return formatIllusts(handIllusts(artworks))
})();