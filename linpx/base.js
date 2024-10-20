var util = {}

function objStringify(obj) {
    return JSON.stringify(obj, (n, v) => {
        if (typeof v == "function")
            return v.toString();
        return v;
    });
}

function publicFunc() {
    let u = {}

    u.cacheGetAndSet = function (key, supplyFunc) {
        let v = cache.get(key)
        if (v === undefined || v === null) {
            v = JSON.stringify(supplyFunc())
            // 缓存10分钟
            cache.put(key, v, 600)
        }
        return JSON.parse(v)
    }
    u.getAjaxJson = function (url) {
        return util.cacheGetAndSet(url, () => {
            return JSON.parse(java.ajax(url))
        })
    }
    u.getWebviewJson = function (url) {
        return util.cacheGetAndSet(url, () => {
            let html = java.webView(null, url, null)
            return JSON.parse((html.match(new RegExp(">\\[\\{.*?}]<"))[0].replace(">", "").replace("<", "")))
        })
    }


    u.debugFunc = (func) => {
        if (String(source.getVariable()) === "debug") {
            func()
        }
    }

    u.urlNovelUrl = function (id){
        return `https://api.furrynovel.ink/pixiv/novel/${id}/cache`
    }
    u.urlSeriesUrl = function (id){
        return `https://api.furrynovel.ink/pixiv/series/${id}/cache`
    }
    u.urlUserUrl = function (id) {
        return `https://api.furrynovel.ink/pixiv/user/${id}/cache`
    }
    u.urlSearchNovel = function (novelname) {
        return `https://api.furrynovel.ink/pixiv/search/novel/${novelname}/cache`
    }
    u.urlSearchUsers = function (username) {
        return `https://api.furrynovel.ink/pixiv/search/user/${username}/cache`
    }
    u.urlNovelsDetailed = function (nidList) {
        return `https://api.furrynovel.ink/pixiv/novels/cache?${nidList.map(v => "ids[]=" + v).join("&")}`
    }
    u.urlUserDetailed = function (nidList) {
        return `https://api.furrynovel.ink/pixiv/users/cache?${nidList.map(v => "ids[]=" + v).join("&")}`
    }
    u.urlCoverUrl = function (pxImgUrl) {
        return `https://pximg.furrynovel.ink/?url=${pxImgUrl}&w=800`
    }
    u.urlIllustOriginal = function (illustId, order) {
        // 使用 pixiv.cat 获取插图
        let illustOriginal = `https://pixiv.re/${illustId}.png`
        // let illustOriginal = `https://pixiv.nl/${illustId}.png`
        if (order >= 1) {
            illustOriginal = `https://pixiv.re/${illustId}-${order}.png`
            // illustOriginal = `https://pixiv.nl/${illustId}-${order}.png`
        }
        return illustOriginal
    }

    u.formatNovels = function (novels) {
        novels.forEach(novel => {
            // novel.createDate = novel.createDate
            novel.textCount = novel.length
            novel.description = novel.desc
            novel.detailedUrl = util.urlNovelUrl(novel.id)
            if (novel.seriesId !== undefined && novel.seriesId !== null) {
                novel.title = novel.seriesTitle
                novel.length = null

                java.log(`正在获取系列小说：${novel.seriesId}`)
                let series = util.getAjaxJson(util.urlSeriesUrl(novel.seriesId))
                // 后端目前没有系列的coverUrl字段
                // novel.coverUrl = util.urlCoverUrl(series.coverUrl)
                novel.coverUrl = util.urlCoverUrl(series.novels[0].coverUrl)

                if (series.caption === "") {
                    let firstNovels = util.getAjaxJson(util.urlNovelsDetailed([series.novels[0].id]))
                    if (firstNovels.length > 0) {
                        novel.description = firstNovels[0].desc
                    } else {
                        novel.description = "该小说可能部分章节因为权限或者被删除无法查看"
                    }
                } else {
                    novel.description = series.caption
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
                if (novel.tags === undefined) {
                    novel.tags = []
                }
                novel.tags.unshift("单本")
                // novel.coverUrl = `https://api.furrynovel.ink/proxy/pximg?url=${novel.coverUrl}`
                novel.coverUrl = util.urlCoverUrl(novel.coverUrl)
            }

            novel.tags = novel.tags.join(",")
            novel.time = util.dateFormat(novel.createDate)
            novel.description = `${novel.description}\n更新时间：${novel.time}`
            // novel.description = `书名：${novel.title}\n作者：${novel.userName}\n${novel.description}\n更新时间：${novel.time}`
        })
        return novels
    }

    u.dateFormat = function (str) {
        let addZero = function (num) {
            return num < 10 ? '0' + num : num;
        }
        let time = new Date(str);
        let Y = time.getFullYear() + "年";
        let M = addZero(time.getMonth() + 1) + "月";
        let D = addZero(time.getDate()) + "日";
        return Y + M + D;
    }
    u.timeStampFormat = function (int) {
        let addZero = function (num) {
            return num < 10 ? '0' + num : num;
        }
        let time = new Date(int * 1000);
        let Y = time.getFullYear()
        let M = addZero(time.getMonth() + 1)
        let D = addZero(time.getDate())
        let h = addZero(time.getHours())
        let m = addZero(time.getMinutes())
        let s = addZero(time.getSeconds())
        return `${Y}-${M}-${D} ${h}:${m}:${s}`
    }
    u.timeTextFormat = function (text) {
        return `${text.slice(0, 10)} ${text.slice(11, 19)}`
    }

    util = u
    java.put("util", objStringify(u))
}

publicFunc()

// 获取请求的user id方便其他ajax请求构造
let uid = java.getResponse().headers().get("x-userid")
if (uid != null) {
    cache.put("pixiv:uid", uid)
}
java.getStrResponse(null, null)