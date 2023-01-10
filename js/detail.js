@js:
var userMap = new Map();
var ajaxCount = 0;

(function (res) {
    function findUser(userId) {
        let obj = userMap.get(userId);
        if (obj === undefined || obj === null) {
            obj = java.ajax(`https://linpxapi.linpicio.com/pixiv/user/${userId}`)
            ajaxCount++
            userMap.set(userId, JSON.parse(obj))
        }
        return obj
    }

    function findSeriesId(userInfo, seriesTitle) {
        userInfo = JSON.parse(userInfo)
        let id = 0
        userInfo.series.forEach((series, i) => {
            if (series.title === seriesTitle) {
                id = series.id
            }
        })
        return id
    }


    res = JSON.parse(res)
    let prop = {}
    prop['author'] = res.userName
    prop['count'] = book.wordCount
    prop['desc'] = res.desc
    prop['cover_url'] = `https://linpxapi.linpicio.com/proxy/pximg?url= ${res.coverUrl}`

    if (res.series == null) {
        prop['name'] = res.title
        prop['catalog'] = `https://linpxapi.linpicio.com/pixiv/novel/${res.id}`
        prop['classes'] = '单本,'
    } else {
        prop['name'] = res.series.title
        prop['classes'] = '长篇,'
        //查询用户
        let userInfo = findUser(res.userId)
        prop['catalog'] = `https://linpxapi.linpicio.com/pixiv/series/${findSeriesId(userInfo, res.series.title)}`
    }
    if (res.tags !== undefined) {
        prop['classes'] += res.tags.join(",")
    }
    return prop

})(result)