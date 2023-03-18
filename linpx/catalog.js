@js:
(function (res) {
    res = JSON.parse(res)
    let cache = function () {
        if (baseUrl.includes("/cache")) {
            return "/cache"
        }
        return ""
    }()

    if (res.novels !== undefined) {
        res.novels.forEach(v => {
            v['url'] = `https://linpxapi.linpicio.com/pixiv/novel/${v.id}${cache}`
        })
        return res.novels
    }
    return [{
        id: res.id,
        title: res.title
    }]
})(result)
