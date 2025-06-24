@js:
var util = objParse(String(java.get("util")))

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (typeof v == "string" && v.match("()")) {
            return eval(`(${v})`)
        }
        return v;
    })
}

var first = true;
// 存储seriesID
var seriesSet = {
    keywords: "Pixiv:Search",
    has: (value) => {
        let page = Number(java.get("page"))
        if (page === 1 && first) {
            first = false
            cache.deleteMemory(this.keywords)
            return false
        }

        let v = cache.getFromMemory(this.keywords)
        if (v === undefined || v === null) {
            return false
        }
        let set = new Set(JSON.parse(v))
        return set.has(value)
    },

    add: (value) => {
        let v = cache.getFromMemory(this.keywords)
        if (v === undefined || v === null) {
            cache.putMemory(this.keywords, JSON.stringify([value]))

        } else {
            let arr = JSON.parse(v)
            if (typeof arr === "string") {
                arr = Array(arr)
            }
            arr.push(value)
            cache.putMemory(this.keywords, JSON.stringify(arr))
        }
    },
};

function getUserNovels() {
    if (!util.isLogin()) {
        sleepToast("⚠️ 当前未登录账号\n\n请登录 Pixiv 账号", 1.5)
        util.removeCookie(); util.login()
        sleepToast("登录成功后，请重新搜索", 2)
        return []
    }

    let uidList = [], novels = []
    let username = String(java.get("keyword"))
    let page = Number(java.get("page"))

    let userid = cache.get(username)
    if (userid !== undefined && userid !== null) {
        uidList = [userid]
        java.log(`缓存作者ID：${userid}`)
    } else {
        html = java.ajax(urlSearchUser(username))
        // java.log(html)
        // 仅匹配有投稿作品的用户
        let match = html.match(new RegExp(`"userIds":\\[(?:(?:\\d+,?)+)]`))
        // java.log(JSON.stringify(match))
        if (match === null || match.length === 0) {
            return []
        }

        match = JSON.stringify(match).replace("\\","").split(",")
        // java.log(JSON.stringify(match))
        let regNumber = new RegExp("\\d+")
        uidList = match.map(v => {
            return v.match(regNumber)[0]
        })
        java.log(JSON.stringify(uidList))
    }

    let tempUids = []
    for (let i in uidList) {
        let uid = uidList[i]
        let resp = getAjaxJson(urlUserAllWorks(uid), true)
        // java.log(urlUserAllWorks(id))
        // java.log(JSON.stringify(resp))
        if (resp.error === true) {
            return []
        }

        // 仅获取前3个有小说的作者
        let novelIds = Object.keys(resp.body.novels)
        // java.log(`${uid}-${novelIds.length}`)
        if (novelIds.length >= 1) tempUids.push(uid)
        if (tempUids.length === 3) {
            java.log(`作者ID：${JSON.stringify(tempUids)}`)
            break
        }

        // 获取系列小说，与 util.handnovels 系列详情兼容
        let seriesIds = []
        if (resp.body.novelSeries.length >= 1) {
            resp.body.novelSeries.forEach(novel =>{
                seriesIds.push(novel.id)
                novel.textCount = novel.publishedTotalCharacterCount
                novel.description = novel.caption
            })
            novels = novels.concat(resp.body.novelSeries)
        }

        // 获取所有系列内部的小说 ID
        let seriesNovelIds = []
        seriesIds.forEach(seriesId => {
            let returnList = getAjaxJson(urlSeriesNovelsTitles(seriesId)).body
            returnList.map(novel => {return seriesNovelIds.push(novel.id)})
        })
        // java.log(`有系列的小说ID：${JSON.stringify(seriesNovelIds)}`)
        // java.log(JSON.stringify(seriesNovelIds.length))

        // 获取单篇小说
        if (novelIds.length >= 1 && util.settings.IS_LEGADO) {
            novelIds = novelIds.filter(novelid => (!seriesNovelIds.includes(novelid)))
            novelIds = novelIds.reverse().slice((page - 1) * 20, page * 20)
            // java.log(`真单篇的小说ID：${JSON.stringify(novelIds)}`)
            // java.log(JSON.stringify(novelIds.length))
            let novelUrls = novelIds.map(novelId => {return urlNovelDetailed(novelId)})
            // java.log(JSON.stringify(novelUrls))
            // cache.delete(novelUrls)
            novels = novels.concat(getAjaxAllJson(novelUrls).map(resp => resp.body))
        }

        // // 获取单篇小说
        if (novelIds.length >= 1 && util.settings.IS_SOURCE_READ) {
            novelIds = novelIds.filter(novelid => (!seriesNovelIds.includes(novelid)))
            // java.log(`真单篇的小说ID：${JSON.stringify(novelIds)}`)
            // java.log(JSON.stringify(novelIds.length))
            novelIds = novelIds.reverse().slice((page - 1) * 20, page * 20)
            novelIds.forEach(novelId => {
                // java.log(urlNovelDetailed(novelId))
                let res = getAjaxJson(urlNovelDetailed(novelId))
                if (res.error !== true) {
                    novels.push(res.body)
                } else {
                    java.log(JSON.stringify(res))
                }
            })
        }
    }
    
    util.debugFunc(() => {
        java.log(`获取用户搜索小说结束`)
    })
    return novels
}

