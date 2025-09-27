var checkTimes = 0
var cacheSaveSeconds = 7*24*60*60  // 缓存时间7天


function cacheGetAndSet(cache, key, supplyFunc) {
    let v = cache.get(key)
    if (v === undefined || v === null) {
        v = JSON.stringify(supplyFunc())
        cache.put(key, v, cacheSaveSeconds)
    }
    return JSON.parse(v)
}
function putInCache(objectName, object, saveSeconds) {
    const {java, cache} = this
    if (object === undefined) object = null
    if (saveSeconds === undefined) saveSeconds = 0
    cache.put(objectName, JSON.stringify(object), saveSeconds)
}
function getFromCache(objectName) {
    const {java, cache} = this
    let object = cache.get(objectName)
    if (object === undefined) return null  // 兼容源阅
    return JSON.parse(object)
}

function isHtmlString(str) {
    return str.startsWith("<!DOCTYPE html>")
}
function isJsonString(str) {
    try {
        if (typeof JSON.parse(str) === "object") {
            return true
        }
    } catch(e) {}
    return false
}

function getWebViewUA() {
    const {java, cache} = this
    let userAgent = String(java.getWebViewUA())
    if (userAgent.includes("Windows NT 10.0; Win64; x64")) {
        userAgent = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36"
    }
    // java.log(`userAgent=${userAgent}`)
    cache.put("userAgent", userAgent)
    return String(userAgent)
}
function isLogin() {
    const {java, cache} = this
    let cookie = String(java.getCookie("https://www.pixiv.net/", null))
    return cookie.includes("first_visit_datetime")
}

function getAjaxJson(url, forceUpdate) {
    const {java, cache} = this
    if (forceUpdate === true) {
        let result = JSON.parse(java.ajax(url))
        cache.put(url, JSON.stringify(result), cacheSaveSeconds)
        return result
    }
    return cacheGetAndSet(cache, url, () => {
        return JSON.parse(java.ajax(url))
    })
}
function getAjaxAllJson(urls, forceUpdate) {
    const {java, cache} = this
    if (forceUpdate === true) {
        let result = java.ajaxAll(urls).map(resp => JSON.parse(resp.body()))
        cache.put(urls, JSON.stringify(result), cacheSaveSeconds)
        for (let i in urls) cache.put(urls[i], JSON.stringify(result[i]), cacheSaveSeconds)
        return result
    }
    return cacheGetAndSet(cache, urls, () => {
        let result = java.ajaxAll(urls).map(resp => JSON.parse(resp.body()))
        cache.put(urls, JSON.stringify(result), cacheSaveSeconds)
        for (let i in urls) cache.put(urls[i], JSON.stringify(result[i]), cacheSaveSeconds)
        return result
    })
}
function getWebviewJson(url, parseFunc) {
    const {java, cache} = this
    return cacheGetAndSet(cache, url, () => {
        let html = java.webView(null, url, null)
        return JSON.parse(parseFunc(html))
    })
}

function urlNovelUrl(novelId) {
    return `https://www.pixiv.net/novel/show.php?id=${novelId}`
}
function urlNovelDetailed(novelId) {
    return `https://www.pixiv.net/ajax/novel/${novelId}`
}
function urlNovelsDetailed(userId, nidList) {
    return `https://www.pixiv.net/ajax/user/${userId}/novels?${nidList.map(v => `ids[]=${v}`).join("&")}`
}
function urlNovelBookmarkData(novelId) {
    return `https://www.pixiv.net/ajax/novel/${novelId}/bookmarkData`
}
function urlNovelComments(novelId, offset, limit) {
    return `https://www.pixiv.net/ajax/novels/comments/roots?novel_id=${novelId}&offset=${offset}&limit=${limit}&lang=zh`
}
function urlNovelCommentsReply(commentId, page) {
    return `https://www.pixiv.net/ajax/novels/comments/replies?comment_id=${commentId}&page=${page}&lang=zh`
}
function urlNovelPollAnswer(novelId) {
    return `https://www.pixiv.net/ajax/novel/${novelId}/poll/answer`
}
function urlNovelsRecommendInit(novelId, limit=9) {
    return `https://www.pixiv.net/ajax/novel/${novelId}/recommend/init?limit=${limit}&lang=zh`
}
function urlNovelsRecommendDetailed(nidList) {
    if (nidList.length >= 9) nidList.length = 9
    return `https://www.pixiv.net/ajax/novel/recommend/novels?${nidList.map(v => `novelIds[]=${v}`).join("&")}`
}

