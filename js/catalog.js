@js:
(function (res) {
    res = JSON.parse(res)
    if (res.novels !== undefined) {
        res.novels.forEach(v => {
            v['url'] = `https://linpxapi.linpicio.com/pixiv/novel/${v.id}`
        })
        return res.novels
    }
    return [{
        id: res.id,
        title: res.title
    }]
})(result)