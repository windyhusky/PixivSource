@js:

function urlSeries(seriesId) {
    return `https://linpxapi.linpicio.com/pixiv/series/${seriesId}`
}

function urlNovelsDetailed(nidList) {
    return `https://linpxapi.linpicio.com/pixiv/novels?${nidList.map(v => "ids[]=" + v).join("&")}`
}

function getAjaxJson(url) {
    return cacheGetAndSet(url, () => {
        return JSON.parse(java.ajax(url))
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
function formatNovels(novels) {
    novels.forEach(novel => {
        novel.detailedUrl = `https://linpxapi.linpicio.com/pixiv/novel/${novel.id}`
        if (novel.seriesId !== undefined && novel.seriesId !== null) {
            novel.title = novel.seriesTitle
            //todo 长篇的字数需要统计 先不做
            novel.length = null

            let series = getAjaxJson(urlSeries(novel.seriesId))
            // novel.coverUrl = `https://linpxapi.linpicio.com/proxy/pximg?url=${series.imageUrl}`
            // 后端目前没有系列的coverUrl字段
            // todo 先这样使用
            novel.coverUrl = `https://linpxapi.linpicio.com/proxy/pximg?url=${series.novels[0].coverUrl}`
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
            novel.coverUrl = `https://linpxapi.linpicio.com/proxy/pximg?url=${novel.coverUrl}`
        }

        novel.tags = novel.tags.join(",")
    })
    return novels
}


(function (res) {
    return formatNovels(combineNovels(JSON.parse(res)))
}(result))