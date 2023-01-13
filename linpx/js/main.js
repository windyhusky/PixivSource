@js:

function urlSearchUsers(username) {
    return `https://linpxapi.linpicio.com/pixiv/search/user/${username}`
}

function urlUserDetailed(uidList) {
    return `https://linpxapi.linpicio.com/pixiv/users?${uidList.map(v => "ids[]=" + v).join("&")}`
}

function urlNovelsDetailed(nidList) {
    return `https://linpxapi.linpicio.com/pixiv/novels?${nidList.map(v => "ids[]=" + v).join("&")}`
}

function urlSeries(seriesId) {
    return `https://linpxapi.linpicio.com/pixiv/series/${seriesId}`
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


function getUser(username, exactMatch) {
    // 修复传入object的bug
    username = String(username)
    let resp = getAjaxJson(urlSearchUsers(username))
    if (resp.users.length === 0) {
        return []
    }
    if (!exactMatch) {
        return resp.users
    }
    // 只返回用户名完全一样的用户
    return resp.users.filter(user => {
        if (user.name === username) {
            return true
        }
    })
}

function getAjaxJson(url) {
    return cacheGetAndSet(url, () => {
        return JSON.parse(java.ajax(url))
    })
}

function getWebviewJson(url) {
    return cacheGetAndSet(url, () => {
        let html = java.webView(null, url, null)
        return JSON.parse((html.match(new RegExp(">\\[\\{.*?}]<"))[0].replace(">", "").replace("<", "")))
    })
}

// 包含所有小说数据
function getUserDetailedList(uidList) {
    // java.log(`UIDLIST:${JSON.stringify(uidList)}`)
    return getWebviewJson(urlUserDetailed(uidList))
}

function getNovels(nidList) {
    let page = Number(java.get("page"))
    // 分页
    let list = nidList.slice((page - 1) * 20, page * 20)
    if (list.length === 0) {
        return []
    }

    // java.log(`NIDURL:${urlNovelsDetailed(list)}`)
    return getWebviewJson(urlNovelsDetailed(list))
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

function findUserNovels(username) {
    let novelList = []
    // 查询用户
    let userArr = getUser(username, true)
    // 获取用户所有小说
    let uidList = userArr.filter(user => {
        return user.novels.length > 0
    }).map(user => user.id)

    if (uidList.length > 0) {
        let list = getUserDetailedList(uidList)
        let nidList = []
        // 从两层数组中提取novelsId
        list.forEach(user => {
            user.novels.forEach(nid => nidList.push(nid))
        })
        getNovels(nidList).forEach(novel => {
            novelList.push(novel)
        })
    }
    return novelList
}

(function (res) {
    res = JSON.parse(res)
    let novels = res.novels
    // 如果搜索不了结果
    if (novels.length === 0) {
        return []
    }

    findUserNovels(java.get("key")).forEach(v => {
        novels.push(v)
    })
    return formatNovels(combineNovels(novels))
}(result))