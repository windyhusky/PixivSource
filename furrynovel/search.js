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

function getNovels() {
    if (JSON.parse(result).code === 200 && JSON.parse(result).count > 0){
        return JSON.parse(result).data
    } else {
        return []
    }
}

function handNovels(novels) {
    novels.forEach(novel =>{
        // novel.id = novel.id
        novel.title = novel.name
        // novel.tags = novel.tags
        novel.userName = novel.author.name
        // novel.userId = novel.author.id
        novel.textCount = null
        novel.latestChapter =novel.latest_chapters[0].name
        novel.description = novel.desc
        novel.coverUrl = novel.cover
        novel.detailedUrl = util.urlNovelDetail(novel.id)

        // novel.source = novel.source
        novel.oneShot = novel.ext_data.oneShot
        novel.sourceId = novel.source_id
        novel.sourceUrl = util.urlSourceUrl(novel.source, novel.oneShot, novel.sourceId)

        novel.createDate = novel.created_at
        novel.updateDate = novel.updated_at
        novel.syncDate = novel.fetched_at
        // novel.status = novel.status
        if (novel.status !== "publish"){  // suspend
            java.log(util.urlNovelUrl(novel.id))
            java.log(novel.sourceUrl)
        }
    })
    return novels
}

// 小说信息格式化
function formatNovels(novels) {
    novels.forEach(novel => {
        novel.title = novel.title.replace(RegExp(/^\s+|\s+$/g), "")
        novel.tags = novel.tags.join(",")
        novel.createDate = util.dateFormat(novel.createDate)
        novel.updateDate = util.dateFormat(novel.updateDate)
        novel.syncDate = util.dateFormat(novel.syncDate)
        if (util.MORE_INFO_IN_DESCRIPTION) {
            novel.description = `\n书名：${novel.title}\n作者：${novel.userName}\n标签：${novel.tags}\n上传：${novel.createDate}\n更新：${novel.updateDate}\n同步：${novel.syncDate}\n简介：${novel.description}`
        } else {
            novel.description = `\n${novel.description}\n上传时间：${novel.createDate}\n更新时间：${novel.updateDate}\n
            同步时间：${novel.syncDate}`
        }
    })
    return novels
}

(() => {
    let novels = []
    novels = novels.concat(getNovels())
    // 返回空列表中止流程
    if (novels.length === 0) {
        return []
    }
    return formatNovels(handNovels(novels))
    // return util.formatNovels(util.handNovels(novels))
})();