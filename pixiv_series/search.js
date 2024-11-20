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

function handNovels(novels){
    novels.forEach(novel => {
        if (novel.tags === undefined || novel.tags === null) {
            novel.tags = []
        }

        if (novel.isOneshot !== undefined) { // 搜索系列
            // novel.title = novel.title
            novel.url = novel.cover.urls["480mw"]
            novel.description = novel.caption
            novel.textCount = novel.textLength

            if (novel.isOneshot === true) {
                novel.id = novel.novelId  // 获取真正的 novelid
                novel.tags.unshift("单本")
            } else {  //系列
                novel.seriesId = novel.id  // 获取系列小说id
                // novel.id = novel.latestEpisodeId  // 最近一篇
                // novel.lastChapter = this.getAjaxJson(this.urlNovelDetailed(novel.id)).body.title
            }

        } else {  // 搜索作者
            // novel.id = novel.id
            // novel.url = novel.url
            // novel.description = novel.description
            // novel.textCount = novel.textCount
            if (novel.seriesId === undefined || novel.seriesId === null) {
                // novel.title = novel.title  // 搜索作者获取的单篇
                novel.seriesId = undefined
                novel.latestChapter = novel.title
                novel.tags.unshift("单本")
            } else {  // 搜索作者获取的系列篇目
                novel.title = novel.seriesTitle
                // novel.seriesId = novel.seriesId
            }
        }

        if (novel.seriesId !== undefined && novel.seriesId !== null) {
            let series = util.getAjaxJson(util.urlSeries(novel.seriesId)).body
            novel.id = series.firstNovelId
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
        let url = util.urlUserNovels(id, novelsId)
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

(() => {
    let novelsList = []
    novelsList = novelsList.concat((JSON.parse(result).body.novel.data))
    novelsList = novelsList.concat(getUserNovels(String(java.get("key"))))
    return util.formatNovels(handNovels(novelsList))
})();