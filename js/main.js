@js:
// 发送两个请求 一个去查user一个去查serach
// String类型：key
function getUser(username, exactMatch) {
    // 修复传入object的bug
    username = String(username)
    let resp = JSON.parse(java.ajax(`https://linpxapi.linpicio.com/pixiv/search/user/${username}`))
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

// 包含所有小说数据
function getUserDetailedList(uidList) {
    java.log(`UIDLIST:${JSON.stringify(uidList)}`)
    let url = `https://linpxapi.linpicio.com/pixiv/users?${uidList.map(v => "ids[]=" + v).join("&")}`
    let html = java.webView(null, url, null)
    return JSON.parse((html.match(new RegExp(">\\[\\{.*?}]<"))[0].replace(">", "").replace("<", "")))
}

function getNovels(nidList) {
    //todo 简单的限制
    if (nidList.length > 30) {
        nidList.length = 30
    }

    java.log(`NIDLIST:${JSON.stringify(nidList)}`)
    let url = `https://linpxapi.linpicio.com/pixiv/novels?${nidList.map(v => "ids[]=" + v).join("&")}`
    java.log(`请求地址:${url}`)
    let html = java.webView(null, url, null)
    return JSON.parse(html.match(new RegExp(">\\[\\{.*?}]<"))[0].replace(">", "").replace("<", ""))
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
function parseNovels(novels) {
    novels.forEach(novel => {
        novel.coverUrl = `https://linpxapi.linpicio.com/proxy/pximg?url=${novel.coverUrl}`
        novel.detailedUrl = `https://linpxapi.linpicio.com/pixiv/novel/${novel.id}/cache`
        novel.tags = novel.tags.join(",")
    })
    return novels
}


(function (res) {
    res = JSON.parse(res)
    let novels = res.novels

    // 查询用户
    let userArr = getUser(java.get("key"), true)
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
            novels.push(novel)
        })
    }


    return parseNovels(combineNovels(novels))

}(result))