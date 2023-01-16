@js:

// 存储seriesID 有BUG无法处理翻页
var seriesSet = new Set();

function urlCoverUrl(url) {
    return `${url},{"headers": {"Referer":"https://www.pixiv.net/"}}`
}

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

function getAjaxJson(url) {
    return cacheGetAndSet(url, () => {
        return JSON.parse(java.ajax(url))
    })
}

function urlNovelDetailed(nid) {
    return `https://www.pixiv.net/ajax/novel/${nid}`
}

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

function cacheGetAndSet(key, supplyFunc) {
    let v = cache.get(key)
    if (v === undefined || v === null) {
        v = JSON.stringify(supplyFunc())
        cache.put(key, v, 600)
    }
    return JSON.parse(v)
}

function urlNovelBookMarks(uid, offset) {
    return `https://www.pixiv.net/ajax/user/${uid}/novels/bookmarks?tag=&offset=${offset}&limit=24&rest=show&lang=zh`
}

function handlerFactory() {
    let cookie = String(java.getCookie("https://www.pixiv.net/", null))
    if (cookie === null || cookie === undefined || cookie === "") {
        return handlerNoLogin()
    }
    if (baseUrl.indexOf("bookmark") !== -1) {
        return handlerBookMarks()
    } else {
        return handlerRecommend()
    }
}

function handlerRecommend() {
    return () => {
        // java.log(result)
        let res = JSON.parse(result)
        // return b.score - a.score
        const recommend = res.body.page.recommend
        const novels = res.body.thumbnails.novel
        let nidSet = new Set(recommend.ids)
        // java.log(nidSet.size)

        let list = novels.filter(novel => {
            return nidSet.has(String(novel.id))
        })
        // java.log(`过滤结果:${JSON.stringify(list)}`)

        let r = formatNovels(handNovels(combineNovels(list)))
        // java.log(`返回结果:${JSON.stringify(r)}`)
        return r
    }
}

function handlerNoLogin() {
    return () => {
        java.longToast("此功能需要在书源登录后才能使用")
        return []
    }
}


function handlerBookMarks() {
    return () => {
        let content = result.match(new RegExp('users/\\d+'))[0]
        let uid = content.replace("users/", "")
        let page = Number(java.get("page"))
        if (page !== 0) {
            page -= 1
        }

        let url = urlNovelBookMarks(uid, Number(page * 24))
        // java.log(`发送的收藏请求:${url}`)
        let resp = getAjaxJson(url).body.works
        if (resp === undefined || resp.length === 0) {
            //流程无法本环节中止 只能交给下一流程处理
            return []
        }

        return formatNovels(handNovels(resp))
    }
}

(() => {
    return handlerFactory()()
})()