function urlSeriesUrl(seriesId) {
    return `https://www.pixiv.net/novel/series/${seriesId}`
}
function urlSeriesDetailed(seriesId) {
    return `https://www.pixiv.net/ajax/novel/series/${seriesId}?lang=zh`
}
function urlSeriesNovelsTitles(seriesId) {
    return `https://www.pixiv.net/ajax/novel/series/${seriesId}/content_titles`
}
function urlSeriesNovels(seriesId, limit, offset) {
    if (limit > 30) limit = 30
    if (limit < 10) limit = 10
    return `https://www.pixiv.net/ajax/novel/series_content/${seriesId}?limit=${limit}&last_order=${offset}&order_by=asc&lang=zh`
}

function urlUserUrl(userID) {
    return `https://www.pixiv.net/users/${userID}/novels`
}
function urlUserDetailed(userID) {
    return `https://www.pixiv.net/ajax/user/${userID}`
}
function urlUserWorkLatest(userID) {
    return `https://www.pixiv.net/ajax/user/${userID}/works/latest`
}
function urlUserAllWorks(userId) {
    return `https://www.pixiv.net/ajax/user/${userId}/profile/all?lang=zh`
}
function urlUserBookmarks(userId) {
    return `https://www.pixiv.net/ajax/user/${userId}/novels/bookmarks?tag=&offset={{(page-1)*30}}&limit=30&rest=show&lang=zh`
}

function urlSearchNovel(novelName, page) {
    return `https://www.pixiv.net/ajax/search/novels/${encodeURI(novelName)}?word=${encodeURI(novelName)}&order=date_d&mode=all&p=${page}&s_mode=s_tag&lang=zh`
}
function urlSearchSeries(seriesName, page) {
    return`https://www.pixiv.net/ajax/search/novels/${encodeURI(seriesName)}?word=${encodeURI(seriesName)}&order=date_d&mode=all&p=${page}&s_mode=s_tag&gs=1&lang=zh`
}
// 不完全匹配用户名
function urlSearchUser(userName, full) {
    if (full === undefined || full === false) {
        return `https://www.pixiv.net/search/users?nick=${userName}&s_mode=s_usr&nick_mf=1`
    } else {
        return `https://www.pixiv.net/search/users?nick=${userName}&s_mode=s_usr_full&i=1`
    }
}

function urlCoverUrl(url) {
    return `${url}, {"headers": {"Referer":"https://www.pixiv.net/"}}`
}
function urlIllustDetailed(illustId) {
    return `https://www.pixiv.net/ajax/illust/${illustId}?lang=zh`
}
function urlIllustOriginal(illustId, order) {
    const {java, cache} = this
    if (order <= 1) order = 1
    let url = urlIllustDetailed(illustId)
    let illustOriginal = cacheGetAndSet(cache, url, () => {
        return JSON.parse(java.ajax(url))
    }).body.urls.original
    return urlCoverUrl(illustOriginal.replace(`_p0`, `_p${order - 1}`))
}
function urlEmojiUrl(emojiId) {
    return urlCoverUrl(`https://s.pximg.net/common/images/emoji/${emojiId}.png`)
}
function urlStampUrl(stampId) {
    return urlCoverUrl(`https://s.pximg.net/common/images/stamp/generated-stamps/${stampId}_s.jpg`)
}

