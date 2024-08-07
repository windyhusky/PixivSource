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
    u.debugFunc = (func) => {
        if (String(source.getVariable()) === "debug") {
            func()
        }
    }

    u.urlNovelDetailed = (nid) => {
        return `https://www.pixiv.net/ajax/novel/${nid}`
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

    u.urlIllustDetailed = (illustId) => {
        return `https://www.pixiv.net/ajax/illust/${illustId}?lang=zh`
    }
    u.urlSeriesIllusts = (seriesId) => {
        return `https://www.pixiv.net/ajax/series/${seriesId}?p=1&lang=zh`
    }
    // 完全匹配用户名
    u.urlSearchUser = (username) =>  {
        return `https://www.pixiv.net/search_user.php?s_mode=s_usr&nick=${encodeURI(username)}&nick_mf=1`
    }

    u.urlUserAllWorks = (uid)  => {
        return `https://www.pixiv.net/ajax/user/${uid}/profile/all?lang=zh`
    }

    u.urlUserNovels = (uid, nidList) => {
        return `https://www.pixiv.net/ajax/user/${uid}/novels?${nidList.map(v => "ids[]=" + v).join("&")}`
    }
    u.urlCoverUrl = function(pxImgUrl) {
        return `https://pximg.furrynovel.ink/?url=${pxImgUrl}`
    }

    u.formatNovels = function (novels) {
        novels.forEach(novel => {
            novel.detailedUrl = util.urlNovelDetailed(novel.id)
            const time = this.dateFormat(novel.updateDate);
            novel.tags = novel.tags.join(",")
            novel.coverUrl = urlCoverUrl(novel.url)
            novel.description += `\n更新时间:${time}`
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
        // let h = addZero(time.getHours()) + "时";
        // let m = addZero(time.getMinutes()) + "分";

        // return Y + M + D + h + m;
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