function search(name, type, page) {
    let resp = {}
    if (type.includes("novel")) {
        resp = getAjaxJson(urlSearchNovel(name, page))
        java.log(urlSearchNovel(name, page))
    }
    if (type.includes("series")) {
        resp = getAjaxJson(urlSearchSeries(name, page))
        java.log(urlSearchSeries(name, page))
    }
    if (resp.error === true || resp.total === 0) {
        return {"data": [], "lastPage": 0}
    }
    return resp.body.novel
}

function getSeries() {
    if (JSON.parse(result).error !== true) {
        cache.put(urlSearchSeries(java.get("keyword"), java.get("page")), result, cacheSaveSeconds)  // 加入缓存
        return JSON.parse(result).body.novel.data
    } else {
        return []
    }
}

function getNovels() {
    let MAXPAGES = 1, novels = []
    let novelName = String(java.get("keyword"))
    let resp = search(novelName, "novel", 1)
    novels = novels.concat(resp.data)
    for (let page = Number(java.get("page")) + 1; page < resp.lastPage, page <= MAXPAGES; page++) {
        novels = novels.concat(search(novelName,"novel", page).data)
    }
    return util.combineNovels(novels)
}

function getConvertNovels() {
    let novels = []
    let novelName = String(java.get("keyword"))
    let name1 = String(java.s2t(novelName))
    let name2 = String(java.t2s(novelName))
    if (name1 !== novelName) novels = novels.concat(search(name1, "novel", 1).data)
    if (name2 !== novelName) novels = novels.concat(search(name2, "novel", 1).data)
    novels = util.combineNovels(novels)
    if (name1 !== novelName) novels = novels.concat(search(name1, "series", 1).data)
    if (name2 !== novelName) novels = novels.concat(search(name2, "series", 1).data)
    return novels
}

function novelFilter(novels) {
    let limitedTextCount = String(java.get("limitedTextCount")).replace("字数", "").replace("字數", "")
    // limitedTextCount = `3w 3k 3w5 3k5`.[0]
    let textCount = 0
    if (limitedTextCount.includes("w")) {
        let num = limitedTextCount.split("w")
        textCount = 10000 * num[0] + 1000 * num[1]
    }
    else if (limitedTextCount.includes("W")) {
        let num = limitedTextCount.split("W")
        textCount = 10000 * num[0] + 1000 * num[1]
    }

    if (limitedTextCount.includes("k")) {
        let num = limitedTextCount.split("k")
        textCount = 1000 * num[0] + 100 * num[1]
    }
    else if (limitedTextCount.includes("K")) {
        let num = limitedTextCount.split("K")
        textCount = 1000 * num[0] + 100 * num[1]
    }

    let novels0 = novels.map(novel => novel.id)
    novels = novels.filter(novel => novel.textCount >= textCount)
    let novels1 = novels.map(novel => novel.id)
    if (textCount >= 1) {
        java.log(`🔢 字数限制：${limitedTextCount}`)
        java.log(`⏬ 字数限制：过滤前${novels0.length}；过滤后${novels1.length}`)
    }
    return novels
}

(() => {
    let novels = []
    let keyword = String(java.get("keyword"))
    if (keyword.startsWith("@") || keyword.startsWith("＠")) {
        keyword = keyword.slice(1)
        java.put("keyword", keyword)
        novels = novels.concat(getUserNovels())
    } else if (keyword.startsWith("#") || keyword.startsWith("＃")) {
        keyword = keyword.slice(1)
        java.put("keyword", keyword)
        novels = novels.concat(getNovels())
        novels = novels.concat(getSeries())
    } else {
        novels = novels.concat(getNovels())
        novels = novels.concat(getSeries())
        if (!util.settings.FAST) novels = novels.concat(getUserNovels())
        if (util.settings.CONVERT_CHINESE) novels = novels.concat(getConvertNovels())
    }
    // java.log(JSON.stringify(novels))
    // 返回空列表中止流程
    if (novels.length === 0) {
        return []
    }
    return novelFilter(util.formatNovels(util.handNovels(novels)))
})()