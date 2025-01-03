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

function handNovels(novels) {
    novels.forEach(novel => {
        if (novel.tags === undefined || novel.tags === null) {
            novel.tags = []
        }

        if (novel.seriesId === undefined || novel.seriesId === null) {
            novel.tags.unshift("单本")
        } else {
            let userAllWorks = util.getAjaxJson(util.urlUserAllWorks(novel.userId)).body
            for (let series of userAllWorks.novelSeries) {
                if (series.id === novel.seriesId) {
                    // let series = util.getAjaxJson(util.urlSeriesDetailed(novel.seriesId)).body
                    novel.textCount = series.publishedTotalCharacterCount
                    novel.url = series.cover.urls["480mw"]
                    novel.title = series.title
                    novel.tags = series.tags
                    novel.description = series.caption

                    try{
                        // 发送请求获取第一章 获取标签与简介
                        if (novel.tags.length === 0 || novel.description === "") {
                            let firstNovel = util.getAjaxJson(util.urlNovelDetailed(series.firstNovelId)).body
                            if (novel.tags.length === 0) {
                                novel.tags = firstNovel.tags.tags.map(item => item.tag)
                            }

                            if (novel.description === "") {
                                novel.description = firstNovel.description
                            }
                        }
                        novel.tags.unshift("长篇")
                        break
                    } catch (e) {
                        java.log(e)
                    }
                }
            }
        }
    })
    return novels
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
        return util.formatNovels(handNovels(util.combineNovels(list)))
    }
}

// 收藏小说
function handlerBookMarks() {
    return () => {
        let resp = JSON.parse(result).body.works
        if (resp === undefined || resp.length === 0) {
            //流程无法本环节中止 只能交给下一流程处理
            return []
        }
        return util.formatNovels(handNovels(resp))
    }
}

//关注作者，近期小说
function handlerFollowLatest() {
    return () => {
        let resp = JSON.parse(result)
        return util.formatNovels(handNovels(util.combineNovels(resp.body.thumbnails.novel)))
    }
}

// 追更列表
function handlerWatchList(){
    return () => {
        let resp = JSON.parse(result)
        let novels = []
        let seriesList = resp.body.thumbnails.novelSeries
        for (let i in seriesList) {
            let novelId = seriesList[i].latestEpisodeId  // 使用最后一篇小说，重新请求并合并小说
            let resp = util.getAjaxJson(util.urlNovelDetailed(novelId))
            if (resp.error !== true) {
                novels.push(resp.body.userNovels[`${novelId}`])
            } else {
                java.log(JSON.stringify(resp))
            }
        }
        return util.formatNovels(handNovels(util.combineNovels(novels)))
    }
}

(() => {
    return handlerFactory()()
})()