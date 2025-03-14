function cacheGetAndSet(cache, key, supplyFunc) {
    let v = cache.get(key)
    if (v === undefined || v === null) {
        v = JSON.stringify(supplyFunc())
        // 缓存10分钟
        cache.put(key, v, 600)
    }
    return JSON.parse(v)
}
function getAjaxJson(url) {
    const {java, cache} = this
    return cacheGetAndSet(cache, url, () => {
        return JSON.parse(java.ajax(url))
    })
}
function getWebviewJson(url, parseFunc) {
    const {java, cache} = this
    return cacheGetAndSet(cache, url, () => {
        let html = java.webView(null, url, null)
        return JSON.parse(parseFunc(html))
    })
}

function urlUserAllWorks(userId) {
    return `https://www.pixiv.net/ajax/user/${userId}/profile/all?lang=zh`
}
function urlSearchArtwork(name, page) {
    return `https://www.pixiv.net/ajax/search/artworks/${encodeURI(name)}?word=${encodeURI(name)}&order=date_d&mode=all&p=${page}s_mode=s_tag&type=all&lang=zh`
}
function urlSearchIllust(name, page) {
    return `https://www.pixiv.net/ajax/search/artworks/${encodeURI(name)}?word=${encodeURI(name)}&order=date_d&mode=all&p=${page}s_mode=s_tag&type=illust&lang=zh`
}
function urlSearchManga(name, page) {
    return `https://www.pixiv.net/ajax/search/manga/${encodeURI(name)}?word=${encodeURI(name)}&order=date_d&mode=all&p=${page}s_mode=s_tag&type=manga&lang=zh`
}
function urlSearchUgoira(name, page) {
    return `https://www.pixiv.net/ajax/search/manga/${encodeURI(name)}?word=${encodeURI(name)}&order=date_d&mode=all&p=${page}s_mode=s_tag&type=ugoira&lang=zh`
}

// 完全匹配用户名
function urlSearchUser(name) {
    return `https://www.pixiv.net/search/users?nick=${encodeURI(name)}&s_mode=s_usr&nick_mf=1`
}

function urlCoverUrl(url) {
    return `${url}, {"headers": {"Referer":"https://www.pixiv.net/"}}`
}
function urlIllustUrl(illustId) {
    return `https://www.pixiv.net/artworks/${illustId}`
}
function urlIllustDetailed(illustId) {
    return `https://www.pixiv.net/ajax/illust/${illustId}?lang=zh`
}

function urlSeriesIllustsUrl(userId, seriesId) {
    return `https://www.pixiv.net/user/${userId}/series/${seriesId}`
}
function urlSeriesIllustsDetailed(seriesId) {
    return `https://www.pixiv.net/ajax/series/${seriesId}?p=1&lang=zh`
}


function dateFormat(str) {
    let addZero = function (num) {
        return num < 10 ? '0' + num : num;
    }
    let time = new Date(str);
    let Y = time.getFullYear() + "年";
    let M = addZero(time.getMonth() + 1) + "月";
    let D = addZero(time.getDate()) + "日";
    return Y + M + D;
}
function timeTextFormat(text) {
    return `${text.slice(0, 10)} ${text.slice(11, 19)}`
}
function sleep(time) {
    let endTime = new Date().getTime() + time
    while(true){
        if (new Date().getTime() > endTime){
            return;
        }
    }
}
function sleepToast(text) {
    const {java} = this
    java.longToast(text)
    sleep(2000)
}

function isJsonString(str) {
    try {
        if (typeof JSON.parse(str) === "object") {
            return true
        }
    } catch(e) {}
    return false
}