function urlMessageThreadLatest(max) {
    if (max === undefined || max <= 5) max = 5
    return `https://www.pixiv.net/rpc/index.php?mode=latest_message_threads2&num=${max}&lang=zh`
}
function urlMessageThreadContents(threadId, max) {
    return `https://www.pixiv.net/rpc/index.php?mode=message_thread_contents&thread_id=${threadId}&num=${max}`
}
function urlMessageThreadDetail(threadId) {
    return `https://www.pixiv.net/rpc/index.php?mode=message_thread&thread_id=${threadId}`
}
function urlNotification() {
    return `https://www.pixiv.net/ajax/notification&lang=zh`
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
function timeFormat(str) {
    let addZero = function (num) {
        return num < 10 ? '0' + num : num;
    }
    let time = new Date(str);
    let YY = time.getFullYear()
    let MM = addZero(time.getMonth() + 1)
    let DD = addZero(time.getDate())
    let hh = addZero(time.getHours())
    let mm = addZero(time.getMinutes())
    let ss = addZero(time.getSeconds())
    return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`
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
function sleepToast(text, second) {
    const {java} = this
    java.log(text)
    // java.toast(text)
    java.longToast(text)
    if (second === undefined) second = 0.01
    sleep(1000*second)
}

function updateSource() {
    const {java, source} = this
    java.longToast("🆙 更新书源\n\nJsdelivr CDN 更新有延迟\nGithub 更新需代理")
    let onlineSource, comment, sourceName, sourceNameCapitalize, index = 0
    if (source.bookSourceUrl.includes("pixiv")) sourceName = "pixiv"
    else if (source.bookSourceUrl.includes("furrynovel")) sourceName = "linpx"
    sourceNameCapitalize = sourceName[0].toUpperCase() + sourceName.substring(1)

    if (source.bookSourceName.includes("备用")) index = 1
    else if (source.bookSourceName.includes("漫画")) index = 2
    if (source.bookSourceUrl.includes("furrynovel.com")) {
        sourceNameCapitalize = "FurryNovel"
        index = 1
    }

    try {
        let updateUrl = `https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/${sourceName}.json`
        onlineSource = JSON.parse(java.get(updateUrl,{'User-Agent': 'Mozilla/5.0 (Linux; Android 14)','X-Requested-With': 'XMLHttpRequest'}).body())[index]
    } catch (e) {
        try {
            let updateUrl = `https://raw.githubusercontent.com/windyhusky/PixivSource/main/${sourceName}.json`
            onlineSource = JSON.parse(java.get(updateUrl,{'User-Agent': 'Mozilla/5.0 (Linux; Android 14)','X-Requested-With': 'XMLHttpRequest'}).body())[index]
        } catch (e) {
            onlineSource = {lastUpdateTime: new Date().getTime(), bookSourceComment: source.bookSourceComment}
        }
    }
    comment = onlineSource.bookSourceComment.split("\n")
    // onlineSource = source
    // comment = source.bookSourceComment.split("\n")

    let htm = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>更新 ${source.bookSourceName} 书源</title>
    <style> 
    table { text-align: center; margin: 0 auto; } .ann { display: flex; justify-content: center; align-items: center; height: 5vh; } 
    button { background-color: rgb(76, 175, 80); color: white; border: none; border-radius: 4px; height: 6vh; width: 30vw; overflow: hidden; } 
    button span { cursor: pointer; display: inline-block; position: relative; transition: 0.4s; } 
    button span:after { content: '>'; position: absolute; opacity: 0; top: 0; right: 30px; transition: 0.2s; } 
    button:active span { padding-right: 20px; } 
    button:active span:after { opacity: 1; right: -40px; }
    </style>
</head>

<body>
    <table border="1" cellspacing="0">
        <th colspan="2"> ${source.bookSourceName} 书源 <a href="https://github.com/windyhusky/PixivSource/blob/main/doc/${sourceNameCapitalize}.md">🔰 使用指南</a></th>
        <tr>
            <td>☁️ 远程版本：${onlineSource.bookSourceComment.split("\n")[2].replace("书源版本：", "")}</td>
            <td>📆 更新：${timeFormat(onlineSource.lastUpdateTime)}</td>
        </tr>
        <tr>
            <td>📥 本地版本：${source.bookSourceComment.split("\n")[2].replace("书源版本：", "")}</td>
            <td>📆 更新：${timeFormat(source.lastUpdateTime)}</td>
        </tr> 
        <tr><td colspan="2" style="text-align: left;">${comment.slice(3, 10).join("<br>")}</td></tr>
        <tr><td colspan="2" style="text-align: left;">${comment.slice(comment.length-2, comment.length).join("<br>")}</td></tr>
    </table>
    
    <table border="0" cellspacing="20">
        <th colspan="2"> 更新 ${source.bookSourceName} 书源 </th>
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/${sourceName}.json">
            <button><span>更新书源<br>(Jsdelivr CDN)</span></button>
            </a></div></td>
            
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/btsrk.json">
            <button><span>更新订阅<br>(Jsdelivr CDN)</span></button>
            </a></div></td>
        </tr>
        
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://raw.githubusercontent.com/windyhusky/PixivSource/main/${sourceName}.json">
            <button><span>书源链接<br>(GitHub)</span></button>
            </a></div></td>
            
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://raw.githubusercontent.com/windyhusky/PixivSource/main/btsrk.json">
            <button><span>订阅链接<br>(GitHub)</span></button>
            </a></div></td>
        </tr>
        
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/${sourceName}.json">
            <button><span>备用书源链接<br>(Codeberg)</span></button>
            </a></div></td>
            
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/btsrk.json">
            <button><span>备用订阅链接<br>(Codeberg)</span></button>
            </a></div></td>
        </tr>
    </table>
</body>
</html>`;
    java.startBrowser(`data:text/html;charset=utf-8;base64, ${java.base64Encode(htm)}`, '更新书源');
    return []
}