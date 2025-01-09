@js:
var util = objParse(String(java.get("util")))
var seriesSet = new Set();  // 存储seriesID 有BUG无法处理翻页

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (typeof v == "string" && v.match("()")) {
            return eval(`(${v})`)
        }
        return v;
    })
}

function handlerFactory() {
    let cookie = String(java.getCookie("https://www.pixiv.net/", null))
    if (cookie === null || cookie === undefined || cookie === "") {
        return handlerNoLogin()
    }
    if (baseUrl.indexOf("/bookmark") !== -1) {
        return handlerBookMarks()
    }
    if (baseUrl.indexOf("/top") !== -1) {
        return handlerRecommend()
    }
    if (baseUrl.indexOf("/follow_latest") !== -1) {
        return handlerFollowLatest()
    }
    if (baseUrl.indexOf("/watch_list") !== -1) {
        return handlerWatchList()
    }
    if (baseUrl.indexOf("/ranking") !== -1) {
        return handlerRanking()
    }
    if (baseUrl.indexOf("/discovery") !== -1) {
        return handlerDiscovery()
    }
}

function handlerNoLogin() {
    return () => {
        java.longToast("此功能需要在书源登录后才能使用")
        return []
    }
}

// 推荐小说
function handlerRecommend() {
    return () => {
        let res = JSON.parse(result)
        const recommend = res.body.page.recommend
        const novels = res.body.thumbnails.novel
        let nidSet = new Set(recommend.ids)
        // java.log(nidSet.size)
        let list = novels.filter(novel => nidSet.has(String(novel.id)))
        // java.log(`过滤结果:${JSON.stringify(list)}`)
        return util.formatNovels(util.handNovels(util.combineNovels(list)))
    }
}

// 收藏小说
function handlerBookMarks() {
    return () => {
        let res = JSON.parse(result).body.works
        if (res === undefined || res.length === 0) {
            //流程无法本环节中止 只能交给下一流程处理
            return []
        }
        return util.formatNovels(util.handNovels(res))
    }
}

//关注作者，近期小说
function handlerFollowLatest() {
    return () => {
        let res = JSON.parse(result)
        return util.formatNovels(util.handNovels(util.combineNovels(res.body.thumbnails.novel)))
    }
}

//推荐小说
function handlerDiscovery() {
    return () => {
        let res = JSON.parse(result)
        return util.formatNovels(util.handNovels(util.combineNovels(res.body.novels)))
    }
}

// 追更列表
function handlerWatchList(){
    return () => {
        let res = JSON.parse(result)
        let novels = []
        let seriesList = res.body.thumbnails.novelSeries
        for (let i in seriesList) {
            let novelId = seriesList[i].latestEpisodeId  // 使用最后一篇小说，重新请求并合并小说
            let res = util.getAjaxJson(util.urlNovelDetailed(novelId))
            if (res.error !== true) {
                novels.push(res.body.userNovels[`${novelId}`])
            } else {
                java.log(JSON.stringify(res))
            }
        }
        return util.formatNovels(util.handNovels(util.combineNovels(novels)))
    }
}

// 排行榜
function handlerRanking(){
    return () => {
        let novels = []
        // let result = result + java.ajax(`${baseUrl}&p=2`)  // 正则获取网址中的 novelId
        let matched = result.match(RegExp(/\/novel\/show\.php\?id=\d{5,}/gm))

        for (let i in matched) {
            let novelId = matched[i].match(RegExp(/\d{5,}/))[0]
            java.log(util.urlNovelDetailed(novelId))

            let res = util.getAjaxJson(util.urlNovelDetailed(novelId))
            if (res.error !== true) {
                novel = res.body
                novel.updateDate = novel.uploadDate
                novel.tags = novel.tags.tags.map(item => item.tag)
                novel.textCount = novel.userNovels[`${novelId}`].textCount
                if (novel.seriesNavData !== null) {
                    novel.seriesId = novel.seriesNavData.seriesId
                    novel.title = novel.seriesNavData.title
                }
                novels.push(novel)
            } else {
                java.log(JSON.stringify(novel))
            }
        }
        return util.formatNovels(util.handNovels(util.combineNovels(novels)))
    }
}

(() => {
    return handlerFactory()()
})()