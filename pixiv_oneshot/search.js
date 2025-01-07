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

// 处理 novels 列表, 查询作者
function handNovels(novels) {
    novels.forEach(novel => {
        if (novel.tags === undefined || novel.tags === null) {
            novel.tags = []
        }
        if (novel.seriesId === undefined || novel.seriesId === null) {
            novel.tags.unshift("单本")
            novel.latestChapter = novel.title
        } else {
            let userAllWorks = util.getAjaxJson(util.urlUserAllWorks(novel.userId)).body
            for (let series of userAllWorks.novelSeries) {
                if (series.id === novel.seriesId) {
                    // let series = util.getAjaxJson(util.urlSeriesDetailed(novel.seriesId)).body
                    novel.textCount = series.textLength
                    novel.url = series.cover.urls["480mw"]
                    novel.title = series.title
                    novel.tags = series.tags
                    novel.description = series.caption

                    // 发送请求获取第一章 获取标签与简介
                    if (novel.tags.length === 0 || novel.description === "") {
                        let firstNovel = util.getAjaxJson(util.urlNovelDetailed(series.firstNovelId)).body
                        if (novel.tags.length === 0) {
                            novel.tags = firstNovel.tags.tags.map(item => item.tag)
                        }

                        if (novel.description === "") {
                            novel.description = firstNovel.description
                        }
                    }

                    novel.tags.unshift("长篇")
                    break
                }
            }
        }
    })
    util.debugFunc(() => {
        java.log(`处理小说完成`)
    })
    return novels
}

function isLogin() {
    let cookie = String(java.getCookie("https://www.pixiv.net/", null))
    return typeof cookie === "string" && cookie !== ""
}

function getUserNovels(username) {
    if (!isLogin()) {
        return []
    }

    let html = java.ajax(util.urlSearchUser(username))
    // java.log(html)
    // 仅匹配有投稿作品的用户
    let match = html.match(new RegExp(`"userIds":\\[(?:(?:\\d+,?)+)]`))
    // ["\"userIds\":[34568581,4569033,3024386]"]
    // java.log(JSON.stringify(match))
    if (match === null || match.length === 0) {
        html = java.ajax(util.urlSearchUserPartial(username))
        match = html.match(new RegExp(`"userIds":\\[(?:(?:\\d+,?)+)]`))
        if (match === null || match.length === 0) {
            return []
        }
    }

    match = JSON.stringify(match).replace("\\","").split(",")
    // java.log(JSON.stringify(match))
    let regNumber = new RegExp("\\d+")
    let uidList = match.map(v => {
        return v.match(regNumber)[0]
    })

    // 仅限3个作者
    java.log(JSON.stringify(uidList))
    if (uidList.length >= 3) {
        uidList.length = 3
    }

    let novels = []
    let page = Number(java.get("page"))

    uidList.forEach(id => {
        let r = util.getAjaxJson(util.urlUserAllWorks(id))
        let novelsId = Object.keys(r.body.novels).reverse().slice((page - 1) * 20, page * 20)
        let url = util.urlNovelsDetailed(id, novelsId)
        util.debugFunc(() => {
            java.log(`发送获取作者小说的Ajax请求:${url}`)
        })
        let userNovels = util.getWebviewJson(url, html => {
            return (html.match(new RegExp(">\\{.*?}<"))[0].replace(">", "").replace("<", ""))
        }).body
        // 获取对应的小说 该序列是按照id排序
        // 反转以按照更新时间排序
        novels = novels.concat(Object.values(userNovels).reverse())
    })

    util.debugFunc(() => {
        java.log(`获取用户搜索小说结束`)
    })
    return novels
}

function getSeries(seriesName){
    const MAXPAGES = 3
    let novelList = []
    java.log(util.urlSearchSeries(seriesName,1))
    let resp = util.getAjaxJson(util.urlSearchSeries(seriesName,1))
    novelList = novelList.concat(resp.body.novel.data)
    for (let i=Number(java.get("page"))+1 ; i<resp.body.novel.lastPage, i<MAXPAGES; i++) {
        java.log(`页面：${i}`)
        novelList = novelList.concat(util.getAjaxJson(util.urlSearchSeries(seriesName, i)).body.novel.data)
    }
    return novelList
}

(() => {
    let novelsList = []
    novelsList = novelsList.concat(JSON.parse(result).body.novel.data)
    // novelsList = novelsList.concat(getSeries(String(java.get("key"))))
    // novelsList = novelsList.concat(getUserNovels(String(java.get("key"))))
    return util.formatNovels(handNovels(util.combineNovels(novelsList)))
})();