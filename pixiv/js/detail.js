@js:

var util = {}

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
    u.debugFunc = (func) => {
        if (String(source.getVariable()) === "debug") {
            func()
        }
    }

    u.urlNovelDetailed = (nid) => {
        return `https://www.pixiv.net/ajax/novel/${nid}`
    }
    u.urlSeries = (seriesId) => {
        return `https://www.pixiv.net/ajax/novel/series/${seriesId}?lang=zh`
    }
    u.urlSeriesNovels = (seriesId, limit, offset) => {
        if (limit > 30) {
            limit = 30
        }

        if (limit < 10) {
            limit = 10
        }

        return `https://www.pixiv.net/ajax/novel/series_content/${seriesId}?limit=${limit}&last_order=${offset}&order_by=asc&lang=zh`
    }
    util = u
    java.put("util", objStringify(u))
}

function objStringify(obj) {
    return JSON.stringify(obj, (n, v) => {
        if (typeof v == "function")
            return v.toString();
        return v;
    });
}

(() => {
    init()
    // java.log(`详情信息:${result}`)
    let res = JSON.parse(result).body
    info = {}
    info.author = book.author
    info.name = book.name
    info.tags = book.kind
    info.wordCount = book.wordCount
    info.latestChapter = null
    info.desc = book.intro
    info.coverUrl = book.coverUrl
    info.catalogUrl = util.urlNovelDetailed(res.id)
    return info
})();