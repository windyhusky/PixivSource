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
    if (!isLogin()) {
        return []
    }

    let uidList = [] ,novels = []
    let username = String(java.get("keyword"))
    let page = Number(java.get("page"))

    let userid = cache.get(username)
    if (userid !== undefined && userid !== null) {
        uidList = [userid]
        java.log(`缓存作者ID：${userid}`)
    }
    else {
        let html = java.get(username)
        if (html === undefined || html === null) {
            html = java.ajax(urlSearchUser(username))
            cache.put(username, html)
        }
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

        // 仅限3个作者
        java.log(JSON.stringify(uidList))
        if (uidList.length >= 3) {
            uidList.length = 3
        }
    }

    uidList.forEach(id => {
        // 获取系列小说
        let resp = getAjaxJson(urlUserAllWorks(id))
        // java.log(urlUserAllWorks(id))
        if (resp.error === true) {
            return []
        }
        // resp.body.novelSeries.forEach(novel =>{
        //     novel.isOneshot = false
        //     novel.createDate = novel.createDateTime
        //     novel.updateDate = novel.updateDateTime
        // })
        // novels = novels.concat(resp.body.novelSeries)

        // 获取单篇小说
        let novelsId = Object.keys(resp.body.novels).reverse().slice((page - 1) * 20, page * 20)
        let url = urlNovelsDetailed(id, novelsId)
        util.debugFunc(() => {
            java.log(`发送获取作者小说的Ajax请求:${url}`)
        })
        let userNovels = getWebviewJson(url, html => {
            return (html.match(new RegExp(">\\{.*?}<"))[0].replace(">", "").replace("<", ""))
        }).body
        // let userNovels = getAjaxJson(url).body
        // 获取对应的小说 该序列是按照id排序
        // 反转以按照更新时间排序
        novels = novels.concat(Object.values(userNovels).reverse())
    })

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
        cache.put(urlSearchSeries(java.get("keyword"), java.get("page")), result, 30*60)  // 加入缓存
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
    return novels
}

function getConvertNovels() {
    let novels = []
    let novelName = String(java.get("keyword"))
    let name1 = String(java.s2t(novelName))
    let name2 = String(java.t2s(novelName))
    if (name1 !== novelName) novels = novels.concat(search(name1, "series", 1).data)
    if (name2 !== novelName) novels = novels.concat(search(name2, "series", 1).data)
    if (name1 !== novelName) novels = novels.concat(search(name1, "novel", 1).data)
    if (name2 !== novelName) novels = novels.concat(search(name2, "novel", 1).data)
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
    if (limitedTextCount.includes("k")) {
        let num = limitedTextCount.split("k")
        textCount = 1000 * num[0] + 100 * num[1]
    }
    java.log(`字数限制：${limitedTextCount}`)
    java.log(`字数限制：${textCount}`)
    return novels.filter(novel => novel.textCount >= textCount)
}

(() => {
    let novels = []
    let keyword = String(java.get("keyword"))
    if (keyword.startsWith("@") || keyword.startsWith("＠")) {
        keyword = keyword.slice(1)
        java.log(`搜索作者：${keyword}`)
        java.put("keyword", keyword)
        novels = novels.concat(getUserNovels())
    } else {
        novels = novels.concat(getNovels())
        novels = novels.concat(getSeries())
        novels = novels.concat(getUserNovels())
        if (util.CONVERT_CHINESE_CHARACTERS) novels = novels.concat(getConvertNovels())
    }
    // java.log(JSON.stringify(novels))
    // 返回空列表中止流程
    if (novels.length === 0) {
        return []
    }
    return novelFilter(util.formatNovels(util.handNovels(novels)))
})()