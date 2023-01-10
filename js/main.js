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
    // java.log(`NIDLIST:${JSON.stringify(nidList)}`)
    // 分页
    let list = nidList.slice((page - 1) * 20, page * 20)
    if (list.length === 0) {
        return []
    }

    return getWebviewJson(urlNovelsDetailed(list))
}

// 将多个长篇小说解析为一本书
function combineNovels(novels) {
    let newNovels = []
    // key为seriesId value为novel
    let seriesMap = new Map()
    novels.forEach(novel => {
        // 视为真正的一本书
        if (novel.seriesId !== undefined && novel.seriesTitle !== undefined) {
            let v = seriesMap.get(novel.seriesId);
            if (v === undefined || v === null) {
                seriesMap.set(novel.seriesId, novel)
                newNovels.push(novel)
            }
        } else {
            // 短篇小说
            newNovels.push(novel)
        }
    })
    return newNovels
}

// 将小说的封面规则与详情地址替换
function formatNovels(novels) {
    // java.log("入参" + JSON.stringify(novels))
    novels.forEach(novel => {
        novel.coverUrl = `https://linpxapi.linpicio.com/proxy/pximg?url=${novel.coverUrl}`
        novel.detailedUrl = `https://linpxapi.linpicio.com/pixiv/novel/${novel.id}`
        if (novel.seriesId !== undefined && novel.seriesId !== null) {
            novel.tags.unshift("长篇")
        } else {
            novel.tags.unshift("单本")
        }

        novel.tags = novel.tags.join(",")
    })
    // java.log("出参" + JSON.stringify(novels))
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
    findUserNovels(java.get("key")).forEach(v => {
        novels.push(v)
    })
    return formatNovels(combineNovels(novels))
}(result))