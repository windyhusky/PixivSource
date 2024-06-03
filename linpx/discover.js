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

function urlSearchUsers(username) {
    return `https://api.furrynovel.ink/pixiv/search/user/${username}`
}

function urlSeries(seriesId) {
    return `https://api.furrynovel.ink/pixiv/series/${seriesId}`
}

function urlNovelsDetailed(nidList) {
    return `https://api.furrynovel.ink/pixiv/novels?${nidList.map(v => "ids=" + v).join("&")}`
}

function urlUserDetailed(uidList) {
    return `https://api.furrynovel.ink/pixiv/users?${uidList.map(v => "ids=" + v).join("&")}`
}

function getAjaxJson(url) {
    return cacheGetAndSet(url, () => {
        // java.log(`url:${url}`)
        return JSON.parse(java.ajax(url))
    })
}

function getWebviewJson(url) {
    return cacheGetAndSet(url, () => {
        java.log(`url:${url}`)
        let html = java.webView(null, url, null)
        // java.log(`返回的html:${html}`)
        return JSON.parse((html.match(new RegExp(">\\[\\{.*?}]<"))[0].replace(">", "").replace("<", "")))
    })
}

function cacheGetAndSet(key, supplyFunc) {
    let v = cache.get(key)
    if (v === undefined || v === null) {
        v = JSON.stringify(supplyFunc())
        // 缓存10分钟
        cache.put(key, v, 600)
    }
    return JSON.parse(v)
}

// 存储seriesID
var seriesSet = new Set();

// 将多个长篇小说解析为一本书
function combineNovels(novels) {
    return novels.filter(novel => {
        //单本直接解析为一本书
        //需要判断是否为null
        if (novel.seriesId === undefined || novel.seriesId === null) {
            return true
        }

        //集合中没有该系列解析为一本书
        if (!seriesSet.has(novel.seriesId)) {
            seriesSet.add(novel.seriesId)
            return true
        }

        return false
    })
}

// 将小说的封面规则与详情地址替换
function handlerNovels(novels) {
    novels.forEach(novel => {
        novel.detailedUrl = `https://api.furrynovel.ink/pixiv/novel/${novel.id}`
        if (novel.seriesId !== undefined && novel.seriesId !== null) {
            novel.title = novel.seriesTitle
            novel.length = null

            java.log(`正在获取系列小说：${novel.seriesId}`)
            let series = getAjaxJson(urlSeries(novel.seriesId))
            // 后端目前没有系列的coverUrl字段
            // novel.coverUrl = `https://api.furrynovel.ink/proxy/pximg?url=${series.imageUrl}`
            // novel.coverUrl = `https://api.furrynovel.ink/proxy/pximg?url=${series.novels[0].coverUrl}`
            novel.coverUrl = util.urlCoverUrl(series.novels[0].coverUrl)

            if (series.caption === "") {
                let firstNovels = getAjaxJson(urlNovelsDetailed([series.novels[0].id]))
                if (firstNovels.length > 0) {
                    novel.desc = firstNovels[0].desc
                } else {
                    novel.desc = "该小说可能部分章节因为权限或者被删除无法查看"
                }
            } else {
                novel.desc = series.caption
            }

            //如果没有标签 取第一章的tag
            if (series.tags.length === 0) {
                // 系列至少会有一章
                novel.tags = series.novels[0].tags
            } else {
                novel.tags = series.tags
            }

            if (novel.tags === undefined) {
                novel.tags = []
            }
            novel.tags.unshift("长篇")


        } else {
            novel.tags.unshift("单本")
            // novel.coverUrl = `https://api.furrynovel.ink/proxy/pximg?url=${novel.coverUrl}`
            novel.coverUrl = util.urlCoverUrl(novel.coverUrl)
        }

        novel.tags = novel.tags.join(",")
    })
    return novels
}

/**
 * @params arr 传入的源数组
 * @params length 需要获取的元素的个数
 */
function randomChoseArrayItem(arr, length) {
    let copyArr = JSON.parse(JSON.stringify(arr))
    let newArr = [];
    for (let i = 0; i < length; i++) {
        let index = Math.floor(Math.random() * copyArr.length);
        let item = copyArr[index];
        newArr.push(item)
        copyArr.splice(index, 1)
    }
    return newArr.reverse()
}


function handlerRecommendUsers() {
    const MAX_FETCH_USER_NUMBER = 2;

    return () => {
        let novelList = []
        let userIds = JSON.parse(result).map(i => i.id)
        // java.log(`用户id个数:${userIds.length}`)
        if (userIds.length > MAX_FETCH_USER_NUMBER) {
            userIds = randomChoseArrayItem(userIds, MAX_FETCH_USER_NUMBER);
        }

        // java.log(`查询的用户Ids:${userIds}`)

        let usersInfo = getWebviewJson(urlUserDetailed(userIds))
        // java.log(`返回的${JSON.stringify(usersInfo)}`)
        let queryNovelIds = []
        // java.log(`${JSON.stringify(usersInfo)}`)
        usersInfo.filter(user => user.novels && user.novels.length > 0)
            .map(user => user.novels)
            // 将list展平[1,2,3]变为1,2,3 添加到novelList中
            .forEach(novels => {
                novels.forEach(novel => {
                    queryNovelIds.push(novel)
                })
            })
        // 暂时限制最大获取数量
        if (queryNovelIds.length > 10) {
            queryNovelIds = randomChoseArrayItem(queryNovelIds, 10)
        }
        novelList = getWebviewJson(urlNovelsDetailed(queryNovelIds))
        return handlerNovels(combineNovels(novelList))
    }
}

function handlerFollowLatest() {
    return () => {
        let resp = JSON.parse(result)
        return handlerNovels(combineNovels(resp))
    }
}

function handlerFactory() {
    if (baseUrl.indexOf("/fav/user") !== -1) {
        return handlerRecommendUsers()
    }

    if (baseUrl.indexOf("/pixiv/novels/recent") !== -1) {
        return handlerFollowLatest()
    }

}

(() => {
    return handlerFactory()()
})()
