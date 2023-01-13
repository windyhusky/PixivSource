@js:
(function (res) {
    res = JSON.parse(res)
    if (res.total === 0){
        return []
    }

    let prop = {}
    prop['author'] = book.author
    prop['count'] = book.wordCount
    prop['desc'] = book.intro
    prop['cover_url'] = book.coverUrl

    if (res.series === undefined || res.series === null) {
        prop['name'] = res.title
        prop['catalog'] = `https://linpxapi.linpicio.com/pixiv/novel/${res.id}`
        res.tags.unshift('单本')
    } else {
        prop['name'] = res.series.title
        res.tags.unshift('长篇')
        prop['catalog'] = `https://linpxapi.linpicio.com/pixiv/series/${res.series.id}`
    }
    prop['classes'] = res.tags.join(",")
    return prop
})(result)