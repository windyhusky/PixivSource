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
        let time = text.slice(0, 10) + text.slice(11, 19)
        // java.log(`${time}`)
        return time
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