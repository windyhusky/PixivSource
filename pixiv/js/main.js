@js:
var util = {}

function isDebugMode() {
    java.log("源变量:" + source.getVariable())
    return String(source.getVariable()) === "debug"
}

function debugFunc(func) {
    if (isDebugMode()) {
        func()
    }
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

function urlSeriesCatalog(seriesId) {
    return `https://www.pixiv.net/ajax/novel/series/${seriesId}?lang=zh`
}

function urlSeriesDetailed(seriesId) {
    return `https://www.pixiv.net/ajax/novel/series_content/${seriesId}?limit=10&last_order=0&order_by=asc&lang=zh`
}

function urlUserInfo(uid) {
    return `https://www.pixiv.net/ajax/user/${uid}`
}

function urlUserAllWorks(uid) {
    return `https://www.pixiv.net/ajax/user/${uid}/profile/all?lang=zh`
}

function urlUserNovels(uid, nidList) {
    return `https://www.pixiv.net/ajax/user/273832/profile/novels?ids%5B%5D=19026640`
}

// 完全匹配用户名
function urlSearchUser(username) {
    return `https://www.pixiv.net/search_user.php?s_mode=s_usr&nick=${encodeURI(username)}&nick_mf=1`
}

function urlNovelDetailed(nid) {
    return `https://www.pixiv.net/ajax/novel/${nid}`
}

function urlCoverUrl(url) {
    return `${url},{"headers": {"Referer":"https://www.pixiv.net/"}}`
}

function getAjaxJson(url) {
    debugFunc(() => {
        java.log(`Ajax请求:${url}`)
    })
    return cacheGetAndSet(url, () => {
        return JSON.parse(java.ajax(url))
    })
}

// 存储seriesID
var seriesSet = new Set();

// 将多个长篇小说解析为一本书
function combineNovels(novels) {
    return novels.filter(novel => {
        //单本直接解析为一本书
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

//处理novels列表
//查询作者
function handNovels(novels) {
    novels.forEach(novel => {
        if (novel.tags === undefined || novel.tags === null) {
            novel.tags = []
        }

        if (novel.seriesId === undefined || novel.seriesId === null) {
            novel.tags.unshift("单本")
        } else {
            novel.tags.unshift("长篇")
            // todo 暂时不做字数统计
            novel.textCount = null
        }
    })
    return novels
}

function formatNovels(novels) {
    novels.forEach(novel => {
        novel.detailedUrl = urlNovelDetailed(novel.id)
        novel.tags = novel.tags.join(",")
        novel.coverUrl = urlCoverUrl(novel.url)
    })
    return novels
}

// 暂时不做
function getUserNovels(username) {
    return []
}

// 存储函数方便其他页面调用
function init() {
    let u = {}
    u.cacheGetAndSet = (key, supplyFunc) => {
        let v = cache.get(key)
        if (v === undefined || v === null) {
            v = JSON.stringify(supplyFunc())
            // 缓存10分钟
            cache.put(key, v, 600)
        }
        return JSON.parse(v)
    }

    u.getAjaxJson = (url) => {
        debugFunc(() => {
            java.log(`Ajax请求:${url}`)
        })
        return u.cacheGetAndSet(url, () => {
            return JSON.parse(java.ajax(url))
        })
    }

    u.isDebugMode = () => {
        java.log("源变量:" + source.getVariable())
        return String(source.getVariable()) === "debug"
    }

    u.debugFunc = (func) => {
        if (u.isDebugMode()) {
            func()
        }
    }
    util = u
    java.put("util", JSON.stringify(u))
}

(() => {
    init()
    //作者 TAG 书名都要支持
    // java.log(String(java.get("key")))
    let resp = JSON.parse(result);
    let novelsList = getUserNovels(String(java.get("key")))
    novelsList = novelsList.concat(resp.body.novel.data)
    return formatNovels(handNovels(combineNovels(novelsList)))
})();