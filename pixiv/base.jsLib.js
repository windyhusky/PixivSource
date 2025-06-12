var checkTimes = 0
var cacheSaveSeconds = 7*24*60*60  // 缓存时间7天


// 检测备用书源
function isBackupSource() {
    const {source} = this
    return source.bookSourceName.includes("备用")
}

// 检测 源阅
// 可用 java.ajax() java.webview() 不支持 java.ajaxAll()
// 可用 java.getCookie() cache.put() cache.get()
// 可用 source.bookSourceName source.getVariable() 等
// java.getUserAgent() java.getWebViewUA() 目前返回内容相同
function isSourceRead() {
    const {java, cache} = this
    let isSourceRead = JSON.parse(cache.get("isSourceRead"))
    if (isSourceRead === null) {
        isSourceRead = (java.getUserAgent() === java.getWebViewUA())
        cache.put("isSourceRead", JSON.stringify(isSourceRead))
    }
    return isSourceRead
}

function cacheGetAndSet(cache, key, supplyFunc) {
    let v = cache.get(key)
    if (v === undefined || v === null) {
        v = JSON.stringify(supplyFunc())
        cache.put(key, v, cacheSaveSeconds)
    }
    return JSON.parse(v)
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
        return result
    }
    return cacheGetAndSet(cache, urls, () => {
        return java.ajaxAll(urls).map(resp => JSON.parse(resp.body()))
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
    return `https://www.pixiv.net/ajax/user/${userId}/novels?${nidList.map(v => "ids[]=" + v).join("&")}`
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

function urlSearchNovel(novelName, page) {
    return `https://www.pixiv.net/ajax/search/novels/${novelName}?word=${novelName}&order=date_d&mode=all&p=${page}&s_mode=s_tag&lang=zh`
}
function urlSearchSeries(seriesName, page) {
    return`https://www.pixiv.net/ajax/search/novels/${seriesName}?word=${seriesName}&order=date_d&mode=all&p=${page}&s_mode=s_tag&gs=1&lang=zh`
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
    java.longToast(text)
    if (second === undefined || second <= 3) {second = 3}
    sleep(1000*second)
}

function updateSource() {
    const {java, source} = this
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
        comment = onlineSource.bookSourceComment.split("\n")
    } catch (e) {
        try {
            let updateUrl = `https://raw.githubusercontent.com/windyhusky/PixivSource/main/${sourceName}.json`
            onlineSource = JSON.parse(java.get(updateUrl,{'User-Agent': 'Mozilla/5.0 (Linux; Android 14)','X-Requested-With': 'XMLHttpRequest'}).body())[index]
            comment = onlineSource.bookSourceComment.split("\n")
        } catch (e) {
            onlineSource = {lastUpdateTime: new Date().getTime()}
            comment = source.bookSourceComment.split("\n")
        }
    }
    // comment = source.bookSourceComment.split("\n")
    let htm = `data:text/html; charset=utf-8,
<html>
<head>
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
        <tr><td colspan="2" style="text-align: left;">${comment.slice(comment.length-15, comment.length).join("<br>")}</td></tr>
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
    java.startBrowser(htm,'更新书源');
    return []
}