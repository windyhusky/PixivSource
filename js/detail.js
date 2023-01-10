@js:
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
        prop['catalog'] = `https://linpxapi.linpicio.com/pixiv/series/${res.series.id}`
    }
    prop['classes'] = res.tags.join(",")
    return prop
})(result)