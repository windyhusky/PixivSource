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
    if (baseUrl.includes("https://cdn.jsdelivr.net")) {
        return () => {updateSource(); return []}
    }
    if (!isLogin()) {
        return handlerNoLogin()
    }
    if (baseUrl.includes("/bookmark")) {
        return handlerBookMarks()
    }
    if (baseUrl.includes("/top")) {
        return handlerRecommend()
    }
    if (baseUrl.includes("/follow_latest")) {
        return handlerFollowLatest()
    }
    if (baseUrl.includes("/watch_list")) {
        return handlerWatchList()
    }
    if (baseUrl.includes("/discovery")) {
        return handlerDiscovery()
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
    if (baseUrl.includes("/genre")) {
        return handlerWatchList()
    }
    // 正则匹配网址内容
    if (baseUrl.includes("/ranking")) {
        return handlerRanking()
    }
    if (baseUrl.includes("/marker_all")) {
        return handlerRanking()
    }
    if (baseUrl.includes("/editors_picks")) {
        return handlerRanking()
    }
    if (baseUrl.includes("https://www.pixiv.net")) {
        return handlerRanking()
    }
    else {
        return []
    }
}

function handlerNoLogin() {
    return () => {
        sleepToast("此功能需要在书源登录后才能使用")
        sleepToast('发现 - 长按"Pixiv" - 登录 - 登录账号')
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

// 收藏小说，他人收藏
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

//关注作者，小说委托，小说企划
function handlerFollowLatest() {
    return () => {
        let res = JSON.parse(result)
        return util.formatNovels(util.handNovels(util.combineNovels(res.body.thumbnails.novel)))
    }
}

//推荐小说，最近小说
function handlerDiscovery() {
    return () => {
        let res = JSON.parse(result)
        return util.formatNovels(util.handNovels(util.combineNovels(res.body.novels)))
    }
}

// 追更列表，热门分类
function handlerWatchList() {
    return () => {
        let res = JSON.parse(result)
        return util.formatNovels(util.handNovels(res.body.thumbnails.novelSeries))
    }
}

// 排行榜，书签，首页，编辑部推荐，顺序相同
function handlerRanking() {
    return () => {
        let novelUrls = []
        // let result = result + java.ajax(`${baseUrl}&p=2`)  // 正则获取网址中的 novelId
        let matched = result.match(RegExp(/\/novel\/show\.php\?id=\d{5,}/gm))
        for (let i in matched) {
            let novelId = matched[i].match(RegExp(/\d{5,}/))[0]
            novelUrls.push(urlNovelDetailed(novelId))
        }
        let novels = getAjaxAllJson(novelUrls).map(resp => resp.body)
        return util.formatNovels(util.handNovels(util.combineNovels(novels)))
    }
}

(() => {
    return handlerFactory()()
})()