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

function getIllusts() {
    if (JSON.parse(result).error !== true){
        java.log(JSON.parse(result).length)
        return JSON.parse(result).body.illustManga.data
    } else {
        return []
    }

}

function getManga() {

}

function isNotUndefined(obj) {
    return (obj !== undefined && obj !== null)
}
function handIllusts(illusts) {
    illusts.forEach(illust => {
        // illust.id = illust.id
        // illust.title = illust.title
        // illust.userName = illust.userName
        // illust.tags = illust.tags
        illust.textCount = null
        // illust.latestChapter = illust.latestChapter
        // illust.description = illust.description

        if (isNotUndefined(illust.url)) {
            illust.coverUrl = illust.url
        } else {
            illust.coverUrl = illust.urls.regular
        }
        illust.detailedUrl = urlIllustDetailed(illust.id)

        // illust.pageCount = illust.pageCount
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
    let illusts = []
    illusts = illusts.concat(getIllusts())
    // java.log(JSON.stringify(illusts))
    // 返回空列表中止流程
    if (illusts.length === 0) {
        return []
    }
    // return util.formatIllusts(util.handIllusts(illusts))
    return formatIllusts(handIllusts(illusts))
})();