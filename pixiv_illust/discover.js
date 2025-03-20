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
    java.log(baseUrl)
    if (cookie === null || cookie === undefined || cookie === "") {
        return handlerNoLogin()
    }
    if (baseUrl.includes("/follow_latest")) {
        return handlerFollowLatest()
    }
    if (baseUrl.includes("/watch_list")) {
        return handlerWatchList()
    }
    if (baseUrl.includes("/top")) {
        return handlerRecommend()
    }
    if (baseUrl.includes("/discovery")) {
        return handlerDiscovery()
    }
    if (baseUrl.includes("/bookmark")) {
        return handlerBookMarks()
    }
    if (baseUrl.includes("/new")) {
        return handlerDiscovery()
    }
    if (baseUrl.includes("/commission/")) {
        return handlerFollowLatest()
    }
    if (baseUrl.includes("/user_event/portal")) {
        return handlerFollowLatest()
    }
    // 正则匹配网址内容
    // if (baseUrl.includes("/ranking")) {
    //     return handlerRanking()
    // }
    // if (baseUrl.includes("https://www.pixiv.net")) {
    //     return handlerRegexIllusts()
    // }
    if (baseUrl.includes("https://cdn.jsdelivr.net")) {
        return updateSource()
    }
    else {
        return []
    }
}

function handlerNoLogin() {
    return () => {
        sleepToast("此功能需要在书源登录后才能使用")
        sleepToast('发现页 - 长按"Pixiv" - 登录 - 登录账号')
        return []
    }
}

//关注作者，漫画委托，漫画企划
function handlerFollowLatest() {
    return () => {
        let res = JSON.parse(result)
        return util.formatIllusts(util.handIllusts(res.body.thumbnails.illust))
    }
}

// 追更列表
function handlerWatchList() {
    return () => {
        let res = JSON.parse(result)
        // li =  res.body.page.watchedSeriesIds
        return util.formatIllusts(util.handIllusts(res.body.thumbnails.illust))
    }
}

// 推荐漫画
function handlerRecommend() {
    return () => {
        let res = JSON.parse(result)
        const recommend = res.body.page.recommend
        const illusts = res.body.thumbnails.illust
        let nidSet = new Set(recommend.ids)
        // java.log(nidSet.size)
        let list = illusts.filter(novel => nidSet.has(String(novel.id)))
        // java.log(`过滤结果:${JSON.stringify(list)}`)
        return util.formatIllusts(util.handIllusts(list))
    }
}

//发现漫画
function handlerDiscovery() {
    return () => {
        let res = JSON.parse(result)
        return util.formatIllusts(util.handIllusts(res.body.illusts))
    }
}

// 收藏漫画
function handlerBookMarks() {
    return () => {
        let res = JSON.parse(result).body.works
        if (res === undefined || res.length === 0) {
            //流程无法本环节中止 只能交给下一流程处理
            return []
        }
        return util.formatIllusts(util.handIllusts(res))
    }
}

(() => {
    return handlerFactory()()
})()