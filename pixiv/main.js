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

//不可使用 base 内的 util.getAjaxJson() 替换
function getAjaxJson(url) {
    return util.cacheGetAndSet(url, () => {
        return JSON.parse(java.ajax(url))
    })
}

function getWebviewJson(url, parseFunc) {
    return util.cacheGetAndSet(url, () => {
        let html = java.webView(null, url, null)
        return JSON.parse(parseFunc(html))
    })
}

var first = true;
// 存储seriesID·
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

//处理novels列表
//查询作者
function handNovels(novels) {
    novels.forEach(novel => {
        if (novel.tags === undefined || novel.tags === null) {
            novel.tags = []
        }

        if (novel.seriesId === undefined || novel.seriesId === null) {
            novel.tags.unshift("单本")
        } else {
            let userAllWorks = getAjaxJson(util.urlUserAllWorks(novel.userId)).body
            for (let series of userAllWorks.novelSeries) {
                if (series.id === novel.seriesId) {
                    // let series = getAjaxJson(util.urlSeries(novel.seriesId)).body
                    novel.textCount = series.publishedTotalCharacterCount
                    novel.url = series.cover.urls["480mw"]
                    novel.title = series.title
                    novel.tags = series.tags
                    novel.description = series.caption

                    // 发送请求获取第一章 获取标签与简介
                    if (novel.tags.length === 0 || novel.description === "") {
                        let firstNovel = getAjaxJson(util.urlNovelDetailed(series.firstNovelId)).body
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
    let match = html.match(new RegExp("/users/\\d+/novels"))
    if (match === null || match.length === 0) {
        return []
    }

    let regNumber = new RegExp("\\d+")
    let uidList = match.map(v => {
        return v.match(regNumber)[0]
    })

    // 仅限3个作者
    if (uidList.length >= 3) {
        uidList.length = 3
    }

    let novels = []
    let page = Number(java.get("page"))

    uidList.forEach(id => {
        let r = getAjaxJson(util.urlUserAllWorks(id))
        let novelsId = Object.keys(r.body.novels).reverse().slice((page - 1) * 20, page * 20)
        let url = util.urlUserNovels(id, novelsId)
        util.debugFunc(() => {
            java.log(`发送获取作者小说的Ajax请求:${url}`)
        })
        let userNovels = getWebviewJson(url, html => {
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

(() => {
    //作者 TAG 书名都要支持
    let resp = JSON.parse(result);
    let novelsList = getUserNovels(String(java.get("key")))
    novelsList = novelsList.concat(resp.body.novel.data)
    return util.formatNovels(handNovels(combineNovels(novelsList)))
})();