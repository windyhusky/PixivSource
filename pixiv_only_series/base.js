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

    u.cacheGetAndSet = (key, supplyFunc) => {
        let v = cache.get(key)
        if (v === undefined || v === null) {
            v = JSON.stringify(supplyFunc())
            // 缓存10分钟
            cache.put(key, v, 600)
        }
        return JSON.parse(v)
    }
    u.getAjaxJson = (url) => {
        return util.cacheGetAndSet(url, () => {
            return JSON.parse(java.ajax(url))
        })
    }
    u.getWebviewJson = (url, parseFunc) => {
        return util.cacheGetAndSet(url, () => {
            let html = java.webView(null, url, null)
            return JSON.parse(parseFunc(html))
        })
    }
    u.debugFunc = (func) => {
        if (String(source.getVariable()) === "debug") {
            func()
        }
    }

    u.urlNovelUrl = (nid) => {
        return `https://www.pixiv.net/novel/show.php?id=${nid}`
    }
    u.urlNovelDetailed = (nid) => {
        return `https://www.pixiv.net/ajax/novel/${nid}`
    }
    u.urlSeriesUrl = (seriesId) => {
        return `https://www.pixiv.net/novel/series/${seriesId}`
    }
    u.urlSeries = (seriesId) => {
        return `https://www.pixiv.net/ajax/novel/series/${seriesId}?lang=zh`
    }
    u.urlSeriesNovels = (seriesId, limit, offset) => {
        if (limit > 30) {
            limit = 30
        }

        if (limit < 10) {
            limit = 10
        }

        return `https://www.pixiv.net/ajax/novel/series_content/${seriesId}?limit=${limit}&last_order=${offset}&order_by=asc&lang=zh`
    }
    u.searchNovel = (novelName, page) =>{
        return `https://www.pixiv.net/ajax/search/novels/${encodeURI(novelName)}?word=${encodeURI(novelName)}&order=date_d&mode=all&p=${page}&s_mode=s_tag&lang=zh`
    }
    // 完全匹配用户名
    u.urlSearchUser = (username) => {
        return `https://www.pixiv.net/search_user.php?s_mode=s_usr&nick=${encodeURI(username)}&nick_mf=1`
    }
    u.urlUserAllWorks = (uid) => {
        return `https://www.pixiv.net/ajax/user/${uid}/profile/all?lang=zh`
    }
    u.urlUserNovels = (uid, nidList) => {
        return `https://www.pixiv.net/ajax/user/${uid}/novels?${nidList.map(v => "ids[]=" + v).join("&")}`
    }


    u.urlIllustUrl = (illustId) => {
        return `https://www.pixiv.net/artworks/${illustId}?lang=zh`
    }
    u.urlIllustDetailed = (illustId) => {
        return `https://www.pixiv.net/ajax/illust/${illustId}?lang=zh`
    }
    u.urlSeriesIllusts = (seriesId) => {
        return `https://www.pixiv.net/ajax/series/${seriesId}?p=1&lang=zh`
    }
    u.urlCoverUrl = (url) => {
        return `${url},{"headers": {"Referer":"https://www.pixiv.net/"}}`
    }

    u.formatNovels = function (novels) {
        novels.forEach(novel => {
            novel.detailedUrl = util.urlNovelDetailed(novel.id)
            novel.name = novel.title
            novel.author = novel.userName
            novel.tags = novel.tags.join(",")
            novel.textCount = novel.wordCount
            novel.description = novel.caption
            // const time = this.dateFormat(novel.updateDate);
            const time = this.dateFormat(novel.updateDateTime);
            novel.description += `\n更新时间:${time}`
            novel.coverUrl = util.urlCoverUrl(novel.url)
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