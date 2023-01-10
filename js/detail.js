@js:
function cacheGetAndSet(key, supplyFunc) {
    let v = cache.get(key)
    if (v === undefined || v === null) {
        v = JSON.stringify(supplyFunc())
        // 缓存10分钟
        cache.put(key, v, 600)
    }
    return JSON.parse(v)
}

function getAjaxJson(url) {
    return cacheGetAndSet(url, () => {
        return JSON.parse(java.ajax(url))
    })
}

function findUser(userId) {
    return getAjaxJson(`https://linpxapi.linpicio.com/pixiv/user/${userId}`)
}

function findSeriesId(userInfo, seriesTitle) {
    userInfo = JSON.parse(userInfo)
    let id = 0
    userInfo.series.forEach(series => {
        if (series.title === seriesTitle) {
            id = series.id
        }
    })
    return id
}

(function (res) {
    res = JSON.parse(res)
    let prop = {}
    prop['author'] = res.userName
    prop['count'] = book.wordCount
    prop['desc'] = res.desc
    prop['cover_url'] = `https://linpxapi.linpicio.com/proxy/pximg?url= ${res.coverUrl}`

    if (res.series === undefined || res.series === null) {
        prop['name'] = res.title
        prop['catalog'] = `https://linpxapi.linpicio.com/pixiv/novel/${res.id}`
        res.tags.unshift('单本')
    } else {
        prop['name'] = res.series.title
        res.tags.unshift('长篇')
        //查询用户
        let userInfo = findUser(res.userId)
        prop['catalog'] = `https://linpxapi.linpicio.com/pixiv/series/${findSeriesId(userInfo, res.series.title)}`
    }
    if (res.tags !== undefined) {
        prop['classes'] = res.tags.join(",")
    }
    return prop

})(result)